const fs = require('fs');
let code = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

code = code.replace(
  'import {',
  'import { Trash2,'
); // That will match the first import, wait.

code = code.replace(
  'Play,\n  TrendingUp,',
  'Trash2,\n  Play,\n  TrendingUp,'
);

fs.writeFileSync('app/dashboard/page.tsx', code);
