"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../lib/useUser";
import Footer from "../components/Footer";
import ShineBorder from "../components/ShineBorder";
import { getScheduledTasks, getTasks, seedDemoData } from "../actions/tasks";
import {
  Play,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

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

function AnalyticsCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}) {
  return (
    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-blue-500/50 transition-all">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-blue-400" />
        {trend && (
          <span className="text-xs text-green-400 font-medium">{trend}</span>
        )}
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-xs text-zinc-400 font-medium">{title}</div>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="relative p-6 border border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row md:justify-between md:items-center gap-4 animate-pulse">
      <div className="absolute w-3 h-3 bg-zinc-700 rounded-full -left-[39px] top-1/2 -translate-y-1/2 ring-4 ring-zinc-950" />
      <div className="flex-1">
        <div className="h-4 bg-zinc-700 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
      </div>
      <div className="flex items-center gap-4 self-start md:self-auto">
        <div className="h-6 bg-zinc-700 rounded w-16"></div>
        <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [seedingDemo, setSeedingDemo] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (user) {
      // Load scheduled tasks for timeline
      getScheduledTasks(user.id.toString()).then((res) => {
        if (res.success && res.tasks) setTasks(res.tasks as unknown as Task[]);
        setLoadingTasks(false);
      });

      // Load all tasks for analytics
      getTasks(user.id.toString()).then((res) => {
        if (res.success && res.tasks) setAllTasks(res.tasks as Task[]);
      });
    }
  }, [user]);

  // Request notification permission and set up smart notifications
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);

      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Smart notification system for upcoming tasks
  useEffect(() => {
    if (notificationPermission !== "granted" || allTasks.length === 0) return;

    const checkUpcomingTasks = () => {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

      allTasks.forEach((task) => {
        if (task.status === "pending" && task.scheduled_for) {
          const taskTime = new Date(task.scheduled_for);

          // Notify if task starts within next 5 minutes
          if (taskTime > now && taskTime <= fiveMinutesFromNow) {
            new Notification(`⏰ ${task.title} starts soon!`, {
              body: `Your ${task.duration_mins}-minute session begins at ${taskTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
              icon: "/favicon.ico",
              tag: `task-${task.id}`, // Prevent duplicate notifications
            });
          }
        }
      });
    };

    // Check immediately and then every minute
    checkUpcomingTasks();
    const interval = setInterval(checkUpcomingTasks, 60000);

    return () => clearInterval(interval);
  }, [allTasks, notificationPermission]);

  const handleSeedDemo = async () => {
    if (!user) return;

    setSeedingDemo(true);
    try {
      const result = await seedDemoData(user.id.toString());
      if (result.success) {
        toast.success("Demo data loaded! Check out your new schedule.");
        // Refresh tasks
        const scheduledRes = await getScheduledTasks(user.id.toString());
        if (scheduledRes.success && scheduledRes.tasks)
          setTasks(scheduledRes.tasks);

        const allRes = await getTasks(user.id.toString());
        if (allRes.success && allRes.tasks) setAllTasks(allRes.tasks as Task[]);
      } else {
        toast.error(`Failed to load demo data: ${result.error}`);
      }
    } catch {
      toast.error("Failed to load demo data");
    } finally {
      setSeedingDemo(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  // Calculate analytics
  const analytics = React.useMemo(() => {
    const completedTasks = allTasks.filter(
      (task) => task.status === "completed",
    );
    const pendingTasks = allTasks.filter((task) => task.status === "pending");
    const totalTime = allTasks.reduce(
      (sum, task) => sum + (task.duration_mins || 0),
      0,
    );
    const completedTime = completedTasks.reduce(
      (sum, task) => sum + (task.duration_mins || 0),
      0,
    );

    const completionRate =
      allTasks.length > 0
        ? Math.round((completedTasks.length / allTasks.length) * 100)
        : 0;

    // Today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysTasks = allTasks.filter((task) => {
      if (!task.created_at) return false;
      const taskDate = new Date(task.created_at);
      return taskDate >= today && taskDate < tomorrow;
    });

    return {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      totalTime,
      completedTime,
      completionRate,
      todaysTasks: todaysTasks.length,
    };
  }, [allTasks]);

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
      <main className="flex flex-col items-center justify-center pb-40 px-12 relative z-10 w-full min-h-screen">
        <div className="text-center mb-20 max-w-4xl w-full mt-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tight leading-tight mb-6">
            Main <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">
              Dashboard.
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto my-8 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <p className="text-sm text-zinc-400 font-medium">
            Access Granted. Identity: {user.name || user.email}
          </p>
        </div>

        <ShineBorder
          borderRadius={24}
          borderWidth={1.5}
          color={["#3b82f6", "#6366f1", "#8b5cf6"]}
          duration={10}
          className="w-full max-w-4xl !bg-zinc-950/80 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0"
        >
          <div className="p-12 md:p-24 space-y-12 w-full">
            {/* Analytics Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-black text-white border-l-8 border-blue-600 pl-8">
                Productivity Analytics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnalyticsCard
                  title="Completion Rate"
                  value={`${analytics.completionRate}%`}
                  icon={Target}
                  trend={
                    analytics.completedTasks > 0 ? "+12% this week" : undefined
                  }
                />
                <AnalyticsCard
                  title="Tasks Today"
                  value={analytics.todaysTasks.toString()}
                  icon={CheckCircle}
                />
                <AnalyticsCard
                  title="Total Time"
                  value={`${Math.round(analytics.totalTime / 60)}h`}
                  icon={Clock}
                />
                <AnalyticsCard
                  title="Focus Sessions"
                  value={analytics.completedTasks.toString()}
                  icon={TrendingUp}
                />
              </div>
            </div>

            <h2 className="text-lg font-black text-white border-l-8 border-blue-600 pl-8">
              Daily Plan
            </h2>

            <div className="flex flex-col gap-6 w-full">
              {loadingTasks ? (
                <div className="relative border-l-2 border-zinc-800 ml-6 pl-8 space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <TaskSkeleton key={i} />
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                  <p className="text-zinc-400 font-medium">
                    No tasks scheduled for today. Ask FocusFlow to schedule
                    something!
                  </p>
                </div>
              ) : (
                <div className="relative border-l-2 border-white/10 ml-6 pl-8 space-y-6">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 group backdrop-blur-sm"
                    >
                      <div className="absolute w-4 h-4 bg-zinc-950 border-2 border-blue-500 rounded-full -left-[41px] top-1/2 -translate-y-1/2 group-hover:bg-blue-500 transition-colors duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      <div>
                        <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-white transition-colors">
                          {task.title}
                        </h3>
                        <p className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                          <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                            {task.duration_mins} mins
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-300">
                            {task.scheduled_for
                              ? new Date(task.scheduled_for).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )
                              : "Unscheduled"}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4 self-start md:self-auto mt-2 md:mt-0">
                        <div
                          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border ${task.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}
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
                            className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/25 md:opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none ring-2 ring-transparent focus:ring-blue-400"
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

            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-6 border-t border-white/5">
              <button
                onClick={handleSeedDemo}
                disabled={seedingDemo}
                className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:border-purple-500/30 group"
              >
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                {seedingDemo ? "Loading Demo..." : "Load Demo Data"}
              </button>
              <button
                className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-500/50 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 rounded-xl flex items-center justify-center gap-2"
                onClick={() => router.push("/dashboard/chat")}
              >
                Launch FocusFlow Chat
              </button>
            </div>
          </div>
        </ShineBorder>
      </main>

      <Footer />
    </div>
  );
}
