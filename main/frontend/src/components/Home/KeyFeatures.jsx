import React from "react";

// Reusable FeatureCard component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function KeyFeatures() {
  const features = [
    {
      icon: "👥",
      title: "Team & Role Management",
      description: "Register teams, assign roles, set permissions.",
    },
    {
      icon: "⚡",
      title: "Task & Workflow Automation",
      description: "Assign work, track progress, send reminders.",
    },
    {
      icon: "📝",
      title: "Content Hub",
      description: "Store, draft, and approve content before publishing.",
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      description: "Research + performance metrics for continuous improvement.",
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
        <p className="text-gray-600 mt-4">
          Everything you need to manage content, teams, and analytics in one place.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

export default KeyFeatures;
