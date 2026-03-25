const fs = require('fs');
const path = './app/api/chat/route.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/(https?:\/\/[^s]+)/g, '(https?:\\/\\/[^\\s]+)');
content = content.replace(/replace\(\/s\+\/g/g, 'replace(/\\s+/g');
content = content.replace(/<scrip\[\^<\]\*\(\?:\(\?!<\\/script>\)<\[\^<\]\*\)\*<\\/script>/g, '<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>');
content = content.replace(/<styl\[\^<\]\*\(\?:\(\?!<\\/style>\)<\[\^<\]\*\)\*<\\/style>/g, '<style\\b[^<]*(?:(?!<\\/style>)<[^<]*)*<\\/style>');

fs.writeFileSync(path, content, 'utf8');
