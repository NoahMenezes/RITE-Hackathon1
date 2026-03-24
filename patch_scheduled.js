const fs = require('fs');
let code = fs.readFileSync('app/dashboard/chat/page.tsx', 'utf8');

// 1. Remove the local setMessages and return for Pomodoro Yes
code = code.replace(
  /setMessages\(\(prev\) => \[\n\s*\.\.\.prev,\n\s*\{\n\s*id: \(Date\.now\(\) \+ 1\)\.toString\(\),\n\s*role: "bot",\n\s*text: `🍅 \*\*Pomodoro Session Scheduled!\*\*[\s\S]*?`,\n\s*\},\n\s*\]\);\n\s*setNotifications/g,
  'setNotifications'
);
code = code.replace(
  /toast\.success\("Pomodoro session scheduled!"\);\n\s*setTimeout\(\(\) => setNotifications\(\[\]\), 5000\);\n\s*setPendingPomodoro\(null\);\n\s*setIsTyping\(false\);\n\s*return;/g,
  'toast.success("Pomodoro session scheduled!");\n        setTimeout(() => setNotifications([]), 5000);\n        setPendingPomodoro(null);'
);

// 2. Remove the local setMessages and return for Pomodoro No
code = code.replace(
  /setMessages\(\(prev\) => \[\n\s*\.\.\.prev,\n\s*\{\n\s*id: \(Date\.now\(\) \+ 1\)\.toString\(\),\n\s*role: "bot",\n\s*text: `📅 \*\*Task Scheduled!\*\*[\s\S]*?`,\n\s*\},\n\s*\]\);\n\s*setNotifications/g,
  'setNotifications'
);
code = code.replace(
  /toast\.success\("Task scheduled!"\);\n\s*setTimeout\(\(\) => setNotifications\(\[\]\), 5000\);\n\s*setPendingPomodoro\(null\);\n\s*setIsTyping\(false\);\n\s*return;/g,
  'toast.success("Task scheduled!");\n        setTimeout(() => setNotifications([]), 5000);\n        setPendingPomodoro(null);'
);

fs.writeFileSync('app/dashboard/chat/page.tsx', code);
