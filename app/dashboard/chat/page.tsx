"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { parseIntent, TaskIntent } from "../../../lib/parser";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  intent?: TaskIntent;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate network delay for bot response
    setTimeout(() => {
      const intent = parseIntent(userText);
      let botResponseText = "";

      switch (intent) {
        case "automation":
          botResponseText = "I've detected an automation task. I will process and generate the results for you shortly.";
          break;
        case "scheduled":
          botResponseText = "Got it. I'm scheduling a 25-minute block for this task. I'll let you know when it's time to start.";
          break;
        case "quick":
          botResponseText = "I've added this to your quick tasks. We can group these together in a 15-minute burst later!";
          break;
        default:
          botResponseText = "I'm not quite sure how to categorize that. Could you clarify if you want to summarize, schedule, or just do a quick task?";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: botResponseText,
        intent,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
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
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">TaskPilot Assistant</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Online & ready to help</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-gray-950">
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
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                }`}
              >
                {msg.text}
                {msg.intent && msg.intent !== "unknown" && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/50 text-xs font-medium flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span className="uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {msg.intent} Detected
                    </span>
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
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1 shadow-sm">
                <motion.div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your task here... (e.g. 'Summarize this article')"
            className="w-full pl-5 pr-12 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full transition-colors disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3 font-medium">
          TaskPilot uses AI. Check for mistakes.
        </p>
      </div>
    </div>
  );
}