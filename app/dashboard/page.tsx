"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../lib/useUser";
import Footer from "../components/Footer";
import ShineBorder from "../components/ShineBorder";
import { getScheduledTasks } from "../actions/tasks";
import { Play } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [tasks, setTasks] = useState<Record<string, any>[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (user) {
      getScheduledTasks(user.id.toString()).then((res) => {
        if (res.success && res.tasks) setTasks(res.tasks);
        setLoadingTasks(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center font-black text-base">
        Initializing Secure Protocol...
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/40">
      <main className="flex flex-col items-center justify-center pb-40 px-12 relative z-10 w-full min-h-screen">
        <div className="text-center mb-24 max-w-4xl w-full">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1]">
            Main <br />
            <span className="text-blue-600">Dashboard.</span>
          </h1>
          <div className="w-64 h-2 bg-white mx-auto my-12 shadow-2xl shadow-blue-500/50" />
          <p className="text-sm text-zinc-400 font-bold">
            Access Granted. Identity: {user.name || user.email}
          </p>
        </div>

        <ShineBorder
          borderRadius={0}
          borderWidth={2}
          color={["#10b981", "#3b82f6", "#10b981"]}
          duration={10}
          className="w-full max-w-4xl bg-zinc-950/80! backdrop-blur-3xl! border-zinc-900! shadow-2xl p-0"
        >
          <div className="p-12 md:p-24 space-y-12 w-full">
            <h2 className="text-lg font-black text-white border-l-8 border-blue-600 pl-8">
              Daily Plan
            </h2>

            <div className="flex flex-col gap-6 w-full">
              {loadingTasks ? (
                <p className="text-zinc-500 font-bold">Syncing Schedule...</p>
              ) : tasks.length === 0 ? (
                <p className="text-zinc-500 font-bold">
                  No tasks scheduled for today. Ask TaskPilot to schedule
                  something!
                </p>
              ) : (
                <div className="relative border-l-2 border-zinc-800 ml-4 pl-8 space-y-6">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="relative p-6 border border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-all hover:border-blue-500/50 group"
                    >
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[39px] top-1/2 -translate-y-1/2 ring-4 ring-zinc-950" />
                      <div>
                        <h3 className="text-md font-black text-white mb-2">
                          {task.title}
                        </h3>
                        <p className="text-zinc-400 text-sm font-bold flex items-center gap-2">
                          <span className="text-blue-500">
                            {task.duration_mins} mins
                          </span>
                          •
                          <span>
                            {task.scheduled_for
                              ? new Date(task.scheduled_for).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )
                              : "Unscheduled"}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4 self-start md:self-auto">
                        <div
                          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded ${task.status === "completed" ? "bg-green-600/20 text-green-500" : "bg-blue-600/20 text-blue-500"}`}
                        >
                          {task.status}
                        </div>
                        {task.status !== "completed" && (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/focus?taskId=${task.id}&title=${encodeURIComponent(task.title)}`,
                              )
                            }
                            className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 opacity-100 md:opacity-0 group-hover:opacity-100"
                            title="Start Focus Mode"
                          >
                            <Play className="w-4 h-4 ml-0.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="mt-8 w-full p-6 bg-zinc-900 hover:bg-blue-600 border border-zinc-800 hover:border-blue-500 text-white font-black text-lg transition-all shadow-lg hover:shadow-blue-500/20 rounded-none"
              onClick={() => router.push("/dashboard/chat")}
            >
              Launch FocusFlow Chat
            </button>
          </div>
        </ShineBorder>
      </main>

      <Footer />
    </div>
  );
}
