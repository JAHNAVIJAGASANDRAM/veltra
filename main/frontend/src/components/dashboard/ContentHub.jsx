import { useState } from "react";
import CommentThread from "./CommentThread";

export default function ContentHub({ drafts, setDrafts, comments, setComments, onActivity }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function createDraft() {
    if (!title.trim()) return;
    const draft = {
      id: crypto.randomUUID(),
      title: title.trim(),
      versions: [{ content, ts: Date.now() }],
      status: "draft",
      attachments: []
    };
    setDrafts(prev => [
      ...prev,
      draft
    ]);
    onActivity?.({ action: 'draft:create', target: { type: 'draft', id: draft.id, title: draft.title } });
    setTitle("");
    setContent("");
  }

  function updateStatus(id, status) {
    let updated;
    setDrafts(prev => prev.map(d => {
      if (d.id === id) { updated = { ...d, status }; return updated; }
      return d;
    }));
    if (updated) onActivity?.({ action: 'draft:move', target: { type: 'draft', id: updated.id, title: updated.title }, metadata: { to: status } });
  }

  function addVersion(id, text) {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, versions: [...d.versions, { content: text, ts: Date.now() }] } : d));
    const d = drafts.find(x => x.id === id);
    if (d) onActivity?.({ action: 'draft:version', target: { type: 'draft', id: d.id, title: d.title } });
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="bg-white rounded shadow p-4 lg:col-span-1">
        <h2 className="font-semibold mb-2">New Draft</h2>
        <input className="border rounded px-3 py-2 mb-2 w-full" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="border rounded px-3 py-2 mb-2 w-full" placeholder="Content" rows={6} value={content} onChange={e => setContent(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 py-2 rounded w-full" onClick={createDraft}>Upload Draft</button>
      </section>
      <section className="bg-white rounded shadow p-4 lg:col-span-2">
        <h2 className="font-semibold mb-2">Approval Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { id: 'draft', label: 'Draft' },
            { id: 'review', label: 'Review' },
            { id: 'approved', label: 'Approved' },
            { id: 'published', label: 'Published' },
          ].map(stage => (
            <div key={stage.id} className="border rounded p-3">
              <div className="font-semibold mb-2">{stage.label}</div>
              <div className="space-y-2">
                {drafts.filter(d => d.status === stage.id).map(d => (
                  <div key={d.id} className="border rounded p-2">
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-gray-600 mb-2">v{d.versions.length}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['draft','review','approved','published'].filter(s => s !== d.status).map(s => (
                        <button key={s} className="text-xs border px-2 py-1 rounded" onClick={() => updateStatus(d.id, s)}>Move to {s}</button>
                      ))}
                    </div>
                    <button className="text-xs border px-2 py-1 rounded" onClick={() => {
                      const next = prompt('Add revision notes or content:', d.versions.at(-1)?.content || '');
                      if (next != null) addVersion(d.id, next);
                    }}>Add Version</button>
                    <CommentThread targetType="draft" targetId={d.id} comments={comments} setComments={setComments} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


