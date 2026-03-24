const fs = require('fs');
let code = fs.readFileSync('app/dashboard/chat/page.tsx', 'utf8');

// The issue here is we deleted the old message but we didn't inject the exact start/end time.
// Actually, if we just give the AI the exact start and end time, it will generate the right Gcal link.
code = code.replace(
  /userText = \`Schedule "\$\{pendingPomodoro\.title\}" using Pomodoro technique \(25 min\)\.\`;/g,
  "userText = `Schedule \"${pendingPomodoro.title}\" for 25 minutes using Pomodoro. NOTE TO AI: The start time is exactly ${scheduledTime.toISOString()} and the end time is exactly ${new Date(scheduledTime.getTime() + 25 * 60000).toISOString()}. Use these exact times for the Google Calendar link.`;"
);

code = code.replace(
  /userText = \`Schedule "\$\{pendingPomodoro\.title\}" for \$\{pendingPomodoro\.duration\} minutes\.\`;/g,
  "userText = `Schedule \"${pendingPomodoro.title}\" for ${pendingPomodoro.duration} minutes. NOTE TO AI: The start time is exactly ${scheduledTime.toISOString()} and the end time is exactly ${new Date(scheduledTime.getTime() + pendingPomodoro.duration * 60000).toISOString()}. Use these exact times for the Google Calendar link.`;"
);

// We didn't even override `userText` in the generic scheduled intent. Let's do that.
code = code.replace(
  /\/\/ Let it fall through to generate Gcal link!/g,
  "// Let it fall through to generate Gcal link!\n        userText = `${userText}. NOTE TO AI: The start time is exactly ${scheduledTime.toISOString()} and the end time is exactly ${new Date(scheduledTime.getTime() + duration * 60000).toISOString()}. Use these exact times to generate the correct Google Calendar link.`;"
);

fs.writeFileSync('app/dashboard/chat/page.tsx', code);
