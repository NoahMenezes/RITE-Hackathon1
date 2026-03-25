"use server";

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

export type TaskType = "automated" | "scheduled" | "quick" | "habit";
export type TaskStatus = "pending" | "completed";

export type Task = {
  id: number;
  user_id: number;
  title: string;
  type: TaskType;
  status: TaskStatus;
  scheduled_for: string | null;
  duration_mins: number | null;
  recurring: string | null;
  created_at: string;
};

export type TaskTemplate = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  tasks: {
    title: string;
    type: TaskType;
    durationMins?: number;
    priority?: number;
  }[];
  createdAt: string;
};

export type RecurringConfig = {
  frequency: "daily" | "weekly" | "monthly";
  interval: number; // every X days/weeks/months
  endDate?: string;
  daysOfWeek?: number[]; // 0-6 for weekly
};

export type Habit = {
  id: string;
  userId: string;
  title: string;
  targetDays: number; // per week/month
  currentStreak: number;
  longestStreak: number;
  lastCompleted?: string;
  createdAt: string;
};

export async function getTasks(userId: string) {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM tasks WHERE user_id = ? ORDER BY scheduled_for ASC",
      args: [parseInt(userId)],
    });
    return {
      success: true,
      tasks: JSON.parse(JSON.stringify(result.rows)) as Task[],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch tasks:", error);
    return { success: false, error: message };
  }
}

export async function getScheduledTasks(userId: string) {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM tasks WHERE user_id = ? ORDER BY scheduled_for ASC",
      args: [parseInt(userId)],
    });
    return { success: true, tasks: JSON.parse(JSON.stringify(result.rows)) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch scheduled tasks:", error);
    return { success: false, error: message };
  }
}

export async function getTasksByDate(userId: string, date: string) {
  try {
    const start = new Date(date + "T00:00:00").toISOString();
    const end = new Date(date + "T23:59:59").toISOString();
    const result = await db.execute({
      sql: "SELECT * FROM tasks WHERE user_id = ? AND scheduled_for >= ? AND scheduled_for <= ? ORDER BY scheduled_for ASC",
      args: [parseInt(userId), start, end],
    });
    return { success: true, tasks: JSON.parse(JSON.stringify(result.rows)) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to fetch tasks by date:", error);
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

export async function seedDemoData(userId: string) {
  try {
    const now = new Date();
    const demoTasks = [
      {
        title: "Morning Standup Meeting",
        type: "scheduled" as const,
        status: "pending" as const,
        scheduledFor: new Date(
          now.getTime() + 2 * 60 * 60 * 1000,
        ).toISOString(), // 2 hours from now
        durationMins: 30,
      },
      {
        title: "Study Operating Systems",
        type: "scheduled" as const,
        status: "pending" as const,
        scheduledFor: new Date(
          now.getTime() + 4 * 60 * 60 * 1000,
        ).toISOString(), // 4 hours from now
        durationMins: 25,
      },
      {
        title: "Review Pull Request",
        type: "scheduled" as const,
        status: "pending" as const,
        scheduledFor: new Date(
          now.getTime() + 6 * 60 * 60 * 1000,
        ).toISOString(), // 6 hours from now
        durationMins: 45,
      },
      {
        title: "Quick email replies",
        type: "quick" as const,
        status: "pending" as const,
        scheduledFor: null,
        durationMins: 15,
      },
      {
        title: "Call client about project update",
        type: "quick" as const,
        status: "pending" as const,
        scheduledFor: null,
        durationMins: 10,
      },
    ];

    interface SqlStatement {
      sql: string;
      args: (string | number | null)[];
    }

    const statements: SqlStatement[] = [
      {
        sql: "DELETE FROM tasks WHERE user_id = ?",
        args: [parseInt(userId)],
      },
    ];

    for (const task of demoTasks) {
      statements.push({
        sql: `INSERT INTO tasks (user_id, title, type, status, scheduled_for, duration_mins)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          parseInt(userId),
          task.title,
          task.type,
          task.status,
          task.scheduledFor ?? null,
          task.durationMins ?? null,
        ],
      });
    }

    await db.batch(statements, "write");

    revalidatePath("/dashboard");
    return { success: true, message: "Demo data seeded successfully!" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to seed demo data:", error);
    return { success: false, error: message };
  }
}

export type ChatRole = "user" | "bot";

export async function saveChatMessage(
  userId: string,
  message: string,
  role: ChatRole,
) {
  try {
    await db.execute({
      sql: "INSERT INTO chat_history (user_id, message, role) VALUES (?, ?, ?)",
      args: [parseInt(userId), message, role],
    });
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to save chat message:", error);
    return { success: false, error: message };
  }
}

export async function getChatHistory(userId: string, limit: number = 20) {
  try {
    const result = await db.execute({
      sql: "SELECT message, role, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
      args: [parseInt(userId), limit],
    });

    // Return in chronological order (oldest first for conversation context)
    return {
      success: true,
      messages: result.rows.reverse().map((row) => ({
        message: row.message,
        role: row.role,
        created_at: row.created_at,
      })),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to get chat history:", error);
    return { success: false, error: message, messages: [] };
  }
}

// Task Templates
export async function createTaskTemplate(
  userId: string,
  name: string,
  description: string | undefined,
  tasks: TaskTemplate["tasks"],
) {
  try {
    const templateData = JSON.stringify({ name, description, tasks });
    const result = await db.execute({
      sql: "INSERT INTO task_templates (user_id, data) VALUES (?, ?)",
      args: [parseInt(userId), templateData],
    });
    revalidatePath("/dashboard");
    return { success: true, id: result.lastInsertRowid?.toString() };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to create task template:", error);
    return { success: false, error: message };
  }
}

export async function getTaskTemplates(userId: string) {
  try {
    const result = await db.execute({
      sql: "SELECT id, data, created_at FROM task_templates WHERE user_id = ? ORDER BY created_at DESC",
      args: [parseInt(userId)],
    });
    const templates: TaskTemplate[] = result.rows.map((row) => {
      const data = JSON.parse(row.data as string);
      return {
        id: row.id!.toString(),
        userId,
        ...data,
        createdAt: row.created_at as string,
      };
    });
    return { success: true, templates };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to get task templates:", error);
    return { success: false, error: message, templates: [] };
  }
}

export async function instantiateTemplate(userId: string, templateId: string) {
  try {
    const templatesRes = await getTaskTemplates(userId);
    if (!templatesRes.success) return templatesRes;

    const template = templatesRes.templates.find((t) => t.id === templateId);
    if (!template) return { success: false, error: "Template not found" };

    const createdTasks = [];
    for (const task of template.tasks) {
      const result = await createTask({
        userId,
        title: task.title,
        type: task.type,
        durationMins: task.durationMins,
      });
      if (result.success) createdTasks.push(result.id);
    }

    revalidatePath("/dashboard");
    return { success: true, createdTasks };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to instantiate template:", error);
    return { success: false, error: message };
  }
}

// Recurring Tasks
export async function createRecurringTask(
  userId: string,
  title: string,
  type: TaskType,
  durationMins: number | null,
  recurring: RecurringConfig,
  startDate: string,
) {
  try {
    const recurringData = JSON.stringify(recurring);
    const result = await db.execute({
      sql: `INSERT INTO tasks (user_id, title, type, status, scheduled_for, duration_mins, recurring)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        parseInt(userId),
        title,
        type,
        "pending",
        startDate,
        durationMins,
        recurringData,
      ],
    });
    revalidatePath("/dashboard");
    return { success: true, id: result.lastInsertRowid?.toString() };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to create recurring task:", error);
    return { success: false, error: message };
  }
}

export async function generateRecurringInstances(userId: string) {
  try {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead

    const result = await db.execute({
      sql: "SELECT * FROM tasks WHERE user_id = ? AND recurring IS NOT NULL",
      args: [parseInt(userId)],
    });

    const recurringTasks = result.rows.filter((row) => row.recurring);
    const newTasks = [];

    for (const task of recurringTasks) {
      const recurring: RecurringConfig = JSON.parse(task.recurring as string);
      const nextDate = new Date(task.scheduled_for as string);

      while (nextDate <= futureDate) {
        // Check if instance already exists
        const existing = await db.execute({
          sql: "SELECT id FROM tasks WHERE user_id = ? AND title = ? AND scheduled_for = ?",
          args: [parseInt(userId), task.title, nextDate.toISOString()],
        });

        if (existing.rows.length === 0) {
          const insertResult = await db.execute({
            sql: `INSERT INTO tasks (user_id, title, type, status, scheduled_for, duration_mins)
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [
              parseInt(userId),
              task.title,
              task.type,
              "pending",
              nextDate.toISOString(),
              task.duration_mins,
            ],
          });
          newTasks.push(insertResult.lastInsertRowid);
        }

        // Calculate next occurrence
        switch (recurring.frequency) {
          case "daily":
            nextDate.setDate(nextDate.getDate() + recurring.interval);
            break;
          case "weekly":
            nextDate.setDate(nextDate.getDate() + 7 * recurring.interval);
            break;
          case "monthly":
            nextDate.setMonth(nextDate.getMonth() + recurring.interval);
            break;
        }

        if (recurring.endDate && nextDate > new Date(recurring.endDate)) break;
      }
    }

    revalidatePath("/dashboard");
    return { success: true, generated: newTasks.length };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to generate recurring instances:", error);
    return { success: false, error: message };
  }
}

// Smart Prioritization
export async function prioritizeTasks(userId: string) {
  try {
    const tasksRes = await getTasks(userId);
    if (!tasksRes.success) return tasksRes;

    const tasks = tasksRes.tasks!;

    // Simple prioritization algorithm
    const prioritized = tasks
      .map((task: Task) => {
        let priority = 1; // base priority

        // Increase priority for overdue tasks
        if (task.scheduled_for && new Date(task.scheduled_for) < new Date()) {
          priority += 3;
        }

        // Increase for shorter duration (easier to complete)
        if (task.duration_mins && task.duration_mins <= 25) {
          priority += 1;
        }

        // Increase for scheduled tasks
        if (task.type === "scheduled") {
          priority += 2;
        }

        // Decrease for completed
        if (task.status === "completed") {
          priority = 0;
        }

        return { ...task, priority };
      })
      .sort(
        (a: Task & { priority: number }, b: Task & { priority: number }) =>
          b.priority - a.priority,
      );

    return { success: true, tasks: prioritized };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to prioritize tasks:", error);
    return { success: false, error: message };
  }
}

// Habit Tracking
export async function createHabit(
  userId: string,
  title: string,
  targetDays: number,
) {
  try {
    const habitData = JSON.stringify({
      title,
      targetDays,
      currentStreak: 0,
      longestStreak: 0,
    });
    const result = await db.execute({
      sql: "INSERT INTO habits (user_id, data) VALUES (?, ?)",
      args: [parseInt(userId), habitData],
    });
    revalidatePath("/dashboard");
    return { success: true, id: result.lastInsertRowid?.toString() };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to create habit:", error);
    return { success: false, error: message };
  }
}

export async function getHabits(userId: string) {
  try {
    const result = await db.execute({
      sql: "SELECT id, data, created_at FROM habits WHERE user_id = ? ORDER BY created_at DESC",
      args: [parseInt(userId)],
    });
    const habits: Habit[] = result.rows.map((row) => {
      const data = JSON.parse(row.data as string);
      return {
        id: row.id!.toString(),
        userId,
        ...data,
        createdAt: row.created_at as string,
      };
    });
    return { success: true, habits };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to get habits:", error);
    return { success: false, error: message, habits: [] };
  }
}

export async function completeHabit(userId: string, habitId: string) {
  try {
    const habitsRes = await getHabits(userId);
    if (!habitsRes.success) return habitsRes;

    const habit = habitsRes.habits.find((h) => h.id === habitId);
    if (!habit) return { success: false, error: "Habit not found" };

    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompleted
      ? new Date(habit.lastCompleted).toDateString()
      : null;

    let newStreak = habit.currentStreak;
    if (lastCompleted === today) {
      // Already completed today
      return { success: true };
    } else if (
      lastCompleted === new Date(Date.now() - 86400000).toDateString()
    ) {
      // Completed yesterday, increment streak
      newStreak += 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }

    const updatedData = JSON.stringify({
      ...habit,
      currentStreak: newStreak,
      longestStreak: Math.max(habit.longestStreak, newStreak),
      lastCompleted: new Date().toISOString(),
    });

    await db.execute({
      sql: "UPDATE habits SET data = ? WHERE id = ?",
      args: [updatedData, parseInt(habitId)],
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to complete habit:", error);
    return { success: false, error: message };
  }
}
