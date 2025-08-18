import Navbar from "./Navbar";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-blue-500 text-white text-center py-16 px-6">
        <h1 className="text-4xl font-bold mb-4">
          Your Virtual Office for Seamless Content Creation & Team Collaboration
        </h1>
        <p className="text-lg mb-6">
          From idea to publishing — manage tasks, track progress, and create together in one place.
        </p>
        <div className="space-x-4">
          <button className="bg-white text-blue-500 px-6 py-2 rounded shadow hover:bg-gray-100">
            Get Started
          </button>
          <button className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800">
            See Demo
          </button>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Team & Role Management"
            description="Register teams, assign roles, set permissions."
          />
          <FeatureCard
            title="Task & Workflow Automation"
            description="Assign work, track progress, send reminders."
          />
          <FeatureCard
            title="Content Hub"
            description="Store, draft, and approve content before publishing."
          />
          <FeatureCard
            title="Analytics & Insights"
            description="Research + performance metrics for continuous improvement."
          />
        </div>
      </section>

      {/* How Veltra Works Section */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">How Veltra Works</h2>
        <div className="flex flex-col items-center space-y-4">
          <WorkflowStep step="Team Registration" />
          <WorkflowStep step="Task Assignment" />
          <WorkflowStep step="Work in Progress" />
          <WorkflowStep step="Review & Approval" />
          <WorkflowStep step="Publishing" />
        </div>
      </section>

      {/* Why Veltra Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Why Veltra</h2>
        <p className="text-center text-lg max-w-3xl mx-auto">
          Reduce chaos of managing content on multiple tools. Transparency in workflows. Easy for
          both single creators and teams. Hybrid dashboards for flexibility.
        </p>
      </section>

      {/* Screenshots / Demo Preview Section */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Screenshots / Demo Preview</h2>
        <div className="flex space-x-4 overflow-x-auto">
          <img src="/images/team-dashboard.png" alt="Team Dashboard" className="rounded shadow" />
          <img src="/images/task-tracker.png" alt="Task Tracker" className="rounded shadow" />
          <img src="/images/content-calendar.png" alt="Content Calendar" className="rounded shadow" />
          <img src="/images/publishing-preview.png" alt="Publishing Preview" className="rounded shadow" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Testimonials</h2>
        <p className="text-center text-lg max-w-3xl mx-auto">
          “Veltra helped us streamline content publishing for our podcast team.”
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>© 2025 Veltra. All rights reserved.</p>
        <div className="space-x-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Features</a>
          <a href="#" className="hover:underline">Pricing</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">FAQ</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white p-6 rounded shadow hover:shadow-lg">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function WorkflowStep({ step }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
        ✓
      </div>
      <p>{step}</p>
    </div>
  );
}

export default App;
