const fs = require('fs');
let lines = fs.readFileSync('app/dashboard/chat/page.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('text: `🍅 **Pomodoro Session Scheduled!**')) {
    // Delete setMessages
    for (let j = i - 5; j <= i + 2; j++) lines[j] = '';
  }
  if (lines[i].includes('toast.success("Pomodoro session scheduled!");')) {
    lines[i+3] = ''; // setIsTyping(false);
    lines[i+4] = '        userText = `Schedule "' + '${pendingPomodoro.title}' + '" using Pomodoro technique (25 min).`; // Let it fall through to generate Gcal link'; // return;
  }
  
  if (lines[i].includes('text: `📅 **Task Scheduled!**\n\nI\'ve scheduled a ${pendingPomodoro.duration}')) {
    for (let j = i - 5; j <= i + 2; j++) lines[j] = '';
  }
  if (lines[i].includes('toast.success("Task scheduled!");')) {
    lines[i+3] = ''; // setIsTyping(false);
    lines[i+4] = '        userText = `Schedule "' + '${pendingPomodoro.title}' + '" for ' + '${pendingPomodoro.duration}' + ' minutes.`; // Let it fall through to generate Gcal link'; // return;
  }

  if (lines[i].includes('text: `📅 **Task Scheduled!**\n\nI\'ve scheduled a ${duration}')) {
    for (let j = i - 5; j <= i + 2; j++) lines[j] = '';
  }
  if (lines[i].includes('toast.success("Task scheduled and added to Daily Plan!");')) {
    lines[i-11] = ''; // setIsTyping(false); before setNotifications
    lines[i+2] = '        // Let it fall through to generate Gcal link!'; // return;
  }
}

fs.writeFileSync('app/dashboard/chat/page.tsx', lines.join('\n'));
