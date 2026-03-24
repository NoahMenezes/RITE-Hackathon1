"use client";

import React from "react";
import { Lightbulb, Clock, Target, Flame } from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: number;
}

interface SmartSuggestionsProps {
  onSuggestionClick: (suggestion: Suggestion) => void;
  currentTime: Date;
  userPatterns: string[];
  recentTasks: string[];
}

export default function SmartSuggestions({
  onSuggestionClick,
  currentTime,
  userPatterns,
  recentTasks,
}: SmartSuggestionsProps) {
  // Generate smart suggestions based on time, patterns, and recent activity
  const suggestions: Suggestion[] = React.useMemo(() => {
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const baseSuggestions: Suggestion[] = [];

    // Time-based suggestions
    if (hour >= 6 && hour < 12) {
      baseSuggestions.push({
        id: "morning-focus",
        title: "Morning Deep Work Session",
        description: "Start your day with focused work when energy is high",
        action: "focus",
        icon: Lightbulb,
        priority: 9,
      });
    } else if (hour >= 12 && hour < 17) {
      baseSuggestions.push({
        id: "afternoon-break",
        title: "Afternoon Productivity Burst",
        description: "Quick 25-minute focus session before evening",
        action: "focus",
        icon: Clock,
        priority: 8,
      });
    } else if (hour >= 17 && hour < 22) {
      baseSuggestions.push({
        id: "evening-review",
        title: "Evening Task Review",
        description: "Review completed tasks and plan for tomorrow",
        action: "review",
        icon: Target,
        priority: 7,
      });
    }

    // Pattern-based suggestions
    if (userPatterns.includes("study")) {
      baseSuggestions.push({
        id: "study-habit",
        title: "Build Study Habit",
        description: "Create a recurring study session",
        action: "habit",
        icon: Flame,
        priority: 8,
      });
    }

    if (userPatterns.includes("exercise")) {
      baseSuggestions.push({
        id: "exercise-focus",
        title: "Exercise Focus Block",
        description: "Dedicated time for physical activity",
        action: "focus",
        icon: Target,
        priority: 7,
      });
    }

    // Recent task-based suggestions
    if (recentTasks.length > 0) {
      baseSuggestions.push({
        id: "continue-task",
        title: "Continue Recent Work",
        description: `Pick up where you left off with "${recentTasks[0]}"`,
        action: "focus",
        icon: Clock,
        priority: 6,
      });
    }

    // Weekend vs weekday suggestions
    if (isWeekend) {
      baseSuggestions.push({
        id: "weekend-project",
        title: "Weekend Deep Dive",
        description: "Longer focus sessions for personal projects",
        action: "focus",
        icon: Lightbulb,
        priority: 8,
      });
    } else {
      baseSuggestions.push({
        id: "weekday-efficiency",
        title: "Weekday Efficiency Mode",
        description: "Optimize for work-life balance",
        action: "prioritize",
        icon: Target,
        priority: 7,
      });
    }

    // Sort by priority and return top 3
    return baseSuggestions.sort((a, b) => b.priority - a.priority).slice(0, 3);
  }, [currentTime, userPatterns, recentTasks]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-white border-l-8 border-green-600 pl-8">
        Smart Suggestions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.id}
              onClick={() => onSuggestionClick(suggestion)}
              className="flex items-start gap-3 p-4 bg-green-900/20 border border-green-800 rounded-lg hover:border-green-500/50 transition-all group text-left"
            >
              <Icon className="w-6 h-6 text-green-400 group-hover:text-green-300 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  {suggestion.title}
                </div>
                <div className="text-xs text-green-300 leading-relaxed">
                  {suggestion.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
