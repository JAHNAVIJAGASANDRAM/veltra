function KeyFeatures() {
  const features = [
    {
      icon: "👥",
      title: "Team & Role Management",
      desc: "Register teams, assign roles, set permissions.",
    },
    {
      icon: "⚡",
      title: "Task & Workflow Automation",
      desc: "Assign work, track progress, send reminders.",
    },
    {
      icon: "📝",
      title: "Content Hub",
      desc: "Store, draft, and approve content before publishing.",
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      desc: "Research + performance metrics for continuous improvement.",
    },
  ];

  return (
    <section id="features" className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KeyFeatures;
