export default function Notifications({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return <div className="text-gray-500 text-sm">You're all caught up.</div>;
  }

  return (
    <div className="space-y-2">
      {notifications.map(n => (
        <div key={n.id} className="border rounded p-2 flex items-center justify-between">
          <div className="text-sm">{n.text}</div>
          <span className="text-xs text-gray-500">{n.type}</span>
        </div>
      ))}
    </div>
  );
}


