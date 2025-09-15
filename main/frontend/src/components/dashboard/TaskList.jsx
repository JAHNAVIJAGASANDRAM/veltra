import React, { useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Write script for Episode 12", completed: false },
    { id: 2, text: "Review graphics for Instagram post", completed: true },
    { id: 3, text: "Send email to sponsors", completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <span
              className={`cursor-pointer ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
              onClick={() => toggleTask(task.id)}
            >
              {task.text}
            </span>
            <button
              onClick={() =>
                setTasks(tasks.filter((t) => t.id !== task.id))
              }
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TaskList;
