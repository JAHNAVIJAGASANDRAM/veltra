export default function ActivityFeed({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-gray-500 text-sm">No recent activity.</div>;
  }

  return (
    <div className="space-y-2">
      {items
        .slice()
        .sort((a,b)=>b.ts - a.ts)
        .map(ev => (
        <div key={ev.id} className="border rounded p-2 text-sm">
          <div>
            <span className="font-semibold">{ev.actor}</span> {renderAction(ev)}
          </div>
          <div className="text-xs text-gray-500">{new Date(ev.ts).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

function renderAction(ev) {
  const t = ev.target?.title ? `“${ev.target.title}”` : '';
  switch (ev.action) {
    case 'task:create': return <>created task {t}</>;
    case 'task:move': return <>moved task {t} to {ev.metadata?.to}</>;
    case 'task:assign': return <>assigned task {t} to {ev.metadata?.assignee || 'Unassigned'}</>;
    case 'task:due': return <>set due date for task {t} ({ev.metadata?.date})</>;
    case 'draft:create': return <>created draft {t}</>;
    case 'draft:move': return <>moved draft {t} to {ev.metadata?.to}</>;
    case 'draft:version': return <>added a new version to {t}</>;
    case 'calendar:add': return <>scheduled {t} on {ev.metadata?.date}</>;
    case 'calendar:remove': return <>removed calendar item {t}</>;
    case 'research:add': return <>saved research {t}</>;
    case 'comment:add': return <>commented on {ev.target?.type} {t}</>;
    default: return <>{ev.action} {t}</>;
  }
}


