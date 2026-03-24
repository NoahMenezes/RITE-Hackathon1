# 🚀 TaskPilot Project Roadmap
Welcome to the TaskPilot MVP development roadmap! This document outlines our step-by-step plan to transform our current Next.js + Turso boilerplate into the ultimate chat-first productivity and automation assistant. 
Team: Claim a task, mark it as in-progress (`[~]`), and check it off (`[x]`) when done.
---
## 🏗️ Phase 1: Core Chat Interface & Foundation
*Goal: Build the primary way the user interacts with TaskPilot.*
- [x] **1.1 Database Schema Setup (Turso)**
  - Create `tasks` table: `id`, `user_id`, `title`, `type` (automated, scheduled, quick), `status` (pending, completed), `scheduled_for`, `duration_mins`.
  - Create `chat_history` table: `id`, `user_id`, `message`, `role` (user, bot), `created_at`.
- [x] **1.2 Chat UI Component (`/app/dashboard/chat`)**
  - Build a chat-like interface (similar to ChatGPT) using Framer Motion for smooth transitions.
  - Create an input box that handles 'Enter' to submit.
  - Display chat history dynamically.
- [x] **1.3 Basic Intent Parser (The "Brain")**
  - Create a utility function `parseIntent(input: string)` in `/lib/parser.ts`.
  - Implement keyword matching for MVP:
    - *Summarize/Generate/Write* -> Automation
    - *Study/Work/Meeting* -> Scheduled
    - *Call/Reply/Quick* -> Quick Task
---
## 🤖 Phase 2: The Automation Engine (The "WOW" Factor)
*Goal: Allow the bot to execute tasks instantly in the chat.*
- [x] **2.1 LLM Integration (OpenAI/Gemini)**
  - Set up an API route (e.g., `/app/api/chat/route.ts`) to handle complex queries.
  - Implement the "Summarize this text" feature.
  - Have the bot reply directly in the chat with the summarized content.
- [x] **2.2 Auto-Execute UI**
  - Render automation results beautifully in the chat (e.g., Markdown support, copy-to-clipboard button).
- [x] **2.3 Quick Task Burst Grouping**
  - Detect multiple quick tasks and auto-group them into a single "15-min Quick Task Burst".
---
## ⏱️ Phase 3: Smart Scheduler & Daily Plan
*Goal: Help users block out their time automatically.*
- [ ] **3.1 Daily Plan View (UI)**
  - Build a timeline view component on the Dashboard showing today's schedule.
  - Fetch `scheduled` tasks from Turso and render them in chronological order.
- [ ] **3.2 Auto-Scheduling Logic**
  - If a user says "Study OS", automatically calculate the next free 25-minute slot and insert it into the database.
  - Have the bot reply: *"I've scheduled a 25-minute Pomodoro session for OS at [Time]."*
- [ ] **3.3 Conflict Resolution (Basic)**
  - Ensure the scheduler doesn't double-book timeslots.
---
## 🎯 Phase 4: Focus Mode (Execution)
*Goal: Keep the user on track when it's time to work.*
- [ ] **4.1 Focus Mode UI Component**
  - Create a distraction-free view/modal when a task starts.
  - Display a giant Pomodoro Timer (25:00).
  - Show the current task title.
- [ ] **4.2 Timer Logic**
  - Implement start, pause, and stop functionality.
  - Add a "Mark Done" button that updates the task status in Turso.
- [ ] **4.3 "Start from Chat" Feature**
  - If user types "Start studying", trigger the Focus Mode modal instantly from the chat screen.
---
## 🎨 Phase 5: Polish & Demo Prep
*Goal: Make it look incredible for the judges.*
- [ ] **5.1 Animations & Feedback**
  - Add loading skeletons or "Bot is thinking..." typing indicators.
  - Add toast notifications (using a library like `sonner` or `react-hot-toast`) for task creation.
- [ ] **5.2 Error Handling**
  - Handle cases where the parser doesn't understand the user gracefully (*"I didn't quite catch that. Did you want to schedule a task or summarize something?"*).
- [ ] **5.3 Pre-seed Demo Data**
  - Create a script or button to inject a perfect "demo day" scenario so the presentation goes flawlessly without manual typing setup.
---
### 💡 Tech Stack Reminders
- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Auth & DB**: Turso
