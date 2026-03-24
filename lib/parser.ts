export type TaskIntent =
  | "automation"
  | "scheduled"
  | "quick"
  | "focus"
  | "unknown";

export function parseIntent(input: string): TaskIntent {
  const lowerInput = input.toLowerCase();

  // Automation keywords: Summarize/Generate/Write
  if (
    lowerInput.includes("summarize") ||
    lowerInput.includes("generate") ||
    lowerInput.includes("write")
  ) {
    return "automation";
  }

  // Scheduled keywords: Study/Work/Meeting
  if (
    lowerInput.includes("study") ||
    lowerInput.includes("work") ||
    lowerInput.includes("meeting")
  ) {
    return "scheduled";
  }

  // Quick task keywords: Call/Reply/Quick
  if (
    lowerInput.includes("call") ||
    lowerInput.includes("reply") ||
    lowerInput.includes("quick")
  ) {
    return "quick";
  }

  // Focus keywords: Start
  if (lowerInput.startsWith("start") || lowerInput.includes("focus")) {
    return "focus";
  }

  return "unknown";
}
