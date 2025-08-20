export default function PublishingCalendar({ events, setEvents, onActivity }) {
  function addEvent() {
    const title = prompt('Event title', 'Post');
    const date = prompt('YYYY-MM-DD', new Date().toISOString().slice(0,10));
    if (!title || !date) return;
    const ev = { id: crypto.randomUUID(), title, date };
    setEvents(prev => [...prev, ev]);
    onActivity?.({ action: 'calendar:add', target: { type: 'event', id: ev.id, title: ev.title }, metadata: { date } });
  }

  function remove(id) {
    const ev = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (ev) onActivity?.({ action: 'calendar:remove', target: { type: 'event', id: ev.id, title: ev.title } });
  }

  return (
    <main className="p-6">
      <div className="mb-4 flex gap-2">
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={addEvent}>Schedule Post</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.sort((a,b)=>a.date.localeCompare(b.date)).map(e => (
          <div key={e.id} className="bg-white rounded shadow p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm text-gray-600">{e.date}</div>
            </div>
            <button className="text-sm border px-2 py-1 rounded" onClick={() => remove(e.id)}>Remove</button>
          </div>
        ))}
      </div>
    </main>
  );
}


