export default function TeamDashboard({ onShowGuide, team }) {
  return (
    <div className="flex-1 dashboard-content main-content">
      <header className="modern-header px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="heading-2 mb-2">{team?.name || "Team Workspace"}</h1>
          <p className="text-gray-600 text-lg">Invite teammates and assign roles to get started.</p>
        </div>
        <button className="btn-primary" onClick={onShowGuide}>Show Guide</button>
      </header>
      <main className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="modern-card p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
              📋
            </div>
            <h2 className="heading-3">Task Board (Kanban)</h2>
          </div>
          <p className="text-gray-600 mb-6">Create tasks and move them across stages.</p>
          <button className="btn-primary">Open Task Board</button>
        </div>
        
        <div className="modern-card p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
              🔍
            </div>
            <h2 className="heading-3">Research Hub</h2>
          </div>
          <p className="text-gray-600 mb-6">Collect briefs, references, and insights.</p>
          <button className="btn-primary">Open Research Hub</button>
        </div>
        
        <div className="modern-card p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
              ✍️
            </div>
            <h2 className="heading-3">Draft / Approval Pipeline</h2>
          </div>
          <p className="text-gray-600 mb-6">Move drafts through review and approval.</p>
          <button className="btn-primary">Open Pipeline</button>
        </div>
        
        <div className="modern-card p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
              📅
            </div>
            <h2 className="heading-3">Publishing Calendar</h2>
          </div>
          <p className="text-gray-600 mb-6">Schedule posts and track deadlines.</p>
          <button className="btn-primary">Open Calendar</button>
        </div>
        
        <div className="lg:col-span-2 flex gap-6 justify-center mt-8">
          <button id="guide-invite" className="btn-primary px-8 py-4 text-lg">Invite your first teammate</button>
          <button id="guide-first-task" className="btn-secondary px-8 py-4 text-lg">Create your first task</button>
        </div>
      </main>
    </div>
  );
}


