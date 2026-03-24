"use server";

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

export type TaskType = "automated" | "scheduled" | "quick";
export type TaskStatus = "pending" | "completed";

export async function getTasks(userId: string) {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM tasks WHERE user_id = ? ORDER BY scheduled_for ASC",
      args: [userId],
    });
    return { success: true, tasks: JSON.parse(JSON.stringify(result.rows)) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch tasks:", error);
    return { success: false, error: message };
  }
}

export async function getScheduledTasks(userId: string) {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM tasks WHERE user_id = ? AND type = 'scheduled' ORDER BY scheduled_for ASC",
      args: [userId],
    });
    return { success: true, tasks: JSON.parse(JSON.stringify(result.rows)) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch scheduled tasks:", error);
    return { success: false, error: message };
  }
}

export async function createTask(data: {
  userId: string;
  title: string;
  type: TaskType;
  status?: TaskStatus;
  scheduledFor?: string | null;
  durationMins?: number | null;
}) {
  try {
    const status = data.status || "pending";

    const result = await db.execute({
      sql: `INSERT INTO tasks (user_id, title, type, status, scheduled_for, duration_mins)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        parseInt(data.userId),
        data.title,
        data.type,
        status,
        data.scheduledFor || null,
        data.durationMins || null,
      ],
    });

    revalidatePath("/dashboard");
    return { success: true, id: result.lastInsertRowid?.toString() };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to create task:", error);
    return { success: false, error: message };
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  try {
    await db.execute({
      sql: "UPDATE tasks SET status = ? WHERE id = ?",
      args: [status, id],
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to update task:", error);
    return { success: false, error: message };
  }
}

export async function deleteTask(id: string) {
  try {
    await db.execute({
      sql: "DELETE FROM tasks WHERE id = ?",
      args: [id],
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to delete task:", error);
    return { success: false, error: message };
  }
}

export async function autoScheduleTask(
  userId: string,
  title: string,
  durationMins: number = 25,
) {
  try {
    const now = new Date();

    // Fetch future scheduled tasks to check for conflicts
    const result = await db.execute({
      sql: "SELECT scheduled_for, duration_mins FROM tasks WHERE user_id = ? AND type = 'scheduled' AND scheduled_for >= ? ORDER BY scheduled_for ASC",
      args: [userId, now.toISOString()],
    });

    const existingTasks = result.rows.map((row) => ({
      start: new Date(row.scheduled_for as string),
      end: new Date(
        new Date(row.scheduled_for as string).getTime() +
          ((row.duration_mins as number) || 25) * 60000,
      ),
    }));

    // Start looking for a slot from the next 15-minute mark
    let proposedStart = new Date();
    proposedStart.setMinutes(
      Math.ceil(proposedStart.getMinutes() / 15) * 15,
      0,
      0,
    );

    let slotFound = false;

    while (!slotFound) {
      const proposedEnd = new Date(
        proposedStart.getTime() + durationMins * 60000,
      );
      let conflict = false;

      for (const task of existingTasks) {
        // Overlap condition: proposed start is before task ends AND proposed end is after task starts
        if (proposedStart < task.end && proposedEnd > task.start) {
          conflict = true;
          // Move proposed start to the end of the conflicting task
          proposedStart = new Date(task.end);
          break;
        }
      }

      if (!conflict) {
        slotFound = true;
      }
    }

    const scheduledFor = proposedStart.toISOString();

    const insertResult = await db.execute({
      sql: `INSERT INTO tasks (user_id, title, type, status, scheduled_for, duration_mins)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        parseInt(userId),
        title,
        "scheduled",
        "pending",
        scheduledFor,
        durationMins,
      ],
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      id: insertResult.lastInsertRowid?.toString(),
      scheduledFor,
      durationMins,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to auto-schedule task:", error);
    return { success: false, error: message };
  }
}
