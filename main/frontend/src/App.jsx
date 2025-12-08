import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import MainDashboard from "./components/dashboard/MainDashboard";
import Registration from "./components/Registration";
import OnboardingWizard from "./components/OnboardingWizard";
import InteractiveGuide from "./components/InteractiveGuide";

function App() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [workspaceData, setWorkspaceData] = useState(null);

  const navigate = useNavigate();

  // ✔ Load workspace from localStorage (for refresh)
  useEffect(() => {
    const saved = localStorage.getItem("veltra_workspace");
    if (saved) {
      setWorkspaceData(JSON.parse(saved));
    }
  }, []);

  // ✔ Store workspace for persistence
  useEffect(() => {
    if (workspaceData) {
      localStorage.setItem("veltra_workspace", JSON.stringify(workspaceData));
    }
  }, [workspaceData]);

  // ✔ After Registration → open Wizard
  const handleRegistrationContinue = () => {
    setShowRegistration(false);
    setShowWizard(true);
  };

  // ✔ After Wizard → save data → go to dashboard
  const handleWizardComplete = (data) => {
    setWorkspaceData(data);
    setShowWizard(false);
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage onShowRegistration={() => setShowRegistration(true)} />}
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            workspaceData ? (
              <MainDashboard
                context={workspaceData}
                onShowGuide={() => setShowGuide(true)}
              />
            ) : (
              <div className="p-10 text-center text-xl">
                Please login or complete onboarding
              </div>
            )
          }
        />
      </Routes>

      {/* ---------------- MODALS ---------------- */}

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

      {showGuide && workspaceData && (
        <InteractiveGuide
          contextType={workspaceData.type}
          onClose={() => setShowGuide(false)}
        />
      )}
    </>
  );
}

export default App;
