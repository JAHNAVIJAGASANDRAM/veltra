import TeamDashboard from "../components/TeamDashboard";
import IndividualDashboard from "../components/IndividualDashboard";

function DashboardPage({ workspaceData, onShowGuide }) {
  if (!workspaceData) return <div className="p-6 text-center">No workspace found. Please complete onboarding.</div>;

  return workspaceData.type === "team" ? (
    <TeamDashboard team={workspaceData.team} onShowGuide={onShowGuide} />
  ) : (
    <IndividualDashboard onShowGuide={onShowGuide} />
  );
}

export default DashboardPage;
