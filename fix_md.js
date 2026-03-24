const fs = require('fs');
let content = fs.readFileSync('app/dashboard/chat/page.tsx', 'utf8');

content = content.replace(
  '<ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}>',
  '<ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ node: _, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}>'
);

fs.writeFileSync('app/dashboard/chat/page.tsx', content);
