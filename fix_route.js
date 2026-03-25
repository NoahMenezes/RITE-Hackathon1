const fs = require('fs');
const path = './app/api/chat/route.ts';
let content = fs.readFileSync(path, 'utf8');

const target = "const { message, history, userContext, currentTasks } = await req.json();";
const replacement = `
    let { message, history, userContext, currentTasks } = await req.json();

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);
    if (urls && urls.length > 0) {
      try {
        const url = urls[0];
        const res = await fetch(url);
        if (res.ok) {
          const html = await res.text();
          const withoutScripts = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
          const withoutStyles = withoutScripts.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
          let scrapedText = withoutStyles.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          if (scrapedText.length > 5000) {
            scrapedText = scrapedText.substring(0, 5000) + "...";
          }
          message = message + "\n\n[Content scraped from " + url + "]:\n" + scrapedText;
        }
      } catch (e) {
        console.error("Failed to scrape URL:", e);
      }
    }
`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content, 'utf8');
