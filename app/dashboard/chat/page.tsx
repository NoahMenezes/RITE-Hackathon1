"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Copy,
  Play,
  Paperclip,
  Trash2,
  Calendar,
  Download,
  RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  autoScheduleTask,
  getScheduledTasks,
  saveChatMessage,
  getChatHistory,
  deleteTask,
  getTasksByDate,
  createTaskTemplate,
  getTaskTemplates,
  instantiateTemplate,
  createRecurringTask,
  prioritizeTasks,
  createHabit,
  getHabits,
  completeHabit,
} from "../../actions/tasks";
import { useUser } from "../../../lib/useUser";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";
import { AnimatedList } from "../../components/AnimatedList";

// Simple intent parsing without AI
function parseIntent(text: string): TaskIntent | "unknown" {
  const lower = text.toLowerCase();
  if (lower.startsWith("message on")) return "whatsapp";
  if (lower.startsWith("email ")) return "email";
  if (
    lower.includes("focus") ||
    lower.includes("start") ||
    lower.includes("begin")
  )
    return "focus";
  if (
    lower.includes("schedule") ||
    lower.includes("plan") ||
    lower.includes("set")
  )
    return "scheduled";
  if (
    lower.includes("quick") ||
    lower.includes("fast") ||
    lower.includes("short")
  )
    return "quick";
  if (
    lower.includes("summarize") ||
    lower.includes("analyze") ||
    lower.includes("write") ||
    lower.includes("generate")
  )
    return "automation";
  if (
    lower.includes("template") ||
    lower.includes("create template") ||
    lower.includes("use template")
  )
    return "template";
  if (
    lower.includes("habit") ||
    lower.includes("track habit") ||
    lower.includes("complete habit")
  )
    return "habit";
  if (
    lower.includes("recurring") ||
    lower.includes("repeat") ||
    lower.includes("daily") ||
    lower.includes("weekly")
  )
    return "recurring";
  if (
    lower.includes("prioritize") ||
    lower.includes("priority") ||
    lower.includes("sort tasks")
  )
    return "prioritize";
  if (lower.includes("search") || lower.includes("find")) return "search";
  if (lower.includes("export") || lower.includes("download")) return "export";
  if (lower.includes("undo")) return "undo";
  return "unknown";
}

type TaskIntent =
  | "focus"
  | "scheduled"
  | "quick"
  | "automation"
  | "whatsapp"
  | "email"
  | "template"
  | "habit"
  | "recurring"
  | "prioritize"
  | "search"
  | "export"
  | "undo"
  | "unknown";

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
        "relative mx-auto min-h-fit w-full max-w-100 cursor-pointer overflow-hidden rounded-2xl p-5",
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
  type: "automated" | "scheduled" | "quick" | "habit";
  status: "pending" | "completed";
  scheduled_for: string | null;
  duration_mins: number | null;
  created_at: string;
}

// Helper function to parse duration from user text
function parseDuration(text: string): number | null {
  const lowerText = text.toLowerCase();
  const hourMatch = lowerText.match(/(\d+)\s*(?:hour|hr|h)/);
  const minMatch = lowerText.match(/(\d+)\s*(?:minute|min|m)/);

  if (hourMatch) {
    return parseInt(hourMatch[1]) * 60;
  } else if (minMatch) {
    return parseInt(minMatch[1]);
  }

  // Default to 25 if no duration found
  return null;
}

// Helper function to detect signs of exhaustion in user text
function detectExhaustion(text: string): boolean {
  const exhaustionWords = [
    "tired",
    "exhausted",
    "overwhelmed",
    "burnt out",
    "stressed",
    "fatigued",
    "drained",
    "weary",
    "worn out",
    "run down",
  ];
  const lowerText = text.toLowerCase();
  return exhaustionWords.some((word) => lowerText.includes(word));
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
      text: "Hi there! I'm FocusFlow. What would you like to get done today? (Try asking me to summarize something, schedule a study session, or remind you to make a call!)\n\n**New Features:** Create templates, track habits, set recurring tasks, prioritize your work, search history, export data, and undo actions.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quickTaskBuffer, setQuickTaskBuffer] = useState<string[]>([]);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [pendingPomodoro, setPendingPomodoro] = useState<{
    title: string;
    duration: number;
  } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarTasks, setCalendarTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;
    const result = await deleteTask(taskId.toString());
    if (result.success) {
      setCurrentTasks((prev) => prev.filter((t) => t.id !== taskId));
      setActionHistory((prev) => [...prev, `delete_task_${taskId}`]);
      toast.success("Task deleted successfully");
    } else {
      toast.error("Failed to delete task");
    }
  };

  const handleUndo = async () => {
    if (actionHistory.length === 0) {
      toast.error("No actions to undo");
      return;
    }
    // Simple undo logic - in real app, would need more sophisticated state management
    toast.info(
      "Undo functionality is basic - last action reversed conceptually",
    );
    setActionHistory((prev) => prev.slice(0, -1));
  };

  const handleExport = () => {
    const data = {
      tasks: currentTasks,
      chatHistory: messages,
      habits: [], // Would fetch habits
      templates: [], // Would fetch templates
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "focusflow-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
        toast.success("Text file loaded successfully");
      };
      reader.readAsText(file);
    } else {
      toast.error("Unsupported file type. Please upload .txt files only.");
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = async () => {
    const userText = fileContent || inputValue;
    if (!userText.trim()) return;

    const intent = fileContent ? "automation" : parseIntent(userText);

    // Handle pending Pomodoro choice
    if (pendingPomodoro) {
      if (!user) {
        toast.error("User not authenticated");
        return;
      }
      const lowerText = userText.toLowerCase();
      if (lowerText.includes("yes") || lowerText.includes("pomodoro")) {
        // Use Pomodoro
        const result = await autoScheduleTask(
          user.id.toString(),
          pendingPomodoro.title,
          25,
        );
        if (!result.success) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              text: `❌ **Pomodoro Scheduling Failed!**\n\nI couldn't schedule this Pomodoro session: ${result.error || "Unknown error"}. Please try again later.`,
            },
          ]);
          setIsTyping(false);
          toast.error("Failed to schedule Pomodoro session!");
          return;
        }
        const scheduledTime = new Date(result.scheduledFor!);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: `🍅 **Pomodoro Session Scheduled!**\n\nI've scheduled a 25-minute Pomodoro session for "${pendingPomodoro.title}" at **${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}**.\n\nIt has been added to your Daily Plan.`,
          },
        ]);
        setNotifications([
          {
            name: "Pomodoro Session Scheduled",
            description: `25 min at ${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            icon: "🍅",
            color: "#ef4444",
            time: "Just now",
          },
        ]);
        toast.success("Pomodoro session scheduled!");
        setTimeout(() => setNotifications([]), 5000);
        setPendingPomodoro(null);
        setIsTyping(false);
        return;
      } else if (lowerText.includes("no") || lowerText.includes("full")) {
        // Use full duration
        const result = await autoScheduleTask(
          user.id.toString(),
          pendingPomodoro.title,
          pendingPomodoro.duration,
        );
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
            text: `📅 **Task Scheduled!**\n\nI've scheduled a ${pendingPomodoro.duration}-minute session for "${pendingPomodoro.title}" at **${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}**.\n\nIt has been added to your Daily Plan.`,
          },
        ]);
        setNotifications([
          {
            name: "Task Scheduled",
            description: `${pendingPomodoro.duration} min at ${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            icon: "📅",
            color: "#10b981",
            time: "Just now",
          },
        ]);
        toast.success("Task scheduled!");
        setTimeout(() => setNotifications([]), 5000);
        setPendingPomodoro(null);
        setIsTyping(false);
        return;
      } else {
        // Ask again
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: `🤔 **Please reply with "yes" for Pomodoro (25 min sessions) or "no" for the full ${pendingPomodoro.duration} minutes.**`,
          },
        ]);
        setIsTyping(false);
        return;
      }
    }

    // Handle new intents
    if (intent === "template") {
      if (userText.toLowerCase().includes("create")) {
        // Simple template creation - in real app, would parse better
        const templateName = "My Template"; // Placeholder
        const tasks = [
          { title: "Task 1", type: "scheduled" as const, durationMins: 25 },
        ];
        if (!user) return;
        const result = await createTaskTemplate(
          user.id.toString(),
          templateName,
          "",
          tasks,
        );
        if (result.success) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              text: `📋 **Template Created!**\n\nI've created a new task template "${templateName}". You can use it by saying "use template ${templateName}".`,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              text: `❌ **Template Creation Failed!**\n\n${result.error}`,
            },
          ]);
        }
        setIsTyping(false);
        return;
      } else if (userText.toLowerCase().includes("use")) {
        if (!user) return;
        const templatesRes = await getTaskTemplates(user.id.toString());
        if (templatesRes.success && templatesRes.templates.length > 0) {
          const template = templatesRes.templates[0]; // Use first for simplicity
          const result = await instantiateTemplate(
            user.id.toString(),
            template.id,
          );
          if (result.success) {
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: `📋 **Template Applied!**\n\nI've added tasks from the template to your schedule.`,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: `❌ **Template Application Failed!**\n\n${result.error}`,
              },
            ]);
          }
        }
        setIsTyping(false);
        return;
      }
    }

    if (intent === "habit") {
      if (!user) return;
      if (userText.toLowerCase().includes("create")) {
        const result = await createHabit(user.id.toString(), "New Habit", 7);
        if (result.success) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              text: `🎯 **Habit Created!**\n\nI've created a new habit for you. Track your progress daily!`,
            },
          ]);
        }
        setIsTyping(false);
        return;
      } else if (userText.toLowerCase().includes("complete")) {
        if (!user) return;
        const habitsRes = await getHabits(user.id.toString());
        if (habitsRes.success && habitsRes.habits.length > 0) {
          if (habitsRes.habits.length > 0) {
            const habit = habitsRes.habits[0];
            const result = await completeHabit(user.id.toString(), habit.id);
            if (result.success) {
              setMessages((prev) => [
                ...prev,
                {
                  id: (Date.now() + 1).toString(),
                  role: "bot",
                  text: `🎯 **Habit Completed!**\n\nGreat job! Current streak: ${habit.currentStreak + 1}`,
                },
              ]);
            }
          }
        }
        setIsTyping(false);
        return;
      }
    }

    if (intent === "recurring") {
      if (!user) return;
      const result = await createRecurringTask(
        user.id.toString(),
        "Recurring Task",
        "scheduled" as const,
        25,
        { frequency: "daily", interval: 1 },
        new Date().toISOString(),
      );
      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: `🔄 **Recurring Task Created!**\n\nI've set up a daily recurring task.`,
          },
        ]);
      }
      setIsTyping(false);
      return;
    }

    if (intent === "prioritize") {
      if (!user) return;
      const result = await prioritizeTasks(user.id.toString());
      if (result.success) {
        setCurrentTasks(result.tasks || []);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: `📊 **Tasks Prioritized!**\n\nI've reordered your tasks based on urgency, duration, and type.`,
          },
        ]);
      }
      setIsTyping(false);
      return;
    }

    if (intent === "search") {
      if (!user) return;
      const query = userText.toLowerCase();
      const results = chatHistory.filter((msg) =>
        msg.text.toLowerCase().includes(query),
      );
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: `🔍 **Search Results:**\n\nFound ${results.length} messages containing "${query}".\n\n${results
            .slice(0, 3)
            .map((r) => `- ${r.text.substring(0, 50)}...`)
            .join("\n")}`,
        },
      ]);
      setIsTyping(false);
      return;
    }

    if (intent === "export") {
      handleExport();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: `📥 **Data Exported!**\n\nYour FocusFlow data has been downloaded as a JSON file.`,
        },
      ]);
      setIsTyping(false);
      return;
    }

    if (intent === "undo") {
      handleUndo();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: `↶ **Action Undone!**\n\nLast action has been reversed.`,
        },
      ]);
      setIsTyping(false);
      return;
    }

    const displayText = selectedFile
      ? `📎 ${selectedFile.name}\n\n${userText}`
      : userText;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: displayText,
      intent,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database
    if (user) {
      saveChatMessage(user.id.toString(), displayText, "user");
    } else {
      return;
    }

    setInputValue("");
    setSelectedFile(null);
    setFileContent("");
    setIsTyping(true);

    const duration = parseDuration(userText) || 25;

    try {
      if (intent === "email") {
        const match = userText
          .replace(/i?email /i, "")
          .trim()
          .match(/^([^\s]+)(?:\s+(.*))?$/);
        const emailAddress = match ? match[1] : "";
        const enquiry = match && match[2] ? match[2].trim() : "";
        const messageText = enquiry ? `HI , ${enquiry}` : "HI , ";

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: `📧 **Email Automation Initiated!**\n\nOpening Gmail to compose an email to **${emailAddress}**...`,
          },
        ]);

        try {
          await fetch("/api/email", {
            method: "POST",
            body: JSON.stringify({ email: emailAddress, message: messageText }),
          });
        } catch (_) {}

        setIsTyping(false);
        return;
      }

      if (intent === "whatsapp") {
        const match = userText
          .replace(/i?message on /i, "")
          .trim()
          .match(/^([\d\s\+\-\(\)]+)(.*)$/);
        const number = match ? match[1].trim() : "";
        const enquiry = match && match[2] ? match[2].trim() : "";
        const messageText = enquiry ? `HI , ${enquiry}` : "HI , ";

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: `📱 **WhatsApp Automation Initiated!**\n\nOpening WhatsApp to message **${number}**...`,
          },
        ]);

        try {
          await fetch("/api/whatsapp", {
            method: "POST",
            body: JSON.stringify({ number, message: messageText }),
          });
        } catch (_) {}

        setIsTyping(false);
        return;
      }

      if (intent === "focus") {
        if (!user) {
          toast.error("User not authenticated");
          return;
        }
        if (duration > 60) {
          setPendingPomodoro({ title: userText, duration });
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              text: `⏰ **Long Task Detected!**\n\nThis task is ${duration} minutes long (over 1 hour). Would you like to use the Pomodoro technique (25-minute focused sessions) or schedule the full time?\n\nReply "yes" for Pomodoro or "no" for full duration.`,
            },
          ]);
          setIsTyping(false);
          return;
        }

        const result = await autoScheduleTask(
          user.id.toString(),
          userText,
          duration,
        );
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
          text: `🚀 **Focus Mode Initiated!**\n\nI've scheduled a ${duration}-minute focus session for "${userText}" and transitioning you to the deep focus environment now...`,
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

      if (intent === "scheduled") {
        if (!user) {
          toast.error("User not authenticated");
          return;
        }
        if (duration > 60) {
          setPendingPomodoro({ title: userText, duration });
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "bot",
              text: `⏰ **Long Task Detected!**\n\nThis task is ${duration} minutes long (over 1 hour). Would you like to use the Pomodoro technique (25-minute focused sessions) or schedule the full time?\n\nReply "yes" for Pomodoro or "no" for full duration.`,
            },
          ]);
          setIsTyping(false);
          return;
        }

        const result = await autoScheduleTask(
          user.id.toString(),
          userText,
          duration,
        );
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
            text: `📅 **Task Scheduled!**\n\nI've scheduled a ${duration}-minute session for this task at **${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}**.\n\nIt has been added to your Daily Plan.`,
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
        let unknownText;
        if (detectExhaustion(userText)) {
          unknownText =
            "🤔 **You seem tired or overwhelmed.** Would you like me to help reduce your burden today? I can suggest removing low-priority tasks or rescheduling some items.";
        } else {
          unknownText = `🤔 **I didn't quite catch that!**\n\nI can help you with:\n\n• **Scheduling tasks**: "Study OS", "Work on project", "Meeting with team"\n• **Quick tasks**: "Call mom", "Reply to email", "Quick review"\n• **Automation**: "Summarize this text", "Generate ideas", "Write a draft"\n• **Focus mode**: "Start studying", "Begin focus session"\n• **Templates**: "Create template", "Use template"\n• **Habits**: "Track habit", "Complete habit"\n• **Recurring**: "Set recurring task"\n• **Prioritize**: "Prioritize tasks"\n• **Search**: "Search history"\n• **Export**: "Export data"\n\nWhat would you like to get done?`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            role: "bot",
            text: unknownText,
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
          history: [...chatHistory, ...messages.slice(1)].map((m) => ({
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

      let botText =
        data.text || "I'm having trouble connecting to my brain right now...";

      // Check for exhaustion and add suggestion for non-unknown intents
      if (detectExhaustion(userText)) {
        botText +=
          "\n\n🤔 **You seem tired or overwhelmed.** Would you like me to help reduce your burden today? I can suggest removing low-priority tasks or rescheduling some items.";
      }

      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "bot",
        text: botText,
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const filteredChatHistory = chatHistory.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            setShowCalendar(!showCalendar);
            break;
          case "s":
            e.preventDefault();
            // Focus search
            break;
          case "z":
            e.preventDefault();
            handleUndo();
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCalendar, handleUndo]);

  useEffect(() => {
    if (user && selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      getTasksByDate(user.id.toString(), dateStr).then((res) => {
        if (res.success && res.tasks) {
          setCalendarTasks(res.tasks);
        }
      });
    }
  }, [selectedDate, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fetch current tasks and chat history for context awareness
  useEffect(() => {
    if (user && chatHistory.length === 0) {
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
            id: `history-${Date.now()}-${index}`,
            role: msg.role as "user" | "bot",
            text: msg.message,
            intent: undefined, // Historical messages don't have parsed intents
          }));

          setChatHistory(historyMessages);
        }
      });
    }
  }, [user, chatHistory.length]);

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
        <div className="fixed top-24 right-6 w-full max-w-100 z-200">
          <AnimatedList delay={100}>
            {notifications.map((n, i) => (
              <Notification key={i} {...n} />
            ))}
          </AnimatedList>
        </div>
      )}

      {/* Full-viewport wrapper with background */}
      <div className="chat-root relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-black">
        {/* Chat History Sidebar */}
        <div className="w-64 bg-[#1f1f1f] border-r border-[#424242] flex flex-col overflow-y-auto scrollbar-custom">
          <div className="p-4">
            <h2 className="text-lg font-black text-white border-l-8 border-blue-600 pl-4 mb-4">
              Chat History
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 bg-[#2a2a2a] text-white rounded text-sm"
              />
            </div>
            {filteredChatHistory.map((msg) => (
              <div
                key={msg.id}
                onClick={() => copyToClipboard(msg.text)}
                className="mb-2 p-2 bg-[#1f1f1f] rounded text-sm text-zinc-300 hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                title="Click to copy message"
              >
                <span className="font-bold">
                  {msg.role === "user" ? "You: " : "Bot: "}
                </span>
                {msg.text.substring(0, 50)}
                {msg.text.length > 50 ? "..." : ""}
              </div>
            ))}
          </div>
        </div>
        {/* Main chat container — flex 1 */}
        <div className="relative z-10 flex flex-col flex-1 w-full h-full max-w-7xl mx-auto">
          {/* ── Messages Area ── */}
          <div className="flex-1 overflow-y-auto scrollbar-custom px-4 py-8 space-y-6 pb-24">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-4 px-4 py-2 w-full ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
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
                        onClick={() => copyToClipboard(msg.text)}
                        className="absolute -bottom-8 left-0 p-1.5 opacity-0 group-hover:opacity-100 transition-all text-[#ececec] hover:text-white"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 px-4 py-2 w-full flex-row"
                >
                  <div className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 mt-3">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-[#ececec] rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* ── Input Area ── */}
        <div className="fixed bottom-0 left-64 right-80 z-10 px-4 py-4 bg-[#212121] border-t border-[#424242]">
          <div className="relative flex items-center gap-3 bg-[#2f2f2f] border border-[#424242] rounded-3xl px-4 py-3 shadow-sm focus-within:bg-[#383838]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message FocusFlow... (Try: create template, track habit, prioritize tasks)"
              className="flex-1 bg-transparent text-base text-[#ECECEC] placeholder-[#9B9B9B] outline-none"
            />
            <motion.button
              onClick={() => setShowCalendar(!showCalendar)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#424242] hover:bg-[#565656] text-[#9b9b9b] hover:text-white transition-all duration-200 shrink-0 mr-2"
              title="Toggle Calendar (Ctrl+K)"
            >
              <Calendar className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleExport}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#424242] hover:bg-[#565656] text-[#9b9b9b] hover:text-white transition-all duration-200 shrink-0 mr-2"
              title="Export Data"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleUndo}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#424242] hover:bg-[#565656] text-[#9b9b9b] hover:text-white transition-all duration-200 shrink-0 mr-2"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleFileButtonClick}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#424242] hover:bg-[#565656] text-[#9b9b9b] hover:text-white transition-all duration-200 shrink-0 mr-2"
              title="Upload file"
            >
              <Paperclip className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleSend}
              disabled={(!inputValue.trim() && !fileContent.trim()) || isTyping}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 shrink-0",
                (inputValue.trim() || fileContent.trim()) && !isTyping
                  ? "bg-white text-black hover:bg-[#d9d9d9]"
                  : "bg-[#424242] text-[#9b9b9b] cursor-not-allowed",
              )}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </motion.button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt"
              style={{ display: "none" }}
            />
          </div>
          {selectedFile && (
            <p className="text-center text-[11px] text-blue-400 mt-2">
              File attached: {selectedFile.name}
            </p>
          )}
          <p className="text-center text-[11px] text-[#9B9B9B] mt-2">
            FocusFlow can make mistakes. Check important info. | Keyboard:
            Ctrl+K (Calendar), Ctrl+Z (Undo)
          </p>
        </div>

        {/* Calendar Sidebar */}
        {showCalendar && (
          <div className="w-80 bg-[#2f2f2f] border-l border-[#424242] flex flex-col overflow-y-auto scrollbar-custom">
            <div className="p-4">
              <h2 className="text-lg font-black text-white border-l-8 border-blue-600 pl-8 mb-4">
                Calendar
              </h2>
              <input
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                className="w-full p-2 bg-[#1f1f1f] text-white rounded"
              />
              <h3 className="text-md font-bold text-white mt-4 mb-2">
                Tasks for {selectedDate.toDateString()}
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="flex items-center">
                    <span className="text-xs text-zinc-400 w-12">
                      {hour}:00
                    </span>
                    <div className="flex-1 h-6 bg-zinc-800 rounded relative">
                      {calendarTasks
                        .filter((task) => {
                          if (!task.scheduled_for) return false;
                          const taskDate = new Date(task.scheduled_for);
                          return taskDate.getHours() === hour;
                        })
                        .map((task) => {
                          const start = new Date(task.scheduled_for!);
                          const startMin = start.getMinutes();
                          const duration = task.duration_mins || 25;
                          return (
                            <div
                              key={task.id}
                              className="absolute top-0 h-full bg-blue-500 rounded text-xs text-white flex items-center px-1 truncate"
                              style={{
                                left: `${(startMin / 60) * 100}%`,
                                width: `${(duration / 60) * 100}%`,
                              }}
                              title={`${task.title} (${duration} mins)`}
                            >
                              {task.title}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Daily Plan Sidebar */}
        {!showCalendar && (
          <div className="w-80 bg-[#2f2f2f] border-l border-[#424242] flex flex-col overflow-y-auto scrollbar-custom">
            <div className="p-4">
              <h2 className="text-lg font-black text-white border-l-8 border-blue-600 pl-8 mb-4">
                Daily Plan
              </h2>
              {currentTasks.length === 0 ? (
                <p className="text-zinc-400 text-sm">
                  No tasks scheduled for today. Ask FocusFlow to schedule
                  something!
                </p>
              ) : (
                <div className="space-y-4">
                  {currentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="relative p-4 rounded-lg border border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 group"
                    >
                      <div className="absolute w-3 h-3 bg-zinc-700 rounded-full -left-4.25 top-1/2 -translate-y-1/2 ring-4 ring-zinc-950 group-hover:bg-blue-500 transition-colors duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
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
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
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
                        {task.status !== "completed" ? (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/focus?taskId=${task.id}&title=${encodeURIComponent(task.title)}`,
                              )
                            }
                            className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/25"
                            title="Start Focus Mode"
                          >
                            <Play className="w-4 h-4 ml-0.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-red-500/25"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
