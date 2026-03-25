import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;
console.log(
  "GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY ? "Yes" : "No",
);

const systemPrompt = `You are FocusFlow, an advanced AI-powered productivity and automation assistant designed to help users manage their time and tasks efficiently in a chat-first interface.

Your core capabilities include:
- **Advanced Intent Recognition**: Use natural language processing to understand user intent from context, not just keywords. Recognize implicit tasks, time references, and user preferences.
- **Task Creation & Management**: Parse user messages to identify tasks. Categorize them as:
  - Automation tasks (e.g., summarize text, generate content, write emails)
  - Scheduled tasks (e.g., study sessions, meetings, work blocks)
  - Quick tasks (e.g., make calls, send replies, reminders)
  - Focus sessions (e.g., deep work, Pomodoro sessions)
- **Intelligent Scheduling**: When users mention time-based activities, suggest optimal slots and create scheduled tasks with durations. Consider user's existing schedule, energy patterns, and task priorities.
- **Context Awareness & Memory**: Maintain conversation history, remember user preferences (e.g., "I prefer 25-min sessions"), work patterns, and past interactions. Reference previous conversations naturally.
- **Proactive Assistance**: Anticipate user needs based on patterns. Suggest optimizations like "You usually study for 45 minutes - should I schedule that?" or "It's 2pm, time for your daily review?"
- **Smart Duration Estimation**: Automatically estimate task durations based on type and user history. Parse complex time expressions like "tomorrow at 3pm for 1.5 hours".
- **Automation Execution**: Instantly perform tasks like text summarization, content generation, or quick actions within the chat.
- **WhatsApp/Email Automation**: If a user wants to send a WhatsApp message or Email and doesn't specify the content, politely ask them what they would like to include using rich markdown formatting. If they DO provide the content, you MUST generate a clickable markdown link for them to send it instantly. NEVER cut off your sentences.
  - For WhatsApp: "[Send WhatsApp Message](https://wa.me/PHONENUMBER?text=URL_ENCODED_MESSAGE)" (ensure phone number has no '+' or spaces).
  - For Email: "[Send Email](mailto:EMAIL_ADDRESS?subject=URL_ENCODED_SUBJECT&body=URL_ENCODED_BODY)"
- **Smart Calendar Scheduling**: When a user asks to schedule an event, block time, or create a study session, you MUST generate a direct Google Calendar event link using this format in your markdown response: "[Add to Google Calendar](https://calendar.google.com/calendar/render?action=TEMPLATE&text=URL_ENCODED_TITLE&dates=YYYYMMDDTHHmmssZ/YYYYMMDDTHHmmssZ&details=URL_ENCODED_DETAILS)". Calculate the correct start and end dates (in UTC) based on their request and current time. Ensure the link is prominent.
- **Start Focus Action**: If the user wants to start a focus session NOW, include the exact string \`[ACTION:START_FOCUS]\` anywhere in your response.
- **User-Friendly Responses**: Always respond helpfully, confirm actions, and suggest next steps. Liberally use emojis and rich markdown formatting (like bold text, italics, blockquotes, and lists) to make the conversation visually engaging and structured.

Advanced Guidelines:
- **Natural Language Understanding**: Parse complex requests like "Schedule a meeting with John tomorrow at 3pm and remind me to prepare the agenda 30 minutes before"
- **Contextual Responses**: Reference user history: "Like last time, I'll schedule this for 25 minutes"
- **Proactive Suggestions**: Based on time/context: "It's Monday morning - ready for your weekly planning session?"
- **Error Recovery**: If unclear, ask specific questions: "Should this be a 30-minute or 60-minute session?"
- **Personalization**: Adapt to user patterns: "You typically work best 9-11am, so I scheduled this then"
- **Multi-intent Handling**: Process multiple tasks in one message: "Study math and then write the report"
- **Be concise but informative**: Keep responses clear and actionable.
- **Stay in character**: You're FocusFlow, focused on productivity and efficiency.

SMART DURATION ESTIMATION RULES:
- **Study/Work Tasks**: 25-45 minutes (Pomodoro-style), 90 minutes max per session
- **Meetings**: 30-60 minutes, round up to nearest 15 minutes
- **Quick Tasks**: 5-15 minutes
- **Creative Tasks**: 60-120 minutes
- **Review Tasks**: 15-30 minutes
- **Default**: 25 minutes if unspecified
- **Scale by Complexity**: "Quick review" = 15min, "Deep dive" = 60min

TIME PARSING PATTERNS:
- "tomorrow at 3pm" → next day at 15:00
- "in 2 hours" → current time + 2 hours
- "this afternoon" → 14:00-17:00 range
- "morning" → 09:00-12:00 range
- "evening" → 18:00-21:00 range
- "next Monday 10am" → next Monday at 10:00
- "end of day" → 17:00

Response Strategy:
1. **Analyze Intent**: Determine if user wants to create, modify, or inquire about tasks
2. **Extract Details**: Parse time, duration, priority, and dependencies
3. **Estimate Duration**: Use smart rules if not specified
4. **Check Context**: Reference conversation history and user patterns
5. **Confirm Actions**: Always confirm what you're doing and why
6. **Suggest Improvements**: Offer optimizations based on best practices
7. **Handle Edge Cases**: Gracefully manage unclear requests or conflicts`;

export async function POST(req: Request) {
  try {
    const { message, history, userContext, currentTasks } = await req.json();

    // Check if API key is available
    if (!genAI) {
      // Fallback response when no API key
      let fallbackText =
        "I'm currently operating in offline mode without AI assistance. ";

      if (
        message.toLowerCase().includes("schedule") ||
        message.toLowerCase().includes("task")
      ) {
        fallbackText +=
          "I can help you schedule tasks! Try saying 'Schedule a 25-minute study session' or 'Create a quick task to call mom'.";
      } else if (message.toLowerCase().includes("focus")) {
        fallbackText +=
          "Ready to start focus mode? I can help you begin a focused work session.";
      } else {
        fallbackText +=
          "I understand you're looking for productivity help. I can assist with task scheduling, focus sessions, and time management.";
      }

      return NextResponse.json({ text: fallbackText });
    }

    // Build enhanced context for the LLM
    let enhancedPrompt = systemPrompt;

    if (userContext) {
      enhancedPrompt += `\n\nUSER CONTEXT:
- User ID: ${userContext.id}
- Name: ${userContext.name || "Unknown"}
- Email: ${userContext.email}
- Current Time: ${new Date().toISOString()}`;
    }

    if (currentTasks && currentTasks.length > 0) {
      enhancedPrompt += `\n\nCURRENT SCHEDULE:
${currentTasks
  .map(
    (task: Task) =>
      `- ${task.title} (${task.duration_mins}min) at ${task.scheduled_for ? new Date(task.scheduled_for).toLocaleTimeString() : "Unscheduled"} - ${task.status}`,
  )
  .join("\n")}`;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: enhancedPrompt,
    });

    // Ensure history strictly follows user/model alternation for Gemini
    const sanitizedHistory: { role: string; parts: { text: string }[] }[] = [];
    let lastRole = null;
    
    for (const msg of history || []) {
      if (msg && (msg.role === "user" || msg.role === "model") && msg.parts?.[0]?.text) {
        if (msg.role !== lastRole) {
          sanitizedHistory.push({ role: msg.role, parts: [{ text: msg.parts[0].text }] });
          lastRole = msg.role;
        } else if (sanitizedHistory.length > 0) {
          // Collapse adjacent messages of the same role
          sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += "\n\n" + msg.parts[0].text;
        }
      }
    }
    
    // Gemini history must start with 'user'
    while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== "user") {
      sanitizedHistory.shift();
    }
    
    // Gemini history must end with 'model' before the next 'user' message is sent
    if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === "user") {
      sanitizedHistory.pop();
    }

    const chat = model.startChat({
      history: sanitizedHistory,
      generationConfig: {
        maxOutputTokens: 1200,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log("Enhanced Gemini response with context:", text);

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
