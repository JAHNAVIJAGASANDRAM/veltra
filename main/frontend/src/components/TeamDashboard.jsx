import { useState } from "react";
import KanbanBoard from "./dashboard/KanbanBoard";
import ContentHub from "./dashboard/ContentHub";
import ResearchAnalysis from "./dashboard/ResearchAnalysis";
import PublishingCalendar from "./dashboard/PublishingCalendar";

export default function TeamDashboard({ team, onShowGuide }) {
  const [activeModule, setActiveModule] = useState(null); // 'tasks', 'research', 'draft', 'calendar'

  // Shared state for modules
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);

  const handleActivity = (event) => {
    console.log("Activity Event:", event);
  };

  const renderModule = () => {
    switch (activeModule) {
      case "tasks":
        return (
          <KanbanBoard
            tasks={tasks}
            setTasks={setTasks}
            team={team}
            comments={comments}
            setComments={setComments}
            onActivity={handleActivity}
          />
        );
      case "research":
        return (
          <ResearchAnalysis
            resources={resources}
            setResources={setResources}
            onActivity={handleActivity}
          />
        );
      case "draft":
        return (
          <ContentHub
            drafts={drafts}
            setDrafts={setDrafts}
            comments={comments}
            setComments={setComments}
            onActivity={handleActivity}
          />
        );
      case "calendar":
        return (
          <PublishingCalendar
            events={events}
            setEvents={setEvents}
            onActivity={handleActivity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 dashboard-content main-content">
      <header className="modern-header px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="heading-2 mb-2">{team?.name || "Team Workspace"}</h1>
          <p className="text-gray-600 text-lg">
            Invite teammates and assign roles to get started.
          </p>
        </div>
        <button className="btn-primary" onClick={onShowGuide}>
          Show Guide
        </button>
      </header>

      <main className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="modern-card p-8">
          <h2 className="heading-3 mb-2">Task Board</h2>
          <button
            className="btn-primary"
            onClick={() => setActiveModule("tasks")}
          >
            Open Task Board
          </button>
        </div>

        <div className="modern-card p-8">
          <h2 className="heading-3 mb-2">Research Hub</h2>
          <button
            className="btn-primary"
            onClick={() => setActiveModule("research")}
          >
            Open Research Hub
          </button>
        </div>

        <div className="modern-card p-8">
          <h2 className="heading-3 mb-2">Draft / Approval Pipeline</h2>
          <button
            className="btn-primary"
            onClick={() => setActiveModule("draft")}
          >
            Open Pipeline
          </button>
        </div>

        <div className="modern-card p-8">
          <h2 className="heading-3 mb-2">Publishing Calendar</h2>
          <button
            className="btn-primary"
            onClick={() => setActiveModule("calendar")}
          >
            Open Calendar
          </button>
        </div>
      </main>

      {/* Render the selected module */}
      <div className="p-8 max-w-7xl mx-auto">{renderModule()}</div>
    </div>
  );
}
