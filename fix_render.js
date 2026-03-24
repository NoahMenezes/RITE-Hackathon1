const fs = require('fs');
let code = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

const regex = /\{task\.status !== "completed" && \(\n\s*<button\n\s*onClick=\{\(\) =>\n\s*router\.push\(\n\s*`\/dashboard\/focus\?taskId=\$\{task\.id\}&title=\$\{encodeURIComponent\(\n\s*task\.title,\n\s*\)\}`,\n\s*\)\n\s*\}\n\s*className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500\/25 md:opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none ring-2 ring-transparent focus:ring-blue-400"\n\s*title="Start Focus Mode"\n\s*>\n\s*<Play className="w-4 h-4 ml-0\.5" \/>\n\s*<\/button>\n\s*\)\}/;

// Wait, let's just find "task.status !== "completed" && ("
// and replace it using string manipulation.

const searchString = `{task.status !== "completed" && (
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
                        )}`;

const replacement = `{task.status !== "completed" && (
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
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex items-center justify-center p-3 bg-red-600/80 hover:bg-red-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-red-500/25 md:opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none ring-2 ring-transparent focus:ring-red-400"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>`;

if (code.includes(searchString)) {
  code = code.replace(searchString, replacement);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find exact string. Here is what is there:");
  const idx = code.indexOf('task.status !== "completed"');
  console.log(code.substring(idx, idx + 800));
}

fs.writeFileSync('app/dashboard/page.tsx', code);
