import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
console.log(
  "GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY ? "Yes" : "No",
);

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Temporarily mock the response for debugging
    const mockResponses = [
      "That's an interesting point! Can you tell me more?",
      "I understand. Let me help you with that.",
      "Great question! Here's what I think...",
      "Thanks for sharing. How can I assist further?",
      "Noted! Is there anything else on your mind?",
    ];
    const randomResponse =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const text = `Mock response: ${randomResponse} (Original message: "${message}")`;

    console.log("Mock response text:", text);

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
