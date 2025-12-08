import { useEffect, useMemo, useState } from "react";
import KanbanBoard from "./KanbanBoard";
import ContentHub from "./ContentHub";
import PublishingCalendar from "./PublishingCalendar";
import ResearchAnalysis from "./ResearchAnalysis";
import TeamCollaboration from "./TeamCollaboration";
import ProfileSettings from "./ProfileSettings";
import Notifications from "./Notifications";
import SearchModal from "./SearchModal";
import ActivityFeed from "./ActivityFeed";
import CustomWorkflowBuilder from "./CustomWorkflowBuilder";
import FileUploads from "./FileUploads";
import EnhancedNotifications from "./EnhancedNotifications";

const STORAGE_KEY = "veltra_state_v1";

export default function MainDashboard({ context, onShowGuide }) {
  // Read logged-in user from localStorage
const loggedUser = JSON.parse(localStorage.getItem("user"));

// If no login → block the dashboard
if (!loggedUser) {
  return (
    <div className="p-10 text-center text-xl font-semibold">
      Please login first.
    </div>
  );
}

// Determine workspace title based on role
const workspaceTitle =
  loggedUser.role === "team"
    ? loggedUser.teamName || "Team Workspace"
    : "Creator Workspace";

  const [activeTab, setActiveTab] = useState("overview");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true); // Start as initialized

  // App state (mocked client-side for now)
  const [tasks, setTasks] = useState([]);
  const [drafts, setDrafts] = useState([]); // {id,title,versions:[{content,ts}],status}
  const [events, setEvents] = useState([]); // {id,title,date}
  const [resources, setResources] = useState([]); // {id,title,url,notes}
  const [team, setTeam] = useState(context?.team || { name: "My Team", members: [] });
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState([]); // list of comments across entities
  const [activity, setActivity] = useState([]); // activity feed events
  const [workflows, setWorkflows] = useState([]);
  const [files, setFiles] = useState([]);

  // Load from storage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.tasks) setTasks(parsed.tasks);
      if (parsed.drafts) setDrafts(parsed.drafts);
      if (parsed.events) setEvents(parsed.events);
      if (parsed.resources) setResources(parsed.resources);
      if (parsed.team) setTeam(parsed.team);
    } catch {}
  }, []);

  // Ensure we always start with overview tab
  useEffect(() => {
    console.log("MainDashboard mounted, setting activeTab to overview");
    console.log("Context:", context);
    console.log("Component state:", { activeTab, isInitialized });
    
    // Clear any potential localStorage that might be causing issues
    localStorage.removeItem("veltra_active_tab");
    localStorage.removeItem("veltra_tab");
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    console.log("URL tab parameter:", tabParam);
    
    // Force overview tab regardless of any parameters
    setActiveTab("overview");
    
    console.log("MainDashboard initialization complete");
  }, []);

  // Fallback: ensure activeTab is always valid
  const validTabs = ["overview", "tasks", "content", "calendar", "research", "collab", "workflows", "files", "profile"];
  const currentTab = validTabs.includes(activeTab) ? activeTab : "overview";
  
  // Extra safeguard: if not initialized, force overview
  const displayTab = !isInitialized ? "overview" : currentTab;

  // Debug: Log activeTab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  // Persist on change
  useEffect(() => {
    const payload = { tasks, drafts, events, resources, team };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [tasks, drafts, events, resources, team]);

  // Generate enhanced notifications with priorities
  useEffect(() => {
    const now = new Date();
    const soonThreshold = 1000 * 60 * 60 * 24 * 2; // 2 days
    const dueSoon = tasks
      .filter(t => t.dueDate)
      .filter(t => ["todo", "inprogress", "review"].includes(t.status))
      .filter(t => {
        const due = new Date(t.dueDate);
        return due.getTime() - now.getTime() < soonThreshold && due.getTime() >= now.getTime();
      })
      .map(t => ({ 
        id: `due-${t.id}`, 
        type: "reminder", 
        text: `Task "${t.title}" due soon (${new Date(t.dueDate).toLocaleDateString()})`,
        priority: due.getTime() - now.getTime() < 1000 * 60 * 60 * 24 ? 'high' : 'medium',
        ts: Date.now(),
        read: false
      }));

    const needsApproval = drafts
      .filter(d => d.status === "review")
      .map(d => ({ 
        id: `approve-${d.id}`, 
        type: "approval", 
        text: `Draft "${d.title}" awaiting approval`,
        priority: 'medium',
        ts: Date.now(),
        read: false
      }));

    const mentions = comments
      .filter(c => c.mentions && c.mentions.length > 0)
      .map(c => ({
        id: `mention-${c.id}`,
        type: "mention",
        text: `You were mentioned in a comment on ${c.targetType}`,
        priority: 'low',
        ts: Date.now(),
        read: false
      }));

    setNotifications([...dueSoon, ...needsApproval, ...mentions]);
  }, [tasks, drafts, comments]);

  const stats = useMemo(() => {
    return {
      todo: tasks.filter(t => t.status === "todo").length,
      inprogress: tasks.filter(t => t.status === "inprogress").length,
      review: tasks.filter(t => t.status === "review").length,
      done: tasks.filter(t => t.status === "done").length,
      upcoming: events.filter(e => new Date(e.date) >= new Date()).length,
    };
  }, [tasks, events]);

  // Global shortcut: Ctrl/Cmd+K to open search
  useEffect(() => {
    function onKeyDown(e) {
      const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (isCmdK) {
        e.preventDefault();
        console.log('Search shortcut triggered');
        setIsSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function addActivity(event) {
    const item = { id: crypto.randomUUID(), ts: Date.now(), actor: 'you', ...event };
    setActivity(prev => [item, ...prev].slice(0, 1000));
  }

  return (
    <div className="flex-1 relative dashboard-content main-content">
      <header className="modern-header px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="heading-2 mb-2">{workspaceTitle}</h1>

          <p className="text-gray-600 text-lg">Welcome back{context?.user?.name ? `, ${context.user.name}` : ""}.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "overview" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "tasks" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "content" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("content")}
          >
            Content
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "calendar" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "research" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("research")}
          >
            Research
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "collab" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("collab")}
          >
            Collaboration
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "workflows" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("workflows")}
          >
            Workflows
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "files" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("files")}
          >
            Files
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "profile" 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 transform scale-105" 
                : "btn-secondary"
            }`} 
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button className="btn-secondary" onClick={() => setIsSearchOpen(true)}>Search (Ctrl+K)</button>
          <button className="btn-primary" onClick={onShowGuide}>Show Guide</button>
        </div>
      </header>

      {/* Active Tab Indicator */}
      <div className="px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="text-sm font-semibold text-blue-800">
              Current tab: <span className="font-bold text-blue-900">{displayTab}</span>
            </div>
          </div>
          <div className="text-xs text-blue-600 bg-blue-100 px-4 py-2 rounded-full font-medium">
            Component: MainDashboard • Active: {activeTab} • Display: {displayTab} • Init: {isInitialized ? '✓' : '⏳'}
          </div>
        </div>
      </div>

      <div className="relative z-0 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dashboard-section">
        {displayTab === "overview" && (
            <main className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <div className="modern-card p-8 lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                    📋
                  </div>
                  <h2 className="heading-3">Tasks</h2>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
                      <div className="text-sm text-blue-700">To-Do</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{stats.inprogress}</div>
                      <div className="text-sm text-yellow-700">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{stats.review}</div>
                      <div className="text-sm text-orange-700">Review</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.done}</div>
                      <div className="text-sm text-green-700">Done</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="btn-primary" onClick={() => setActiveTab("tasks")}>
                    Open Tasks
                  </button>
                  <button className="btn-secondary" onClick={() => {
                    const task = sampleTask();
                    setTasks(prev => [...prev, task]);
                    addActivity({ action: 'task:create', target: { type: 'task', id: task.id, title: task.title } });
                  }}>
                    Create Task
                  </button>
                </div>
              </div>
              
              <div className="modern-card p-8 lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                    📅
                  </div>
                  <h2 className="heading-3">Content Calendar</h2>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-purple-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stats.upcoming}</div>
                    <div className="text-purple-700 font-medium">Upcoming Events</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="btn-primary" onClick={() => setActiveTab("calendar")}>
                    Open Calendar
                  </button>
                  <button className="btn-secondary" onClick={() => {
                    const ev = sampleEvent();
                    setEvents(prev => [...prev, ev]);
                    addActivity({ action: 'calendar:add', target: { type: 'event', id: ev.id, title: ev.title }, metadata: { date: ev.date } });
                  }}>
                    Schedule Post
                  </button>
                </div>
              </div>
              
              <div className="modern-card p-8 lg:col-span-3">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                    🔔
                  </div>
                  <h2 className="heading-3">Enhanced Notifications</h2>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <EnhancedNotifications notifications={notifications} onActivity={addActivity} />
                </div>
              </div>
              
              <div className="modern-card p-8 lg:col-span-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
                    ⚡
                  </div>
                  <h2 className="heading-3">Quick Actions</h2>
                </div>
                <div className="flex flex-col gap-4">
                  <button className="w-full btn-primary" onClick={() => setActiveTab("tasks")}>
                    Assign Work
                  </button>
                  <button className="w-full btn-secondary" onClick={() => setActiveTab("content")}>
                    Upload Draft
                  </button>
                  <button className="w-full btn-secondary" onClick={() => setActiveTab("calendar")}>
                    Schedule Post
                  </button>
                </div>
              </div>
            </main>
          )}

          {displayTab === "tasks" && (
            <KanbanBoard tasks={tasks} setTasks={setTasks} team={team} comments={comments} setComments={setComments} onActivity={addActivity} />
          )}

          {displayTab === "content" && (
            <ContentHub drafts={drafts} setDrafts={setDrafts} comments={comments} setComments={setComments} onActivity={addActivity} />
          )}

          {displayTab === "calendar" && (
            <PublishingCalendar events={events} setEvents={setEvents} onActivity={addActivity} />
          )}

          {displayTab === "research" && (
            <ResearchAnalysis resources={resources} setResources={setResources} onActivity={addActivity} />
          )}

          {displayTab === "collab" && (
            <>
              <TeamCollaboration team={team} activity={activity} />
            </>
          )}

          {displayTab === "workflows" && (
            <CustomWorkflowBuilder workflows={workflows} setWorkflows={setWorkflows} onActivity={addActivity} />
          )}

          {displayTab === "files" && (
            <FileUploads attachments={files} setAttachments={setFiles} onActivity={addActivity} />
          )}

          {displayTab === "profile" && (
            <ProfileSettings context={context} team={team} setTeam={setTeam} />
          )}

          {isSearchOpen && (
            <SearchModal
              open={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              data={{ tasks, drafts, events, resources }}
            />
          )}
        </div>

      {/* Note: Guide functionality is handled by the parent App component */}
    </div>
  );
}

function sampleTask() {
  return {
    id: crypto.randomUUID(),
    title: "New Task",
    status: "todo",
    assignee: null,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    dependencies: [],
  };
}

function sampleEvent() {
  const date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  return {
    id: crypto.randomUUID(),
    title: "Scheduled Post",
    date: date.toISOString().slice(0, 10),
  };
}


