import { useState } from "react";

export default function ResearchAnalysis({ resources, setResources, onActivity }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  function addResource() {
    if (!title.trim()) return;
    const r = { id: crypto.randomUUID(), title: title.trim(), url, notes };
    setResources(prev => [...prev, r]);
    onActivity?.({ action: 'research:add', target: { type: 'resource', id: r.id, title: r.title } });
    setTitle("");
    setUrl("");
    setNotes("");
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Add Resource</h2>
        <input className="border rounded px-3 py-2 mb-2 w-full" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="border rounded px-3 py-2 mb-2 w-full" placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
        <textarea className="border rounded px-3 py-2 mb-2 w-full" rows={4} placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 py-2 rounded w-full" onClick={addResource}>Save</button>
      </section>
      <section className="bg-white rounded shadow p-4 lg:col-span-2">
        <h2 className="font-semibold mb-2">Research Hub</h2>
        <div className="space-y-3">
          {resources.map(r => (
            <div key={r.id} className="border rounded p-3">
              <div className="font-medium">{r.title}</div>
              {r.url && <a className="text-sm text-blue-600 underline" href={r.url} target="_blank" rel="noreferrer">{r.url}</a>}
              {r.notes && <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.notes}</div>}
            </div>
          ))}
          {resources.length === 0 && <div className="text-gray-500 text-sm">No resources yet.</div>}
        </div>
      </section>
    </main>
  );
}


