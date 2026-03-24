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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
