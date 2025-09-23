import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import Registration from "./components/Registration";
import OnboardingWizard from "./components/OnboardingWizard";
import InteractiveGuide from "./components/InteractiveGuide";

// Pages
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ContentPage from "./pages/ContentPage";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  const [showRegistration, setShowRegistration] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
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
            setShowRegistration(false);
            setShowWizard(true);
          }}
        />
      )}

      {showWizard && (
        <OnboardingWizard
          onClose={() => setShowWizard(false)}
          onComplete={() => {
            setShowWizard(false);
            navigate("/dashboard"); // <--- Go to dashboard after completion
          }}
        />
      )}

      {showGuide && <InteractiveGuide onClose={() => setShowGuide(false)} />}
    </>
  );
}

export default AppWrapper;
