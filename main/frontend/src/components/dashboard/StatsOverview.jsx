import React from "react";

function StatsOverview() {
  const stats = [
    { label: "Active Projects", value: 8 },
    { label: "Tasks Completed", value: 124 },
    { label: "Pending Approvals", value: 5 },
    { label: "Team Members", value: 12 },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {stats.map((s, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-gray-600">{s.label}</h3>
          <p className="text-2xl font-bold">{s.value}</p>
        </div>
      ))}
    </section>
  );
}

export default StatsOverview;
