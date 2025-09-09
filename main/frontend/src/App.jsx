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
    // Don't automatically open interactive guide to avoid overlay issues
    // setShowGuide(true);
  }

  const isHome = !context;

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Navbar />

      {isHome && (
        <>
          {/* Hero Section */}
          <section id="hero" className="hero-section">
            <div className="hero-content">
              <h1 className="heading-1 hero-heading mb-6 animate-fade-in-up">
                Your Virtual Office for Seamless Content Creation & Team Collaboration
              </h1>
              <p className="text-xl mb-8 opacity-90 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                From idea to publishing — manage tasks, track progress, and create together in one place.
              </p>
              <div className="space-x-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <button className="btn-primary text-lg px-8 py-4" onClick={() => setShowWizard(true)}>
                  Get Started
                </button>
                <button className="btn-secondary text-lg px-8 py-4" onClick={() => setShowGuide(true)}>
                  See Demo
                </button>
              </div>
            </div>
          </section>

          {/* Key Features Section */}
          <section id="features" className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="heading-2 text-center mb-16">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard
                  icon="👥"
                  title="Team & Role Management"
                  description="Register teams, assign roles, set permissions."
                />
                <FeatureCard
                  icon="⚡"
                  title="Task & Workflow Automation"
                  description="Assign work, track progress, send reminders."
                />
                <FeatureCard
                  icon="📝"
                  title="Content Hub"
                  description="Store, draft, and approve content before publishing."
                />
                <FeatureCard
                  icon="📊"
                  title="Analytics & Insights"
                  description="Research + performance metrics for continuous improvement."
                />
              </div>
            </div>
          </section>

          {/* Why Veltra Section */}
          <section id="why" className="py-20 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="heading-2 mb-8">Why Veltra</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Reduce chaos of managing content on multiple tools. Transparency in workflows. Easy for
                both single creators and teams. Hybrid dashboards for flexibility.
              </p>
            </div>
          </section>

          {/* Screenshots / Demo Preview Section */}
          <section id="screenshots" className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="heading-2 text-center mb-16"> Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="modern-card p-6">
                  <img src="https://via.placeholder.com/400x250?text=Team+Dashboard" alt="Team Dashboard" className="rounded-lg shadow-lg w-full" />
                  <h3 className="text-lg font-semibold mt-4 mb-2">Team Dashboard</h3>
                  <p className="text-gray-600">Collaborative workspace for teams</p>
                </div>
                <div className="modern-card p-6">
                  <img src="https://via.placeholder.com/400x250?text=Task+Tracker" alt="Task Tracker" className="rounded-lg shadow-lg w-full" />
                  <h3 className="text-lg font-semibold mt-4 mb-2">Task Tracker</h3>
                  <p className="text-gray-600">Kanban board for workflow management</p>
                </div>
                <div className="modern-card p-6">
                  <img src="https://via.placeholder.com/400x250?text=Content+Calendar" alt="Content Calendar" className="rounded-lg shadow-lg w-full" />
                  <h3 className="text-lg font-semibold mt-4 mb-2">Content Calendar</h3>
                  <p className="text-gray-600">Schedule and plan your content</p>
                </div>
                <div className="modern-card p-6">
                  <img src="https://via.placeholder.com/400x250?text=Publishing+Preview" alt="Publishing Preview" className="rounded-lg shadow-lg w-full" />
                  <h3 className="text-lg font-semibold mt-4 mb-2">Publishing Preview</h3>
                  <p className="text-gray-600">Preview before going live</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="heading-2 mb-8">Testimonials</h2>
              <div className="modern-card p-12">
                <p className="text-xl text-gray-700 mb-6 italic">
                  "Veltra helped us streamline content publishing for our podcast team."
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                     JD
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">John Doe</p>
                    <p className="text-gray-600">Content Manager, TechPod</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer id="contact" className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Veltra</h3>
                <p className="text-gray-300">Your Virtual Office for Seamless Content Creation</p>
              </div>
              <div className="flex justify-center space-x-8 mb-8">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
              </div>
              <div className="text-center text-gray-400">
                <p>© 2025 Veltra. All rights reserved.</p>
              </div>
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        {icon}
      </div>
      <h3 className="heading-3 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default App;
