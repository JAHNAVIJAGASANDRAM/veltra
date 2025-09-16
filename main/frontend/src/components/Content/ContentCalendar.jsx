import React from "react";

function ContentCalendar() {
  const schedule = [
    { date: "2025-09-20", title: "Podcast Ep 12", status: "Scheduled" },
    { date: "2025-09-25", title: "Blog Post: Future of AI", status: "Scheduled" },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Content Calendar</h2>
      <ul className="space-y-3">
        {schedule.map((item, idx) => (
          <li key={idx} className="border p-3 rounded flex justify-between">
            <span>
              <strong>{item.title}</strong> <br />
              <small>{item.date}</small>
            </span>
            <span className="text-gray-600">{item.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ContentCalendar;
