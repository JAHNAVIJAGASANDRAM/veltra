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
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-4">
              📅
            </div>
            <h1 className="heading-2">Content Calendar</h1>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Schedule Post'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="modern-card p-8 mb-8">
          <h3 className="heading-3 mb-6">Schedule New Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              className="modern-input" 
              placeholder="Content title" 
              value={newEvent.title} 
              onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))} 
            />
            <input 
              className="modern-input" 
              type="date" 
              value={newEvent.date} 
              onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))} 
            />
            <select 
              className="modern-input" 
              value={newEvent.type} 
              onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
            >
              {CONTENT_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            <button className="btn-primary" onClick={addEvent}>Schedule</button>
          </div>
          <textarea 
            className="modern-input w-full mt-4" 
            placeholder="Description (optional)" 
            rows={3}
            value={newEvent.description} 
            onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))} 
          />
        </div>
      )}

      <div className="modern-card p-8">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className="min-h-[120px] border border-gray-200 rounded-lg p-2 bg-white hover:bg-gray-50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={e => day && handleDrop(e, day.toISOString().slice(0, 10))}
            >
              {day && (
                <>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {events
                      .filter(ev => ev.date === day.toISOString().slice(0, 10))
                      .map(ev => (
                        <div 
                          key={ev.id}
                          className={`text-xs p-1 rounded cursor-move ${CONTENT_TYPES.find(t => t.id === ev.type)?.color} text-white`}
                          draggable
                          onDragStart={e => handleDragStart(e, ev)}
                        >
                          <div className="font-medium truncate">{ev.title}</div>
                          <div className="text-xs opacity-90">{ev.type}</div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 modern-card p-8">
        <h3 className="heading-3 mb-6">Scheduled Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => (
            <div key={ev.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-3 h-3 rounded-full ${CONTENT_TYPES.find(t => t.id === ev.type)?.color}`}></div>
                <button 
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => remove(ev.id)}
                >
                  ×
                </button>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{ev.title}</h4>
              <div className="text-sm text-gray-600 mb-3">
                <div className="flex items-center mb-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  {new Date(ev.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {ev.type}
                </div>
              </div>
              {ev.description && (
                <p className="text-sm text-gray-600 mb-3">{ev.description}</p>
              )}
              <div className="flex gap-2">
                <select 
                  className="text-xs modern-input flex-1" 
                  value={ev.status} 
                  onChange={e => updateEventStatus(ev.id, e.target.value)}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


