"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseIntent, TaskIntent } from "../../../lib/parser";
import {
  autoScheduleTask,
  getScheduledTasks,
  saveChatMessage,
  getChatHistory,
} from "../../actions/tasks";
import { useUser } from "../../../lib/useUser";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";
import { AnimatedList } from "../../components/AnimatedList";

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
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-5",
        "transition-all duration-300 ease-in-out hover:scale-[103%]",
        "bg-[#0d0d14]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-row items-center gap-5",
      )}
    >
      <div
        className="flex size-11 items-center justify-center shrink-0 rounded-xl border border-white/10 font-black text-xl"
        style={{ backgroundColor: color }}
      >
        <span>{icon}</span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <figcaption className="flex flex-row items-center text-sm font-bold text-white">
          <span>{name}</span>
          <span className="mx-2 opacity-30">·</span>
          <span className="text-xs text-white/40">{time}</span>
        </figcaption>
        <p className="text-xs font-medium text-white/50">{description}</p>
      </div>
    </figure>
  );
};
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

// Helper function to generate proactive suggestions based on context
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getProactiveSuggestions(currentTasks: Task[]): string[] {
  const now = new Date();
  const hour = now.getHours();
  const suggestions: string[] = [];

  // Time-based suggestions
  if (hour >= 9 && hour <= 11) {
    suggestions.push("Start my morning routine");
  } else if (hour >= 12 && hour <= 14) {
    suggestions.push("Schedule lunch break");
  } else if (hour >= 17 && hour <= 19) {
    suggestions.push("Plan tomorrow's tasks");
  }

  // Task-based suggestions
  const pendingTasks = currentTasks.filter((task) => task.status === "pending");
  if (pendingTasks.length > 0) {
    suggestions.push("Start next scheduled task");
  }

  const completedTasks = currentTasks.filter(
    (task) => task.status === "completed",
  );
  if (completedTasks.length > 0 && pendingTasks.length === 0) {
    suggestions.push("Review completed tasks");
  }

  // Default helpful suggestions
  if (suggestions.length < 3) {
    suggestions.push(
      "Summarize my day",
      "Create a focus session",
      "Check my schedule",
    );
  }

  return suggestions.slice(0, 4); // Limit to 4 suggestions
}

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  intent?: TaskIntent;
  isQuickBurst?: boolean;
};

export default function ChatPage() {
  const router = useRouter();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Hi there! I'm FocusFlow. What would you like to get done today? (Try asking me to summarize something, schedule a study session, or remind you to make a call!)",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quickTaskBuffer, setQuickTaskBuffer] = useState<string[]>([]);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fetch current tasks and chat history for context awareness
  useEffect(() => {
    if (user) {
      // Load current tasks
      getScheduledTasks(user.id.toString()).then((res) => {
        if (res.success && res.tasks) {
          setCurrentTasks(res.tasks);
        }
      });

      // Load recent chat history
      getChatHistory(user.id.toString(), 10).then((res) => {
        if (res.success && res.messages) {
          const historyMessages: Message[] = (
            res.messages as {
              message: string;
              role: string;
              created_at: string;
            }[]
          ).map((msg, index: number) => ({
            id: `history-${index}`,
            role: msg.role as "user" | "bot",
            text: msg.message,
            intent: undefined, // Historical messages don't have parsed intents
          }));

          setMessages((prev) => [...historyMessages, ...prev]);
        }
      });
    }
  }, [user]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    const intent = await parseIntent(userText);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
      intent,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database
    if (user) {
      saveChatMessage(user.id.toString(), userText, "user");
    }

    setInputValue("");
    setIsTyping(true);

    try {
      if (intent === "focus" && user) {
        const result = await autoScheduleTask(user.id.toString(), userText, 25);
        if (!result.success) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              text: `❌ **Focus Mode Failed!**\n\nI couldn't schedule this focus session: ${result.error || "Unknown error"}. Please try again later.`,
            },
          ]);
          setIsTyping(false);
          toast.error("Failed to start focus mode!");
          return;
        }
        const focusMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: `🚀 **Focus Mode Initiated!**\n\nI've scheduled a 25-minute focus session for "${userText}" and transitioning you to the deep focus environment now...`,
        };
        setMessages((prev) => [...prev, focusMsg]);

        // Save focus message to database
        if (user) {
          saveChatMessage(user.id.toString(), focusMsg.text, "bot");
        }
        setIsTyping(false);
        toast.loading("Initiating Focus Sequence...", { duration: 1500 });
        setTimeout(
          () =>
            router.push(
              `/dashboard/focus?taskId=${result.id}&title=${encodeURIComponent(userText)}`,
            ),
          1500,
        );
        return;
      }

      if (intent === "scheduled" && user) {
        const result = await autoScheduleTask(user.id.toString(), userText, 25);
        if (!result.success) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              text: `❌ **Scheduling Failed!**\n\nI couldn't schedule this task: ${result.error || "Unknown error"}. Please try again later.`,
            },
          ]);
          setIsTyping(false);
          toast.error("Failed to schedule task!");
          return;
        }
        const scheduledTime = new Date(result.scheduledFor!);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: `📅 **Task Scheduled!**\n\nI've scheduled a 25-minute Pomodoro session for this task at **${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}**.\n\nIt has been added to your Daily Plan.`,
          },
        ]);
        setIsTyping(false);
        setNotifications([
          {
            name: "Task Scheduled Successfully",
            description: `Scheduled for ${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            icon: "📅",
            color: "#10b981",
            time: "Just now",
          },
        ]);
        toast.success("Task scheduled and added to Daily Plan!");
        setTimeout(() => setNotifications([]), 5000);
        return;
      }

      if (intent === "quick") {
        const newBuffer = [...quickTaskBuffer, userText];
        setQuickTaskBuffer(newBuffer);
        if (newBuffer.length >= 3) {
          const burstMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: `🚀 **Quick Task Burst Detected!**\n\nI've grouped these 3 tasks into a single **15-min productivity sprint**:\n1. ${newBuffer[0]}\n2. ${newBuffer[1]}\n3. ${newBuffer[2]}\n\nWould you like to start this burst now?`,
            isQuickBurst: true,
          };
          setMessages((prev) => [...prev, burstMsg]);

          // Save burst message to database
          if (user) {
            saveChatMessage(user.id.toString(), burstMsg.text, "bot");
          }
          setQuickTaskBuffer([]);
          setIsTyping(false);
          toast.success("Quick Burst grouped successfully!");
          return;
        } else {
          toast.info(`Quick task added to buffer (${newBuffer.length}/3)`);
        }
      }

      if (intent === "unknown") {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "bot",
            text: `🤔 **I didn't quite catch that!**\n\nI can help you with:\n\n• **Scheduling tasks**: "Study OS", "Work on project", "Meeting with team"\n• **Quick tasks**: "Call mom", "Reply to email", "Quick review"\n• **Automation**: "Summarize this text", "Generate ideas", "Write a draft"\n• **Focus mode**: "Start studying", "Begin focus session"\n\nWhat would you like to get done?`,
            intent: "unknown",
          },
        ]);
        setIsTyping(false);
        return;
      }

      // 2.1 LLM Integration via API with enhanced context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(1).map((m) => ({
            role: m.role === "bot" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
          userContext: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
              }
            : null,
          currentTasks: currentTasks,
        }),
      });
      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "bot",
        text:
          data.text || "I'm having trouble connecting to my brain right now...",
        intent,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save bot message to database
      if (user) {
        saveChatMessage(user.id.toString(), botMessage.text, "bot");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "bot",
        text: "Sorry, I encountered an error processing that request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Save error message to database
      if (user) {
        saveChatMessage(user.id.toString(), errorMessage.text, "bot");
      }
      toast.error("Failed to process request");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        @keyframes pulse {
          from { transform: scale(1); opacity: var(--base-opacity, 0.3); }
          to   { transform: scale(1.6); opacity: calc(var(--base-opacity, 0.3) * 0.4); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .chat-root { font-family: 'DM Sans', sans-serif; }
        .scrollbar-custom::-webkit-scrollbar { width: 8px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: #424242; border-radius: 4px; }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: #565656; }
      `}</style>

      {notifications.length > 0 && (
        <div className="fixed top-24 right-6 w-full max-w-[400px] z-[200]">
          <AnimatedList delay={100}>
            {notifications.map((n, i) => (
              <Notification key={i} {...n} />
            ))}
          </AnimatedList>
        </div>
      )}

      {/* Full-viewport wrapper with background */}
      <div className="chat-root relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-black">
        {/* Main chat container — full width */}
        <div className="relative z-10 flex flex-col w-full h-full max-w-4xl mx-auto">
          {/* ── Messages Area ── */}
          <div className="flex-1 overflow-y-auto scrollbar-custom px-4 py-8 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-4 px-4 py-2 w-full max-w-3xl mx-auto ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "bot" ? (
                    <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#343541] flex items-center justify-center shrink-0 mt-1">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "group relative text-base leading-relaxed max-w-[85%]",
                      msg.role === "user" ? "text-right" : "text-left",
                    )}
                  >
                    <div
                      className={cn(
                        "prose prose-sm md:prose-base max-w-none text-[#ECECEC] prose-p:leading-relaxed prose-strong:text-white prose-code:text-[#ECECEC] prose-pre:bg-[#000000] prose-pre:border prose-pre:border-[#333333] prose-li:text-[#ECECEC] prose-headings:text-white",
                        msg.role === "user"
                          ? "bg-[#2f2f2f] px-5 py-2.5 rounded-3xl"
                          : "",
                      )}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>

                    {msg.role === "bot" && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="absolute -bottom-8 left-0 p-1.5 opacity-0 group-hover:opacity-100 transition-all text-[#ececec] hover:text-white"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 px-4 py-2 w-full max-w-3xl mx-auto flex-row"
                >
                  <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 mt-3">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-[#ececec] rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* ── Input Area ── */}
          <div className="px-4 py-4 w-full max-w-3xl mx-auto">
            <div className="relative flex items-center gap-3 bg-[#2f2f2f] border border-[#424242] rounded-3xl px-4 py-3 shadow-sm focus-within:bg-[#383838]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message FocusFlow..."
                className="flex-1 bg-transparent text-base text-[#ECECEC] placeholder-[#9B9B9B] outline-none"
              />
              <motion.button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 shrink-0",
                  inputValue.trim() && !isTyping
                    ? "bg-white text-black hover:bg-[#d9d9d9]"
                    : "bg-[#424242] text-[#9b9b9b] cursor-not-allowed",
                )}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </motion.button>
            </div>
            <p className="text-center text-[11px] text-[#9B9B9B] mt-2">
              FocusFlow can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
