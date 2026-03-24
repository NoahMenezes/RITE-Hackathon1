const fs = require('fs');
let code = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

code = code.replace(
  /RotateCcw,\n  Zap,\n\} from "lucide-react";/,
  'RotateCcw,\n  Zap,\n  Trash2,\n} from "lucide-react";'
);

// We need to also import deleteTask
code = code.replace(
  /generateRecurringInstances,\n\} from "\.\.\/actions\/tasks";/,
  'generateRecurringInstances,\n  deleteTask,\n} from "../actions/tasks";'
);

fs.writeFileSync('app/dashboard/page.tsx', code);
