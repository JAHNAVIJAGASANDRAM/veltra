export default function TeamDashboard({ onShowGuide, team }) {
  return (
    <div className="flex-1">
      <header className="px-6 py-4 border-b bg-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{team?.name || "Team Workspace"}</h1>
          <p className="text-gray-500 text-sm">Invite teammates and assign roles to get started.</p>
        </div>
        <button className="text-sm bg-blue-600 text-white px-3 py-2 rounded" onClick={onShowGuide}>Show Guide</button>
      </header>
      <main className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="bg-white rounded shadow p-4 lg:col-span-2">
          <h2 className="font-semibold mb-2">Task Board (Kanban)</h2>
          <div className="text-gray-500 text-sm">Create tasks and move them across stages.</div>
        </section>
        <section className="bg-white rounded shadow p-4 lg:col-span-2">
          <h2 className="font-semibold mb-2">Research Hub</h2>
          <div className="text-gray-500 text-sm">Collect briefs, references, and insights.</div>
        </section>
        <section className="bg-white rounded shadow p-4 lg:col-span-2">
          <h2 className="font-semibold mb-2">Draft / Approval Pipeline</h2>
          <div className="text-gray-500 text-sm">Move drafts through review and approval.</div>
        </section>
        <section className="bg-white rounded shadow p-4 lg:col-span-2">
          <h2 className="font-semibold mb-2">Publishing Calendar</h2>
          <div className="text-gray-500 text-sm">Schedule posts and track deadlines.</div>
        </section>
        <div className="lg:col-span-4 flex gap-3">
          <button id="guide-invite" className="bg-blue-600 text-white px-4 py-2 rounded">Invite your first teammate</button>
          <button id="guide-first-task" className="border px-4 py-2 rounded">Create your first task</button>
        </div>
      </main>
    </div>
  );
}


