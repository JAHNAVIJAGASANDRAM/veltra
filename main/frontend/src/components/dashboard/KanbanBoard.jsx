import { useMemo, useState } from "react";
import CommentThread from "./CommentThread";

const STATUSES = [
  { id: "todo", label: "To-Do" },
  { id: "inprogress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

export default function KanbanBoard({ tasks, setTasks, team, comments, setComments, onActivity }) {
  const [newTitle, setNewTitle] = useState("");

  const tasksByStatus = useMemo(() => {
    const map = Object.fromEntries(STATUSES.map(s => [s.id, []]));
    for (const t of tasks) map[t.status]?.push(t);
    return map;
  }, [tasks]);

  function createTask() {
    if (!newTitle.trim()) return;
    const task = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      status: "todo",
      assignee: null,
      dueDate: null,
      dependencies: [],
    };
    setTasks(prev => [
      ...prev,
      task
    ]);
    onActivity?.({ action: 'task:create', target: { type: 'task', id: task.id, title: task.title } });
    setNewTitle("");
  }

  function moveTask(taskId, status) {
    let movedTask;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) { movedTask = { ...t, status }; return movedTask; }
      return t;
    }));
    if (movedTask) onActivity?.({ action: 'task:move', target: { type: 'task', id: movedTask.id, title: movedTask.title }, metadata: { to: status } });
  }

  function assign(taskId, email) {
    let updated;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) { updated = { ...t, assignee: email }; return updated; }
      return t;
    }));
    if (updated) onActivity?.({ action: 'task:assign', target: { type: 'task', id: updated.id, title: updated.title }, metadata: { assignee: email } });
  }

  function setDependency(taskId, dependsOnId) {
    if (!dependsOnId || taskId === dependsOnId) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, dependencies: Array.from(new Set([...(t.dependencies||[]), dependsOnId])) } : t));
  }

  function canStart(task) {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    return task.dependencies.every(depId => tasks.find(t => t.id === depId)?.status === 'done');
  }

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
            📋
          </div>
          <h1 className="heading-2">Task Board (Kanban)</h1>
        </div>
        <div className="modern-card p-6">
          <div className="flex gap-4">
            <input className="modern-input flex-1" placeholder="Enter task title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <button className="btn-primary" onClick={createTask}>Create Task</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATUSES.map(col => (
          <div key={col.id} className="modern-card p-6">
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                col.id === 'todo' ? 'bg-gray-400' :
                col.id === 'inprogress' ? 'bg-blue-500' :
                col.id === 'review' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}></div>
              <h3 className="heading-3">{col.label}</h3>
              <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                {tasksByStatus[col.id].length}
              </span>
            </div>
            <div className="space-y-4">
              {tasksByStatus[col.id].map(task => (
                <div key={task.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="font-semibold text-gray-800 mb-2">{task.title}</div>
                  <div className="text-sm text-gray-600 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    {task.assignee || "Unassigned"}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {STATUSES.filter(s => s.id !== task.status).map(s => (
                      <button key={s.id} className="text-xs btn-secondary px-3 py-1"
                        onClick={() => {
                          if (s.id === 'inprogress' && !canStart(task)) {
                            alert('This task has incomplete dependencies.');
                            return;
                          }
                          moveTask(task.id, s.id);
                        }}
                      >Move to {s.label}</button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center mb-3">
                    <select className="text-xs modern-input flex-1" value={task.assignee || ""} onChange={e => assign(task.id, e.target.value || null)}>
                      <option value="">Assign to...</option>
                      {team?.members?.map(m => (
                        <option key={m.email} value={m.email}>{m.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select className="text-xs modern-input flex-1" value="" onChange={e => setDependency(task.id, e.target.value || null)}>
                      <option value="">Add dependency...</option>
                      {tasks.filter(t => t.id !== task.id).map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                  {task.dependencies && task.dependencies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">Dependencies:</div>
                      <div className="flex flex-wrap gap-1">
                        {task.dependencies.map(depId => {
                          const dep = tasks.find(t => t.id === depId);
                          return dep ? (
                            <span key={depId} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {dep.title}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  <CommentThread
                    targetId={task.id}
                    targetType="task"
                    comments={comments}
                    setComments={setComments}
                    onActivity={onActivity}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


