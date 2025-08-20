import { useEffect, useMemo, useState } from "react";

export default function SearchModal({ open, onClose, data }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    const match = (s) => (s || "").toLowerCase().includes(q);
    return {
      tasks: data.tasks.filter(t => match(t.title) || match(t.assignee)),
      drafts: data.drafts.filter(d => match(d.title) || match(d.versions.at(-1)?.content)),
      events: data.events.filter(ev => match(ev.title) || match(ev.date)),
      resources: data.resources.filter(r => match(r.title) || match(r.url) || match(r.notes)),
    };
  }, [data, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl p-4">
        <input
          autoFocus
          className="w-full border rounded px-3 py-2"
          placeholder="Search tasks, drafts, events, research... (Esc to close)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {results && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultGroup title="Tasks" items={results.tasks} render={t => (
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-gray-600">{t.status} {t.assignee ? `• ${t.assignee}` : ""}</div>
              </div>
            )} />
            <ResultGroup title="Drafts" items={results.drafts} render={d => (
              <div>
                <div className="font-medium">{d.title}</div>
                <div className="text-xs text-gray-600">{d.status} • v{d.versions.length}</div>
              </div>
            )} />
            <ResultGroup title="Calendar" items={results.events} render={ev => (
              <div>
                <div className="font-medium">{ev.title}</div>
                <div className="text-xs text-gray-600">{ev.date}</div>
              </div>
            )} />
            <ResultGroup title="Research" items={results.resources} render={r => (
              <div>
                <div className="font-medium">{r.title}</div>
                {r.url && <div className="text-xs text-blue-600 truncate">{r.url}</div>}
              </div>
            )} />
          </div>
        )}
      </div>
    </div>
  );
}

function ResultGroup({ title, items, render }) {
  return (
    <div className="border rounded p-3">
      <div className="font-semibold mb-2">{title} ({items.length})</div>
      <div className="space-y-2 max-h-56 overflow-auto">
        {items.length === 0 && <div className="text-sm text-gray-500">No matches</div>}
        {items.map(item => (
          <div key={item.id} className="border rounded p-2">{render(item)}</div>
        ))}
      </div>
    </div>
  );
}


