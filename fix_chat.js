const fs = require('fs');
let content = fs.readFileSync('app/dashboard/chat/page.tsx', 'utf8');

// We want to replace the `userText` variable assignment at the top of handleSend
content = content.replace(
  'const userText = fileContent || inputValue;',
  'let userText = fileContent || inputValue;'
);

// 1. Pomodoro Yes success block
content = content.replace(
  /const scheduledTime = new Date\(result\.scheduledFor!\);\n\s*setMessages\(\(prev\) => \[\n\s*\.\.\.prev,\n\s*\{\n\s*id: \(Date\.now\(\) \+ 1\)\.toString\(\),\n\s*role: "bot",\n\s*text: `🍅 \*\*Pomodoro Session Scheduled!\*\*[\s\S]*?`,\n\s*\},\n\s*\]\);\n\s*setNotifications\(\[\n\s*\{\n\s*name: "Pomodoro Session Scheduled",\n\s*description: `25 min at \$\{scheduledTime\.toLocaleTimeString\(\[\], \{ hour: "2-digit", minute: "2-digit" \}\)\}`,\n\s*icon: "🍅",\n\s*color: "#ef4444",\n\s*time: "Just now",\n\s*\},\n\s*\]\);\n\s*toast\.success\("Pomodoro session scheduled!"\);\n\s*setTimeout\(\(\) => setNotifications\(\[\]\), 5000\);\n\s*setPendingPomodoro\(null\);\n\s*setIsTyping\(false\);\n\s*return;/g,
  `const scheduledTime = new Date(result.scheduledFor!);
        setNotifications([{ name: "Pomodoro Session Scheduled", description: \`25 min at \${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}\`, icon: "🍅", color: "#ef4444", time: "Just now" }]);
        toast.success("Pomodoro session scheduled!");
        setTimeout(() => setNotifications([]), 5000);
        userText = \`Schedule "\${pendingPomodoro.title}" for 25 minutes (Pomodoro).\`;
        setPendingPomodoro(null);
        // Let it fall through to LLM!`
);

// 2. Pomodoro No success block
content = content.replace(
  /const scheduledTime = new Date\(result\.scheduledFor!\);\n\s*setMessages\(\(prev\) => \[\n\s*\.\.\.prev,\n\s*\{\n\s*id: \(Date\.now\(\) \+ 1\)\.toString\(\),\n\s*role: "bot",\n\s*text: `📅 \*\*Task Scheduled!\*\*[\s\S]*?`,\n\s*\},\n\s*\]\);\n\s*setNotifications\(\[\n\s*\{\n\s*name: "Task Scheduled",\n\s*description: `\$\{pendingPomodoro\.duration\} min at \$\{scheduledTime\.toLocaleTimeString\(\[\], \{ hour: "2-digit", minute: "2-digit" \}\)\}`,\n\s*icon: "📅",\n\s*color: "#10b981",\n\s*time: "Just now",\n\s*\},\n\s*\]\);\n\s*toast\.success\("Task scheduled!"\);\n\s*setTimeout\(\(\) => setNotifications\(\[\]\), 5000\);\n\s*setPendingPomodoro\(null\);\n\s*setIsTyping\(false\);\n\s*return;/g,
  `const scheduledTime = new Date(result.scheduledFor!);
        setNotifications([{ name: "Task Scheduled", description: \`\${pendingPomodoro.duration} min at \${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}\`, icon: "📅", color: "#10b981", time: "Just now" }]);
        toast.success("Task scheduled!");
        setTimeout(() => setNotifications([]), 5000);
        userText = \`Schedule "\${pendingPomodoro.title}" for \${pendingPomodoro.duration} minutes.\`;
        setPendingPomodoro(null);
        // Let it fall through to LLM!`
);

// 3. Normal scheduled intent success block
content = content.replace(
  /const scheduledTime = new Date\(result\.scheduledFor!\);\n\s*setMessages\(\(prev\) => \[\n\s*\.\.\.prev,\n\s*\{\n\s*id: \(Date\.now\(\) \+ 1\)\.toString\(\),\n\s*role: "bot",\n\s*text: `📅 \*\*Task Scheduled!\*\*[\s\S]*?`,\n\s*\},\n\s*\]\);\n\s*setIsTyping\(false\);\n\s*setNotifications\(\[\n\s*\{\n\s*name: "Task Scheduled Successfully",\n\s*description: `Scheduled for \$\{scheduledTime\.toLocaleTimeString\(\[\], \{ hour: "2-digit", minute: "2-digit" \}\)\}`,\n\s*icon: "📅",\n\s*color: "#10b981",\n\s*time: "Just now",\n\s*\},\n\s*\]\);\n\s*toast\.success\("Task scheduled and added to Daily Plan!"\);\n\s*setTimeout\(\(\) => setNotifications\(\[\]\), 5000\);\n\s*return;/g,
  `const scheduledTime = new Date(result.scheduledFor!);
        setNotifications([{ name: "Task Scheduled Successfully", description: \`Scheduled for \${scheduledTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}\`, icon: "📅", color: "#10b981", time: "Just now" }]);
        toast.success("Task scheduled and added to Daily Plan!");
        setTimeout(() => setNotifications([]), 5000);
        // Let it fall through to LLM!`
);

fs.writeFileSync('app/dashboard/chat/page.tsx', content);
