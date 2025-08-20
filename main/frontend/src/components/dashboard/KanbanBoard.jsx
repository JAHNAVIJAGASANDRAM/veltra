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
    <main className="p-6">
      <div className="mb-4 flex gap-2">
        <input className="border rounded px-3 py-2 flex-1" placeholder="Task title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={createTask}>Create Task</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATUSES.map(col => (
          <div key={col.id} className="bg-white rounded shadow p-3">
            <div className="font-semibold mb-2">{col.label}</div>
            <div className="space-y-2">
              {tasksByStatus[col.id].map(task => (
                <div key={task.id} className="border rounded p-2">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{task.assignee || "Unassigned"}</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {STATUSES.filter(s => s.id !== task.status).map(s => (
                      <button key={s.id} className="text-xs border px-2 py-1 rounded"
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
                  <div className="flex gap-2 items-center mb-2">
                    <select className="text-xs border rounded px-2 py-1" value={task.assignee || ""} onChange={e => assign(task.id, e.target.value || null)}>
                      <option value="">Assign</option>
                      {team?.members?.map(m => (
                        <option key={m.email} value={m.email}>{m.email}</option>
                      ))}
                    </select>
                    <input className="text-xs border rounded px-2 py-1" type="date" value={task.dueDate ? task.dueDate.slice(0,10) : ""} onChange={e => {
                      const dateIso = e.target.value ? new Date(e.target.value).toISOString() : null;
                      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, dueDate: dateIso } : t));
                      onActivity?.({ action: 'task:due', target: { type: 'task', id: task.id, title: task.title }, metadata: { date: e.target.value || '' } });
                    }} />
                  </div>
                  <div className="flex gap-2 items-center">
                    <select className="text-xs border rounded px-2 py-1" onChange={e => setDependency(task.id, e.target.value)} defaultValue="">
                      <option value="">Add dependency</option>
                      {tasks.filter(t => t.id !== task.id).map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                    {task.dependencies && task.dependencies.length > 0 && (
                      <span className="text-xs text-gray-600">Depends on: {task.dependencies.map(id => tasks.find(t => t.id === id)?.title).filter(Boolean).join(', ')}</span>
                    )}
                  </div>
                  <CommentThread targetType="task" targetId={task.id} comments={comments} setComments={setComments} team={team} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


