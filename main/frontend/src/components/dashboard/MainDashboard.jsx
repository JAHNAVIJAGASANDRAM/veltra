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
  const [activeTab, setActiveTab] = useState("overview");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    <div className="flex-1">
      <header className="px-6 py-4 border-b bg-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{context?.type === "team" ? (team?.name || "Team Workspace") : "Creator Workspace"}</h1>
          <p className="text-gray-500 text-sm">Welcome back{context?.user?.name ? `, ${context.user.name}` : ""}.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("overview")}>Overview</button>
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("tasks")}>Tasks</button>
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("content")}>Content</button>
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("calendar")}>Calendar</button>
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("research")}>Research</button>
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("collab")}>Collaboration</button>
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("workflows")}>Workflows</button>
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("files")}>Files</button>
          <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("profile")}>Profile</button>
          <button className="border px-3 py-2 rounded" onClick={() => setIsSearchOpen(true)}>Search (Ctrl+K)</button>
          <button className="text-sm bg-blue-600 text-white px-3 py-2 rounded" onClick={onShowGuide}>Show Guide</button>
        </div>
      </header>

      {activeTab === "overview" && (
        <main className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <section className="bg-white rounded shadow p-4 lg:col-span-2">
            <h2 className="font-semibold mb-2">Tasks</h2>
            <div className="text-sm text-gray-700">To-Do: {stats.todo} • In Progress: {stats.inprogress} • Review: {stats.review} • Done: {stats.done}</div>
            <div className="mt-3 flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => setActiveTab("tasks")}>Open Tasks</button>
              <button className="border px-3 py-2 rounded" onClick={() => {
                const task = sampleTask();
                setTasks(prev => [...prev, task]);
                addActivity({ action: 'task:create', target: { type: 'task', id: task.id, title: task.title } });
              }}>Create Task</button>
            </div>
          </section>
          <section className="bg-white rounded shadow p-4 lg:col-span-2">
            <h2 className="font-semibold mb-2">Content Calendar</h2>
            <div className="text-sm text-gray-700">Upcoming: {stats.upcoming}</div>
            <div className="mt-3 flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => setActiveTab("calendar")}>Open Calendar</button>
              <button className="border px-3 py-2 rounded" onClick={() => {
                const ev = sampleEvent();
                setEvents(prev => [...prev, ev]);
                addActivity({ action: 'calendar:add', target: { type: 'event', id: ev.id, title: ev.title }, metadata: { date: ev.date } });
              }}>Schedule Post</button>
            </div>
          </section>
          <section className="bg-white rounded shadow p-4 lg:col-span-3">
            <h2 className="font-semibold mb-2">Enhanced Notifications</h2>
            <EnhancedNotifications notifications={notifications} onActivity={addActivity} />
          </section>
          <section className="bg-white rounded shadow p-4 lg:col-span-1">
            <h2 className="font-semibold mb-2">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("tasks")}>Assign Work</button>
              <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("content")}>Upload Draft</button>
              <button className="border px-3 py-2 rounded" onClick={() => setActiveTab("calendar")}>Schedule Post</button>
            </div>
          </section>
        </main>
      )}

      {activeTab === "tasks" && (
        <KanbanBoard tasks={tasks} setTasks={setTasks} team={team} comments={comments} setComments={setComments} onActivity={addActivity} />
      )}

      {activeTab === "content" && (
        <ContentHub drafts={drafts} setDrafts={setDrafts} comments={comments} setComments={setComments} onActivity={addActivity} />
      )}

      {activeTab === "calendar" && (
        <PublishingCalendar events={events} setEvents={setEvents} onActivity={addActivity} />
      )}

      {activeTab === "research" && (
        <ResearchAnalysis resources={resources} setResources={setResources} onActivity={addActivity} />
      )}

      {activeTab === "collab" && (
        <>
          <TeamCollaboration team={team} activity={activity} />
        </>
      )}

      {activeTab === "workflows" && (
        <CustomWorkflowBuilder workflows={workflows} setWorkflows={setWorkflows} onActivity={addActivity} />
      )}

      {activeTab === "files" && (
        <FileUploads attachments={files} setAttachments={setFiles} onActivity={addActivity} />
      )}

      {activeTab === "profile" && (
        <ProfileSettings context={context} team={team} setTeam={setTeam} />
      )}

      {isSearchOpen && (
        <SearchModal
          open={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          data={{ tasks, drafts, events, resources }}
        />
      )}

      {/* Assuming showGuide is defined elsewhere or removed if not needed */}
      {/* {showGuide && (
        <InteractiveGuide
          contextType={context?.type || "home"}
          onClose={() => setShowGuide(false)}
        />
      )} */}
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


