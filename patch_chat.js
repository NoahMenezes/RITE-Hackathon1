const fs = require('fs');
let code = fs.readFileSync('app/dashboard/chat/page.tsx', 'utf8');

const regex = /\{task\.status !== "completed" \? \(\n\s*<button\n\s*onClick=\{\(\) =>\n\s*router\.push\(\n\s*`\/dashboard\/focus\?taskId=\$\{task\.id\}&title=\$\{encodeURIComponent\(task\.title\)\}`,\n\s*\)\n\s*\}\n\s*className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500\/25"\n\s*title="Start Focus Mode"\n\s*>\n\s*<Play className="w-4 h-4 ml-0\.5" \/>\n\s*<\/button>\n\s*\) : \(\n\s*<button\n\s*onClick=\{\(\) => handleDeleteTask\(task\.id\)\}\n\s*className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-red-500\/25"\n\s*title="Delete Task"\n\s*>\n\s*<Trash2 className="w-4 h-4" \/>\n\s*<\/button>\n\s*\)\}/;

code = code.replace(regex, `{task.status !== "completed" && (
                          <button
                            onClick={() =>
                              router.push(
                                \`/dashboard/focus?taskId=\${task.id}&title=\${encodeURIComponent(task.title)}\`,
                              )
                            }
                            className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/25 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Start Focus Mode"
                          >
                            <Play className="w-4 h-4 ml-0.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex items-center justify-center p-2 bg-red-600/80 hover:bg-red-500 text-white rounded-full transition-all active:scale-95 shadow-lg shadow-red-500/25 opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>`);

fs.writeFileSync('app/dashboard/chat/page.tsx', code);
