import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Registration from "./components/Registration";
import OnboardingWizard from "./components/OnboardingWizard";
import InteractiveGuide from "./components/InteractiveGuide";

// Pages
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ContentPage from "./pages/ContentPage";

function App() {
  // Modal states
  const [showRegistration, setShowRegistration] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <Router>
      <Navbar />

      

      {/* Page Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onShowRegistration={() => setShowRegistration(true)}
              onShowWizard={() => setShowWizard(true)}
              onShowGuide={() => setShowGuide(true)}
            />
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/content" element={<ContentPage />} />
      </Routes>

      {/* Modals */}
      {showRegistration && (
        <Registration
          onClose={() => setShowRegistration(false)}
          onContinue={() => {
            setShowRegistration(false); // close registration
            setShowWizard(true); // open onboarding wizard
          }}
        />
      )}

      {showWizard && (
        <OnboardingWizard
          onClose={() => setShowWizard(false)}
          onComplete={() => setShowWizard(false)}
        />
      )}

      {showGuide && (
        <InteractiveGuide onClose={() => setShowGuide(false)} />
      )}
    </Router>
  );
}

export default App;
