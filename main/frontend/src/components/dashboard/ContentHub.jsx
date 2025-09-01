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
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
            📝
          </div>
          <h1 className="heading-2">Content Hub</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="modern-card p-8">
          <h2 className="heading-3 mb-6">New Draft</h2>
          <div className="space-y-4">
            <input className="modern-input w-full" placeholder="Enter draft title..." value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="modern-input w-full" placeholder="Write your content here..." rows={8} value={content} onChange={e => setContent(e.target.value)} />
            <button className="btn-primary w-full" onClick={createDraft}>Upload Draft</button>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="modern-card p-8">
            <h2 className="heading-3 mb-6">Approval Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { id: 'draft', label: 'Draft', color: 'bg-gray-500' },
                { id: 'review', label: 'Review', color: 'bg-yellow-500' },
                { id: 'approved', label: 'Approved', color: 'bg-green-500' },
                { id: 'published', label: 'Published', color: 'bg-blue-500' },
              ].map(stage => (
                <div key={stage.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className={`w-3 h-3 rounded-full mr-3 ${stage.color}`}></div>
                    <h3 className="font-semibold text-gray-800">{stage.label}</h3>
                    <span className="ml-auto bg-white text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                      {drafts.filter(d => d.status === stage.id).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {drafts.filter(d => d.status === stage.id).map(d => (
                      <div key={d.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="font-semibold text-gray-800 mb-2">{d.title}</div>
                        <div className="text-sm text-gray-600 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Version {d.versions.length}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {['draft','review','approved','published'].filter(s => s !== d.status).map(s => (
                            <button key={s} className="text-xs btn-secondary px-3 py-1" onClick={() => updateStatus(d.id, s)}>
                              Move to {s}
                            </button>
                          ))}
                        </div>
                        <button className="text-xs btn-primary px-3 py-1 w-full" onClick={() => {
                          const next = prompt('Add revision notes or content:', d.versions.at(-1)?.content || '');
                          if (next != null) addVersion(d.id, next);
                        }}>
                          Add Version
                        </button>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <CommentThread 
                            targetType="draft" 
                            targetId={d.id} 
                            comments={comments} 
                            setComments={setComments}
                            onActivity={onActivity}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


