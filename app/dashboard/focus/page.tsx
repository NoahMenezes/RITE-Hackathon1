"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Pause, Square, CheckCircle } from "lucide-react";
import { updateTaskStatus } from "../../actions/tasks";
import ShineBorder from "../../components/ShineBorder";
import { toast } from "sonner";

function FocusModePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const taskTitle = searchParams.get("title") || "Deep Focus Session";

  // Default to 25 minutes (1500 seconds)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = useCallback(async () => {
    setIsActive(false);
    setIsCompleted(true);

    if (taskId) {
      await updateTaskStatus(taskId, "completed");
      toast.success("Task marked as completed in Daily Plan!");
    } else {
      toast.success("Focus session successfully completed!");
    }
  }, [taskId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-transparent text-white mt-10">
      <ShineBorder
        borderRadius={0}
        borderWidth={2}
        color={
          isActive
            ? ["#ef4444", "#ef4444", "#ef4444"]
            : ["#3b82f6", "#3b82f6", "#3b82f6"]
        }
        duration={10}
        className="w-full max-w-2xl !bg-zinc-950/90 !backdrop-blur-3xl !border-zinc-900 shadow-2xl p-0"
      >
        <div className="p-12 md:p-24 flex flex-col items-center justify-center space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-zinc-500">
              Current Target
            </h2>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {taskTitle}
            </h1>
          </div>

          {/* Giant Timer */}
          <div className="relative">
            <motion.div
              animate={{
                scale: isActive ? [1, 1.02, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`text-8xl md:text-[150px] font-black tracking-tighter tabular-nums ${
                isActive ? "text-red-500" : "text-white"
              } transition-colors duration-500 drop-shadow-2xl`}
            >
              {formatTime(timeLeft)}
            </motion.div>

            {/* Progress indicator */}
            <div className="absolute -bottom-8 left-0 w-full h-1 bg-zinc-800">
              <motion.div
                className={`h-full ${isActive ? "bg-red-500" : "bg-blue-500"}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Controls */}
          {isCompleted ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center gap-3 text-green-500">
                <CheckCircle className="w-8 h-8" />
                <span className="text-xl font-black">Session Complete</span>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-sm uppercase tracking-widest transition-all"
              >
                Return to Command Center
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <button
                onClick={toggleTimer}
                className={`w-20 h-20 flex items-center justify-center rounded-full shadow-2xl transition-all active:scale-95 ${
                  isActive
                    ? "bg-zinc-800 text-white hover:bg-zinc-700"
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20"
                }`}
              >
                {isActive ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button
                onClick={stopTimer}
                disabled={!isActive && timeLeft === 25 * 60}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="w-6 h-6" />
              </button>

              <button
                onClick={handleComplete}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-500 hover:text-green-500 hover:bg-zinc-800 transition-all active:scale-95"
                title="Mark Done Early"
              >
                <CheckCircle className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </ShineBorder>
    </div>
  );
}

export default function FocusModePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FocusModePage />
    </Suspense>
  );
}
