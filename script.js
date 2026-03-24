// script.js

// Global state
let tasks = [];
let completedTasks = 0;
let pomodoroSessions = 0;
const POMODORO_SECONDS = 25 * 60; // 25 minutes
let timer = null;
let remaining = POMODORO_SECONDS;

// --- PARSING: raw text → tasks ---
function parseTasks(rawInput) {
    const tasks = [];
    const phrases = rawInput.trim().split(/,|and/i); // split by comma or "and"

    function getMinutes(text) {
        // look for "X hours"
        const hourMatch = text.match(/(\d+)\s*hour[s]?/i);
        if (hourMatch) return parseInt(hourMatch[1]) * 60;

        // look for "X mins"
        const minMatch = text.match(/(\d+)\s*min[s]?/i);
        if (minMatch) return parseInt(minMatch[1]);

        // if it mentions "emails", assume 5 mins each
        if (/\bemail[s]?\b/i.test(text)) {
            const n = text.match(/(\d+)(\s*email[s]?)/i);
            if (n) return parseInt(n[1]) * 5;
        }

        // default
        return 30;
    }

    for (let phrase of phrases) {
        phrase = phrase.trim();
        if (!phrase) continue;

        const task = {
            label: phrase,
            minutes: getMinutes(phrase),
            type: "light",
            isCompleted: false,
        };

        // Simple type guess
        if (
            /study|code|work on|project|book|paper|research|exam|preparation|reading/i.test(
                phrase
            )
        ) {
            task.type = "deep";
        } else if (/\bwalk\b|break|rest|snack|lunch|tea|news/i.test(phrase)) {
            task.type = "break";
        } else {
            task.type = "light";
        }

        tasks.push(task);
    }

    return tasks;
}

// --- RENDER SCHEDULE 