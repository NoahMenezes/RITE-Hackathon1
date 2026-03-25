# 🚀 FocusFlow: Hackathon Action Plan & Fixes

This document outlines the high-impact features to add and the critical bugs to fix before demo day. Implement these step-by-step to guarantee a "wow" factor for the judges.

---

## 🌟 Quick-Win Automations (The "Wow" Factor)

### 1. Voice Input (Speech-to-Text) 🎙️
**Why:** A "Chat-First" assistant becomes a "Voice-First" assistant. Judges love live voice demos.
**How to Implement:**
1. In your chat component (`/app/dashboard/chat/page.tsx`), add a microphone icon button next to the input field.
2. Use the native `window.SpeechRecognition` or `window.webkitSpeechRecognition` API.
3. On click, start listening, transcribe the audio, and auto-fill the input box.
4. Auto-submit the form when the user stops speaking.

### 3. Downloadable Notes (.txt/.md export) 📄
**Why:** If the bot summarizes a long text, the user should be able to keep it.
**How to Implement:**
1. In the chat UI, detect if the bot's response is long or contains a summary.
2. Render a "Download Note" button beneath the message.
3. On click, create a blob:
   ```javascript
   const blob = new Blob([botMessage], { type: 'text/markdown' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'FocusFlow_Summary.md';
   a.click();
   ```

### 4. Website Link Summarization 🔗
**Why:** Typing "Summarize this: [paste 500 words]" is clunky. "Summarize https://example.com" is magic.
**How to Implement:**
1. In `/app/api/chat/route.ts`, before sending the message to Gemini, use a regex to detect if the user sent a URL.
2. If yes, run a quick `fetch(url)`, strip HTML tags using a basic regex or library like `cheerio`.
3. Append the scraped text to the user's prompt: `"Summarize this content: " + scrapedText`.