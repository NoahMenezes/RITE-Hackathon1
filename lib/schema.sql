RITE-Hackathon1/app/actions/schema.ts
-- Database schema extensions for advanced productivity features
-- These tables support task templates, habits, and recurring tasks
-- Run these migrations to enable the new features

-- Task Templates Table
-- Stores reusable task templates that users can instantiate
CREATE TABLE IF NOT EXISTS task_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  data TEXT NOT NULL, -- JSON: {name, description, tasks: [{title, type, durationMins, priority}]}
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Habits Table
-- Tracks user habits with streaks and completion history
CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  data TEXT NOT NULL, -- JSON: {title, targetDays, currentStreak, longestStreak, lastCompleted}
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Extend tasks table with recurring field (if not exists)
-- This stores recurring task configuration as JSON
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurring TEXT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_templates_user_id ON task_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_recurring ON tasks(recurring) WHERE recurring IS NOT NULL;

-- Chat History Table (if not exists - for chat persistence)
CREATE TABLE IF NOT EXISTS chat_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at);
