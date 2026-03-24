const fs = require('fs');
let lines = fs.readFileSync('app/dashboard/chat/page.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('text: `📅 **Task Scheduled!**\n\nI\\'ve scheduled a ${duration}')) {
    for (let j = i - 5; j <= i + 2; j++) lines[j] = '';
  }
}

fs.writeFileSync('app/dashboard/chat/page.tsx', lines.join('\n'));
