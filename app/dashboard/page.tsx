"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../lib/useUser";
import { getScheduledTasks, seedDemoData } from "../actions/tasks";
import {
  Play,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  BarChart3,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { AnimatedList } from "../components/AnimatedList";

interface Task {
  id: number;
  user_id: number;
  title: string;
  type: "automated" | "scheduled" | "quick";
  status: "pending" | "completed";
  scheduled_for?: string;
  duration_mins?: number;
  created_at: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface NotificationProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

const Notification = ({
  name,
  description,
  icon,
  color,
  time,
}: NotificationProps) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-6",
        "transition-all duration-300 ease-in-out hover:scale-[103%]",
        "bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 shadow-2xl flex flex-row items-center gap-6",
      )}
    >
      <div
        className="flex size-12 items-center justify-center shrink-0 rounded-xl border border-white/10 font-black text-xl"
        style={{ backgroundColor: color }}
      >
        <span>{icon}</span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <figcaption className="flex flex-row items-center text-base font-bold text-white">
          <span>{name}</span>
          <span className="mx-2 opacity-30">·</span>
          <span className="text-xs text-zinc-500">{time}</span>
        </figcaption>
        <p className="text-sm font-medium text-zinc-400">{description}</p>
      </div>
    </figure>
  );
};

const TaskSkeleton = () => (
  <div className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:justify-between md:items-center gap-4 animate-pulse">
    <div className="absolute w-4 h-4 bg-zinc-950 border-2 border-zinc-700 rounded-full -left-[41px] top-1/2 -translate-y-1/2" />
    <div className="flex-1">
      <div className="h-5 bg-white/10 rounded-md mb-3 w-3/4"></div>
      <div className="h-4 bg-white/5 rounded-md w-1/2"></div>
    </div>
    <div className="flex items-center gap-4">
      <div className="h-8 bg-white/10 rounded-md w-20"></div>
      <div className="w-10 h-10 bg-white/10 rounded-full"></div>
    </div>
  </div>
);

const StatCard = ({ stat }: { stat: Stat }) => (
  <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 shadow-xl">
    <div className="flex items-center gap-6">
      <div className={`p-5 rounded-2xl ${stat.color} [&>svg]:w-8 [&>svg]:h-8`}>
        {stat.icon}
      </div>
      <div>
        <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
        <p className="text-base font-medium text-zinc-400 uppercase tracking-widest">
          {stat.label}
        </p>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    if (user) {
      getScheduledTasks(user.id.toString()).then((res) => {
        if (res.success && res.tasks) setTasks(res.tasks as unknown as Task[]);
        setLoadingTasks(false);
      });
    }
  }, [user]);

  const handleSeedDemo = async () => {
    if (!user) return;

    setSeedingDemo(true);
    try {
      const result = await seedDemoData(user.id.toString());
      if (result.success) {
        toast.success("Demo data loaded! Check out your new schedule.");
        // Refresh tasks
        const res = await getScheduledTasks(user.id.toString());
        if (res.success && res.tasks) setTasks(res.tasks);
      } else {
        toast.error(`Failed to load demo data: ${result.error}`);
      }
    } catch {
      toast.error("Failed to load demo data");
    } finally {
      setSeedingDemo(false);
    }
  };

  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  useEffect(() => {
    if (user && tasks.length > 0) {
      const completed = tasks.filter((t) => t.status === "completed").length;
      const total = tasks.length;
      const todayTasks = tasks.filter((t) => {
        const today = new Date().toDateString();
        return (
          t.scheduled_for && new Date(t.scheduled_for).toDateString() === today
        );
      }).length;
      const totalMins = tasks.reduce(
        (sum, t) => sum + (t.duration_mins || 0),
        0,
      );

      setStats([
        {
          label: "Tasks Completed",
          value: completed.toString(),
          icon: <CheckCircle className="w-6 h-6" />,
          color: "bg-green-500/20 text-green-400",
        },
        {
          label: "Total Tasks",
          value: total.toString(),
          icon: <BarChart3 className="w-6 h-6" />,
          color: "bg-blue-500/20 text-blue-400",
        },
        {
          label: "Today's Tasks",
          value: todayTasks.toString(),
          icon: <Calendar className="w-6 h-6" />,
          color: "bg-purple-500/20 text-purple-400",
        },
        {
          label: "Focus Time",
          value: `${totalMins}m`,
          icon: <Clock className="w-6 h-6" />,
          color: "bg-orange-500/20 text-orange-400",
        },
      ]);
    }
  }, [user, tasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center font-black text-base">
        Initializing Secure Protocol...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center font-black text-base">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-blue-500/40">
      {notifications.length > 0 && (
        <div className="fixed top-32 right-8 w-full max-w-[400px] z-[200]">
          <AnimatedList delay={100}>
            {notifications.map((n, i) => (
              <Notification key={i} {...n} />
            ))}
          </AnimatedList>
        </div>
      )}

      <main className="flex flex-col items-center justify-start pt-32 pb-20 px-6 lg:px-12 relative z-10 w-full max-w-[1400px] mx-auto min-h-screen">
        <div className="flex flex-col items-center justify-center text-center mb-16 w-full">
          <h1 className="text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tight leading-tight mb-6 text-center">
            Main <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
              Dashboard.
            </span>
          </h1>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto my-8 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          <p className="text-sm text-zinc-400 font-medium text-center">
            Access Granted. Identity: {user.name || user.email}
          </p>
        </div>

        {/* Stats Section */}
        <div className="w-full mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>

        <div className="w-full space-y-24">
          {/* Daily Plan Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-6 border-b border-white/10 pb-8">
              <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
                  Daily Plan
                </h2>
                <p className="text-zinc-400 text-lg mt-2">
                  Your scheduled tasks and focus sessions
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8 w-full">
              {loadingTasks ? (
                <div className="relative border-l-4 border-white/20 ml-8 pl-12 space-y-8">
                  {[...Array(4)].map((_, i) => (
                    <TaskSkeleton key={i} />
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="p-12 rounded-3xl border border-white/10 bg-white/[0.02] text-center">
                  <Zap className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
                  <p className="text-zinc-400 font-medium text-xl">
                    No tasks scheduled for today. Ask FocusFlow to schedule
                    something!
                  </p>
                </div>
              ) : (
                <div className="relative border-l-4 border-white/20 ml-8 pl-12 space-y-8">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 transition-all duration-500 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 group backdrop-blur-sm"
                    >
                      <div className="absolute w-6 h-6 bg-zinc-950 border-4 border-blue-500 rounded-full -left-[45px] top-1/2 -translate-y-1/2 group-hover:bg-blue-500 transition-colors duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-white transition-colors">
                          {task.title}
                        </h3>
                        <p className="text-zinc-400 text-base font-medium flex items-center gap-4 flex-wrap">
                          <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {task.duration_mins} mins
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-300 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {task.scheduled_for
                              ? new Date(task.scheduled_for).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "Unscheduled"}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-bold uppercase ${task.type === "scheduled" ? "bg-purple-500/10 text-purple-400" : task.type === "quick" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}
                          >
                            {task.type}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-6 self-start lg:self-auto">
                        <div
                          className={`px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl border ${task.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}
                        >
                          {task.status}
                        </div>
                        {task.status !== "completed" && (
                          <button
                            onClick={() => {
                              setNotifications([
                                {
                                  name: "Focus Mode Activated",
                                  description: `Starting session: ${task.title}`,
                                  icon: "🚀",
                                  color: "#3b82f6",
                                  time: "Just now",
                                },
                              ]);
                              setTimeout(() => {
                                router.push(
                                  `/dashboard/focus?taskId=${task.id}&title=${encodeURIComponent(task.title)}`,
                                );
                              }, 1500);
                            }}
                            className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/25 lg:opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none ring-2 ring-transparent focus:ring-blue-400"
                            title="Start Focus Mode"
                          >
                            <Play className="w-5 h-5 ml-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-6 border-b border-white/10 pb-8">
              <div className="w-2 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
                  Quick Actions
                </h2>
                <p className="text-zinc-400 text-lg mt-2">
                  Jump into productivity mode instantly
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={handleSeedDemo}
                disabled={seedingDemo}
                className="p-8 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 hover:border-purple-500/30 group"
              >
                <Sparkles className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <div className="text-left">
                  <div className="font-bold">
                    {seedingDemo ? "Loading Demo..." : "Load Demo Data"}
                  </div>
                  <div className="text-sm text-zinc-400">
                    Populate with sample tasks
                  </div>
                </div>
              </button>
              <button
                className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-500/50 text-white font-bold text-lg transition-all shadow-lg shadow-blue-500/20 rounded-xl flex items-center justify-center gap-4"
                onClick={() => router.push("/dashboard/chat")}
              >
                <Zap className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-bold">Launch FocusFlow Chat</div>
                  <div className="text-sm text-blue-100">
                    AI-powered task management
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
