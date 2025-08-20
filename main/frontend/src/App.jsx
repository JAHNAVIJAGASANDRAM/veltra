import { useState } from "react";
import Navbar from "./Navbar";
import OnboardingWizard from "./components/OnboardingWizard";
import IndividualDashboard from "./components/IndividualDashboard";
import TeamDashboard from "./components/TeamDashboard";
import MainDashboard from "./components/dashboard/MainDashboard";
import InteractiveGuide from "./components/InteractiveGuide";

function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [context, setContext] = useState(null); // null | { type: 'individual'|'team', ... }
  const [showGuide, setShowGuide] = useState(false);

  function handleOnboardingComplete(result) {
    setContext(result);
    setShowWizard(false);
    // Open interactive guide on first entry
    setShowGuide(true);
  }

  const isHome = !context;

  return (
    <div id="top" className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />

      {isHome && (
        <>
          {/* Hero Section */}
          <section id="hero" className="bg-blue-500 text-white text-center py-16 px-6">
            <h1 className="text-4xl font-bold mb-4">
              Your Virtual Office for Seamless Content Creation & Team Collaboration
            </h1>
            <p className="text-lg mb-6">
              From idea to publishing — manage tasks, track progress, and create together in one place.
            </p>
            <div className="space-x-4">
              <button className="bg-white text-blue-500 px-6 py-2 rounded shadow hover:bg-gray-100" onClick={() => setShowWizard(true)}>
                Get Started
              </button>
              <button className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800" onClick={() => setShowGuide(true)}>
                See Demo
              </button>
            </div>
          </section>

          {/* Key Features Section */}
          <section id="features" className="py-16 px-6">
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

          

          {/* Why Veltra Section */}
          <section id="why" className="py-16 px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Why Veltra</h2>
            <p className="text-center text-lg max-w-3xl mx-auto">
              Reduce chaos of managing content on multiple tools. Transparency in workflows. Easy for
              both single creators and teams. Hybrid dashboards for flexibility.
            </p>
          </section>

          {/* Screenshots / Demo Preview Section */}
          <section id="screenshots" className="py-16 px-6 bg-gray-100">
            <h2 className="text-3xl font-bold text-center mb-8">Screenshots / Demo Preview</h2>
            <div className="flex space-x-4 overflow-x-auto">
              <img src="https://via.placeholder.com/400x250?text=Team+Dashboard" alt="Team Dashboard" className="rounded shadow" />
              <img src="https://via.placeholder.com/400x250?text=Task+Tracker" alt="Task Tracker" className="rounded shadow" />
              <img src="https://via.placeholder.com/400x250?text=Content+Calendar" alt="Content Calendar" className="rounded shadow" />
              <img src="https://via.placeholder.com/400x250?text=Publishing+Preview" alt="Publishing Preview" className="rounded shadow" />
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-16 px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Testimonials</h2>
            <p className="text-center text-lg max-w-3xl mx-auto">
              “Veltra helped us streamline content publishing for our podcast team.”
            </p>
          </section>

          {/* Footer */}
          <footer id="contact" className="bg-gray-800 text-white py-6 text-center">
            <p>© 2025 Veltra. All rights reserved.</p>
            <div className="space-x-4">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Features</a>
              <a href="#" className="hover:underline">Pricing</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline">FAQ</a>
            </div>
          </footer>
        </>
      )}

      {!isHome && (
        <MainDashboard context={context} onShowGuide={() => setShowGuide(true)} />
      )}

      {showWizard && (
        <OnboardingWizard onClose={() => setShowWizard(false)} onComplete={handleOnboardingComplete} />
      )}

      {showGuide && (
        <InteractiveGuide
          contextType={context?.type || "home"}
          onClose={() => setShowGuide(false)}
        />
      )}
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

 

export default App;
