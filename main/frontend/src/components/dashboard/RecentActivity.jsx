import React from "react";

function RecentActivity() {
  const activities = [
    "You assigned a task to Sarah.",
    "Content draft approved by Alex.",
    "New podcast episode scheduled.",
    "Analytics report generated.",
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {activities.map((activity, idx) => (
          <li key={idx} className="text-gray-700">
            • {activity}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RecentActivity;
