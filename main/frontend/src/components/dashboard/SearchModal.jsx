import { useEffect, useMemo, useState } from "react";

export default function SearchModal({ open, onClose, data }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      window.addEventListener('keydown', onKey);
      // Focus the input when modal opens
      setTimeout(() => {
        const input = document.querySelector('#search-input');
        if (input) input.focus();
      }, 100);
      console.log('SearchModal opened with data:', data);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, data]);

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
    <div className="fixed inset-0 z-70 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-content relative w-full max-w-4xl p-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
            🔍
          </div>
          <h2 className="heading-2">Search</h2>
        </div>
        
        <input
          id="search-input"
          autoFocus
          className="modern-input w-full text-lg"
          placeholder="Search tasks, drafts, events, research... (Press Esc to close)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {results && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultGroup 
              title="Tasks" 
              icon="📋"
              color="blue"
              items={results.tasks} 
              render={t => (
                <div>
                  <div className="font-semibold text-gray-800">{t.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.status === 'todo' ? 'bg-gray-100 text-gray-700' :
                      t.status === 'inprogress' ? 'bg-blue-100 text-blue-700' :
                      t.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {t.status}
                    </span>
                    {t.assignee && <span className="ml-2">• {t.assignee}</span>}
                  </div>
                </div>
              )} 
            />
            <ResultGroup 
              title="Drafts" 
              icon="📝"
              color="purple"
              items={results.drafts} 
              render={d => (
                <div>
                  <div className="font-semibold text-gray-800">{d.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      d.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      d.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                      d.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {d.status}
                    </span>
                    <span className="ml-2">• Version {d.versions.length}</span>
                  </div>
                </div>
              )} 
            />
            <ResultGroup 
              title="Calendar" 
              icon="📅"
              color="orange"
              items={results.events} 
              render={ev => (
                <div>
                  <div className="font-semibold text-gray-800">{ev.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      {ev.type}
                    </span>
                    <span className="ml-2">• {new Date(ev.date).toLocaleDateString()}</span>
                  </div>
                </div>
              )} 
            />
            <ResultGroup 
              title="Research" 
              icon="🔍"
              color="green"
              items={results.resources} 
              render={r => (
                <div>
                  <div className="font-semibold text-gray-800">{r.title}</div>
                  {r.url && (
                    <div className="text-sm text-blue-600 truncate mt-1">
                      {r.url}
                    </div>
                  )}
                </div>
              )} 
            />
          </div>
        )}

        {query.trim() && !results && (
          <div className="mt-8 text-center text-gray-500">
            <div className="text-lg mb-2">No results found</div>
            <div className="text-sm">Try searching for different keywords</div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}

function ResultGroup({ title, icon, color, items, render }) {
  return (
    <div className="modern-card p-6">
      <div className="flex items-center mb-4">
        <div className={`w-8 h-8 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3`}>
          {icon}
        </div>
        <h3 className="heading-3">{title}</h3>
        <span className="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {items.length}
        </span>
      </div>
      <div className="space-y-3 max-h-64 overflow-auto">
        {items.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <div className="text-sm">No matches found</div>
          </div>
        )}
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
            {render(item)}
          </div>
        ))}
      </div>
    </div>
  );
}


