import { useState } from "react";

const CONTENT_TYPES = [
  { id: 'post', label: 'Post', color: 'bg-blue-500' },
  { id: 'article', label: 'Article', color: 'bg-green-500' },
  { id: 'video', label: 'Video', color: 'bg-purple-500' },
  { id: 'podcast', label: 'Podcast', color: 'bg-orange-500' },
  { id: 'newsletter', label: 'Newsletter', color: 'bg-red-500' },
];

export default function PublishingCalendar({ events, setEvents, onActivity }) {
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'post', description: '' });

  function addEvent() {
    if (!newEvent.title || !newEvent.date) return;
    const ev = { 
      id: crypto.randomUUID(), 
      ...newEvent,
      status: 'scheduled'
    };
    setEvents(prev => [...prev, ev]);
    onActivity?.({ action: 'calendar:add', target: { type: 'event', id: ev.id, title: ev.title }, metadata: { date: ev.date, type: ev.type } });
    setNewEvent({ title: '', date: '', type: 'post', description: '' });
    setShowAddForm(false);
  }

  function remove(id) {
    const ev = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (ev) onActivity?.({ action: 'calendar:remove', target: { type: 'event', id: ev.id, title: ev.title } });
  }

  function handleDragStart(e, event) {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e, targetDate) {
    e.preventDefault();
    if (draggedEvent && targetDate !== draggedEvent.date) {
      setEvents(prev => prev.map(ev => 
        ev.id === draggedEvent.id ? { ...ev, date: targetDate } : ev
      ));
      onActivity?.({ action: 'calendar:move', target: { type: 'event', id: draggedEvent.id, title: draggedEvent.title }, metadata: { from: draggedEvent.date, to: targetDate } });
    }
    setDraggedEvent(null);
  }

  function updateEventStatus(id, status) {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, status } : ev));
    const ev = events.find(e => e.id === id);
    if (ev) onActivity?.({ action: 'calendar:status', target: { type: 'event', id: ev.id, title: ev.title }, metadata: { status } });
  }

  // Generate calendar days for current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    calendarDays.push(date);
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Calendar</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Schedule Post'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="font-semibold mb-3">Schedule New Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input 
              className="border rounded px-3 py-2" 
              placeholder="Title" 
              value={newEvent.title} 
              onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))} 
            />
            <input 
              className="border rounded px-3 py-2" 
              type="date" 
              value={newEvent.date} 
              onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))} 
            />
            <select 
              className="border rounded px-3 py-2" 
              value={newEvent.type} 
              onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
            >
              {CONTENT_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded" 
              onClick={addEvent}
            >
              Schedule
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-4">
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2" />;
            }
            
            const dateStr = day.toISOString().slice(0, 10);
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = day.toDateString() === now.toDateString();
            
            return (
              <div 
                key={index} 
                className={`p-2 min-h-[80px] border ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dateStr)}
              >
                <div className="text-sm font-medium mb-1">
                  {day.getDate()}
                  {isToday && <span className="ml-1 text-blue-600">•</span>}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      className={`p-1 rounded text-xs text-white cursor-move ${
                        CONTENT_TYPES.find(t => t.id === event.type)?.color || 'bg-gray-500'
                      }`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <select 
                          className="text-xs bg-white text-gray-700 rounded px-1 py-0.5"
                          value={event.status}
                          onChange={(e) => updateEventStatus(event.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                        <button 
                          className="text-xs bg-red-500 text-white rounded px-1 py-0.5"
                          onClick={(e) => { e.stopPropagation(); remove(event.id); }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Content Type Legend</h3>
        <div className="flex flex-wrap gap-3">
          {CONTENT_TYPES.map(type => (
            <div key={type.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${type.color}`} />
              <span className="text-sm">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


