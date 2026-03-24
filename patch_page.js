const fs = require('fs');
let code = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

code = code.replace(
  /generateRecurringInstances,\n\} from "..\/actions\/tasks";/,
  'generateRecurringInstances,\n  deleteTask,\n} from "../actions/tasks";'
);

code = code.replace(
  /RotateCcw,\n  Zap,\n\} from "lucide-react";/,
  'RotateCcw,\n  Zap,\n  Trash2,\n} from "lucide-react";'
);

// Add handleDeleteTask function
const handlePrioritizeTasksRegex = /const handlePrioritizeTasks = async \(\) => {/;
code = code.replace(
  handlePrioritizeTasksRegex,
  `const handleDeleteTask = async (taskId: number) => {
    if (!user) return;
    const result = await deleteTask(taskId.toString());
    if (result.success) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setAllTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success("Task deleted successfully");
    } else {
      toast.error("Failed to delete task");
    }
  };

  const handlePrioritizeTasks = async () => {`
);

// Update rendering of tasks to include delete button
const taskRenderRegex = /\{task\.status !== "completed" && \(\n\s*<button\n\s*onClick=\{\(\) =>\n\s*router\.push\(\n\s*`\/dashboard\/focus\?taskId=\$\{task\.id\}&title=\$\{encodeURIComponent\(task\.title\)\}`,\n\s*\)\n\s*\}\n\s*className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500\/25 md:opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none ring-2 ring-transparent focus:ring-blue-400"\n\s*title="Start Focus Mode"\n\s*>\n\s*<Play className="w-4 h-4 ml-0\.5" \/>\n\s*<\/button>\n\s*\)\}/;

code = code.replace(taskRenderRegex, `{task.status !== "completed" ? (
                          <button
                            onClick={() =>
                              router.push(
                                \`/dashboard/focus?taskId=\${task.id}&title=\${encodeURIComponent(task.title)}\`,
                              )
                            }
                            className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/25 md:opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none ring-2 ring-transparent focus:ring-blue-400"
                            title="Start Focus Mode"
                          >
                            <Play className="w-4 h-4 ml-0.5" />
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex items-center justify-center p-3 bg-red-600/80 hover:bg-red-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-red-500/25 md:opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none ring-2 ring-transparent focus:ring-red-400"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>`);

fs.writeFileSync('app/dashboard/page.tsx', code);
