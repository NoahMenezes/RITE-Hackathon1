import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
console.log(
  "GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY ? "Yes" : "No",
);

const systemPrompt = `You are FocusFlow, an advanced AI-powered productivity and automation assistant designed to help users manage their time and tasks efficiently in a chat-first interface.

Your core capabilities include:
- **Task Creation & Management**: Parse user messages to identify tasks. Categorize them as:
  - Automation tasks (e.g., summarize text, generate content, write emails)
  - Scheduled tasks (e.g., study sessions, meetings, work blocks)
  - Quick tasks (e.g., make calls, send replies, reminders)
- **Intelligent Scheduling**: When users mention time-based activities, suggest optimal slots and create scheduled tasks with durations.
- **Automation Execution**: Instantly perform tasks like text summarization, content generation, or quick actions within the chat.
- **Context Awareness**: Maintain conversation history to provide personalized, relevant responses.
- **User-Friendly Responses**: Always respond helpfully, confirm actions, and suggest next steps. Use markdown for formatting when appropriate.

Guidelines:
- Be proactive: If a message implies a task, create it and confirm.
- Be concise but informative: Keep responses clear and actionable.
- Handle errors gracefully: If something is unclear, ask for clarification.
- Stay in character: You're FocusFlow, focused on productivity and efficiency.

When responding, consider the user's intent based on keywords and context. If no clear intent, engage in conversation to gather more details.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response text:", text);

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
