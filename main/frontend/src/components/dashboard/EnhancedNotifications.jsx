import { useState } from "react";

export default function EnhancedNotifications({ notifications, onActivity }) {
  const [filter, setFilter] = useState("all"); // all, unread, high, medium, low

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "high") return n.priority === "high";
    if (filter === "medium") return n.priority === "medium";
    if (filter === "low") return n.priority === "low";
    return true;
  });

  function markAsRead(id) {
    onActivity({ action: 'notification:read', target: { type: 'notification', id } });
  }

  function markAllAsRead() {
    notifications.forEach(n => {
      if (!n.read) markAsRead(n.id);
    });
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high" && !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 rounded text-sm ${filter === "all" ? "bg-blue-600 text-white" : "border"}`}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${filter === "unread" ? "bg-blue-600 text-white" : "border"}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${filter === "high" ? "bg-red-600 text-white" : "border"}`}
            onClick={() => setFilter("high")}
          >
            High ({highPriorityCount})
          </button>
        </div>
        {unreadCount > 0 && (
          <button className="text-sm text-blue-600" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-64 overflow-auto">
        {filteredNotifications.length === 0 && (
          <div className="text-gray-500 text-sm text-center py-4">
            {filter === "all" ? "No notifications" : `No ${filter} notifications`}
          </div>
        )}
        
        {filteredNotifications.map(n => (
          <div 
            key={n.id} 
            className={`border rounded p-3 ${!n.read ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    n.priority === 'high' ? 'bg-red-500' : 
                    n.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-xs text-gray-500 uppercase">{n.type}</span>
                  {!n.read && <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">New</span>}
                </div>
                <div className="text-sm">{n.text}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(n.ts).toLocaleString()}
                </div>
              </div>
              {!n.read && (
                <button 
                  className="text-xs text-blue-600 ml-2"
                  onClick={() => markAsRead(n.id)}
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
