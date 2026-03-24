"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Copy, Check, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseIntent, TaskIntent } from "../../../lib/parser";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  intent?: TaskIntent;
  isQuickBurst?: boolean;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Hi there! I'm TaskPilot. What would you like to get done today? (Try asking me to summarize something, schedule a study session, or remind you to make a call!)",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quickTaskBuffer, setQuickTaskBuffer] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const intent = parseIntent(userText);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
      intent,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // 2.3 Quick Task Burst Logic
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
          setQuickTaskBuffer([]);
          setIsTyping(false);
          return;
        }
      }

      // 2.1 LLM Integration via API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(1).map((m) => ({
            role: m.role === "bot" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
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
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "bot",
        text: "Sorry, I encountered an error processing that request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mt-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              TaskPilot Assistant
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Phase 2: Automation Engine Active
            </p>
          </div>
        </div>
        {quickTaskBuffer.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-900/50 animate-pulse">
            <Sparkles className="w-3 h-3" />
            Burst Buffer: {quickTaskBuffer.length}/3
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-gray-950 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}

              <div
                className={`group relative max-w-[80%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : msg.isQuickBurst
                      ? "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-900/20 border border-blue-100 dark:border-blue-900/50 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                }`}
              >
                <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:text-gray-100 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>

                {msg.role === "bot" && (
                  <button
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    className="absolute -right-10 top-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Copy to clipboard"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}

                {msg.intent && msg.intent !== "unknown" && (
                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700/50 text-[10px] font-black flex items-center gap-2 text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    <span>{msg.intent} Intent</span>
                    {msg.isQuickBurst && <span>• Grouped</span>}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1 shadow-sm border border-transparent dark:border-gray-700/30">
                <motion.div
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your task here... (e.g. 'Summarize this doc')"
              className="w-full pl-5 pr-12 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500"
            />
            <div
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all ${inputValue.trim() ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/20"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-4 font-black uppercase tracking-widest">
          TaskPilot Intelligent Engine v2.0
        </p>
      </div>
    </div>
  );
}
