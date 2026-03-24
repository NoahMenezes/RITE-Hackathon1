const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!dirPath.includes('node_modules') && !dirPath.includes('.next')) {
        walkDir(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

const sizeMap = {
  'text-9xl': 'text-5xl',
  'text-8xl': 'text-4xl',
  'text-7xl': 'text-4xl',
  'text-6xl': 'text-3xl',
  'text-5xl': 'text-3xl',
  'text-4xl': 'text-2xl',
  'text-3xl': 'text-xl',
  'text-2xl': 'text-lg',
  'text-xl': 'text-base',
  'text-lg': 'text-base',
};

walkDir('./app', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace text sizes
  for (const [large, small] of Object.entries(sizeMap)) {
    content = content.replace(new RegExp(`\b${large}\b`, 'g'), small);
  }

  // Remove uppercase and excessive tracking
  content = content.replace(/\buppercase\b/g, '');
  content = content.replace(/\btracking-widest\b/g, '');
  content = content.replace(/\btracking-tightest\b/g, '');
  content = content.replace(/\btracking-tighter\b/g, '');
  
  // Clean up multiple spaces left by replacing words
  content = content.replace(/className="([^"]+)"/g, (match, p1) => {
    return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
