import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Registration from "./components/Registration";
import OnboardingWizard from "./components/OnboardingWizard";
import InteractiveGuide from "./components/InteractiveGuide";

import HomePage from "./pages/HomePage";
import IndividualDashboard from "./components/IndividualDashboard";
import TeamDashboard from "./components/TeamDashboard";

function App() {
  // Modal states
  const [showRegistration, setShowRegistration] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Store workspace data
  const [workspaceData, setWorkspaceData] = useState(null);

  const handleRegistrationContinue = () => {
    setShowRegistration(false);
    setShowWizard(true);
  };

  const handleWizardComplete = (data) => {
    setWorkspaceData(data);  // Save the workspace info
    setShowWizard(false);
  };

  const handleShowGuide = () => setShowGuide(true);

  return (
    <Router>
      <Navbar />

      {/* Conditionally render dashboard if workspace exists */}
      {workspaceData ? (
        workspaceData.type === "individual" ? (
          <IndividualDashboard
            onShowGuide={handleShowGuide}
          />
        ) : (
          <TeamDashboard
            team={workspaceData.team}
            onShowGuide={handleShowGuide}
          />
        )
      ) : (
        // Otherwise show HomePage
        <HomePage
          onShowRegistration={() => setShowRegistration(true)}
        />
      )}

      {/* Modals */}
      {showRegistration && (
        <Registration
          onClose={() => setShowRegistration(false)}
          onContinue={handleRegistrationContinue}
        />
      )}
      {showWizard && (
        <OnboardingWizard
          onClose={() => setShowWizard(false)}
          onComplete={handleWizardComplete}
        />
      )}
      {showGuide && (
        <InteractiveGuide
          contextType={workspaceData?.type === "team" ? "team" : "individual"}
          onClose={() => setShowGuide(false)}
        />
      )}
    </Router>
  );
}

export default App;
