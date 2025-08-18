export default function IndividualDashboard({ onShowGuide }) {
  return (
    <div className="flex-1">
      <header className="px-6 py-4 border-b bg-white flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Creator Dashboard</h1>
        <button className="text-sm bg-blue-600 text-white px-3 py-2 rounded" onClick={onShowGuide}>Show Guide</button>
      </header>
      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded shadow p-4 lg:col-span-2">
          <h2 className="font-semibold mb-2">Content Calendar</h2>
          <div className="text-gray-500 text-sm">No content scheduled yet. Click "Add Idea" to start.</div>
        </section>
        <section className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Task Tracker</h2>
          <div className="text-gray-500 text-sm">No tasks yet. Create your first task.</div>
        </section>
        <section className="bg-white rounded shadow p-4 lg:col-span-3">
          <h2 className="font-semibold mb-2">Draft Box</h2>
          <div className="text-gray-500 text-sm">Store ideas and drafts here.</div>
        </section>
        <div className="lg:col-span-3 flex gap-3">
          <button id="guide-add-idea" className="bg-blue-600 text-white px-4 py-2 rounded">Add your first content idea</button>
          <button className="border px-4 py-2 rounded">Create a task</button>
        </div>
      </main>
    </div>
  );
}


