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
    const list = [];
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

        list.push(task);
    }

    return list;
}

// --- RENDER SCHEDULE ---
function renderSchedule() {
    const container = document.getElementById("schedule");
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = "<p>No tasks planned yet.</p>";
        return;
    }

    tasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.className = `task-block ${task.type} ${task.isCompleted ? 'completed' : ''}`;
        div.innerHTML = `
            <strong>${task.label}</strong> (${task.minutes} mins)
            ${task.isCompleted ? ' ✓' : ''}
        `;
        div.onclick = () => startTimer(index);
        container.appendChild(div);
    });

    document.getElementById("scheduledCount").innerText = tasks.length;
    document.getElementById("completedCount").innerText = completedTasks;
    document.getElementById("pomodoroCount").innerText = pomodoroSessions;
}

// --- TIMER FOCUS ---
function startTimer(index) {
    const task = tasks[index];
    if (task.isCompleted) return;

    remaining = POMODORO_SECONDS; // Reset to 25 mins or task mins if desired
    updateTimerDisplay();

    document.getElementById("timerView").classList.remove("hidden");
    document.getElementById("doneBtn").classList.add("hidden");

    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        remaining--;
        updateTimerDisplay();

        if (remaining <= 0) {
            clearInterval(timer);
            document.getElementById("doneBtn").classList.remove("hidden");
            pomodoroSessions++;
            document.getElementById("pomodoroCount").innerText = pomodoroSessions;
        }
    }, 1000);

    document.getElementById("doneBtn").onclick = () => {
        task.isCompleted = true;
        completedTasks++;
        document.getElementById("timerView").classList.add("hidden");
        renderSchedule();
    };
}

function updateTimerDisplay() {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    document.getElementById("timer").innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    const percent = ((POMODORO_SECONDS - remaining) / POMODORO_SECONDS) * 100;
    document.getElementById("progressBar").style.width = `${percent}%`;
}

// --- LISTENERS ---
document.getElementById("planBtn").onclick = () => {
    const input = document.getElementById("userInput").value;
    tasks = parseTasks(input);
    completedTasks = 0;
    renderSchedule();
};

document.getElementById("stopTimer").onclick = () => {
    clearInterval(timer);
    document.getElementById("timerView").classList.add("hidden");
};