"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type TaskIntent =
  | "automation"
  | "scheduled"
  | "quick"
  | "focus"
  | "unknown";

const intentPrompt = `You are an intent classification AI for a productivity assistant. Analyze the user's message and classify their intent into exactly ONE of these categories:

- "automation": Tasks involving content creation, summarization, writing, or AI-powered work (e.g., "summarize this article", "write an email", "generate ideas")
- "scheduled": Time-based tasks that need calendar slots (e.g., "study for 2 hours", "meeting tomorrow at 3pm", "work on project")
- "quick": Fast, simple tasks that don't need scheduling (e.g., "call mom", "reply to email", "quick check")
- "focus": Starting or requesting focus/deep work sessions (e.g., "start studying", "begin focus mode", "deep work session")
- "unknown": If the intent is unclear or doesn't fit other categories

Return ONLY the category name in lowercase, nothing else. Be smart about context and natural language.`;

export async function parseIntent(input: string): Promise<TaskIntent> {
  try {
    // Quick keyword check for performance - if obvious, return immediately
    const lowerInput = input.toLowerCase();

    // Obvious automation keywords
    if (
      lowerInput.includes("summarize") ||
      lowerInput.includes("generate") ||
      lowerInput.includes("write")
    ) {
      return "automation";
    }

    // Obvious focus keywords
    if (
      lowerInput.startsWith("start") ||
      lowerInput.includes("focus") ||
      lowerInput.includes("deep work")
    ) {
      return "focus";
    }

    // For ambiguous cases, use LLM
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: intentPrompt,
    });

    const result = await model.generateContent(input);
    const response = await result.response;
    const intent = response.text().trim().toLowerCase();

    // Validate the response is a valid intent
    if (
      ["automation", "scheduled", "quick", "focus", "unknown"].includes(intent)
    ) {
      return intent as TaskIntent;
    }

    return "unknown";
  } catch (error) {
    console.error("Intent parsing error:", error);
    // Fallback to basic keyword matching
    const lowerInput = input.toLowerCase();

    if (
      lowerInput.includes("study") ||
      lowerInput.includes("work") ||
      lowerInput.includes("meeting")
    ) {
      return "scheduled";
    }
    if (
      lowerInput.includes("call") ||
      lowerInput.includes("reply") ||
      lowerInput.includes("quick")
    ) {
      return "quick";
    }

    return "unknown";
  }
}
