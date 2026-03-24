const fs = require('fs');
let code = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

code = code.replace(
  'generateRecurringInstances,',
  'generateRecurringInstances,\n  deleteTask,'
);

code = code.replace(
  'import {\n  Play,',
  'import {\n  Trash2,\n  Play,'
);

fs.writeFileSync('app/dashboard/page.tsx', code);
