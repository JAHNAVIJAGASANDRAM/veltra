import { useState } from "react";

export default function ProfileSettings({ context, team, setTeam }) {
  const [name, setName] = useState(context?.user?.name || "");
  const [role, setRole] = useState(context?.user?.role || "");
  const [org, setOrg] = useState(context?.user?.organization || "");
  const [drive, setDrive] = useState(false);
  const [notion, setNotion] = useState(false);
  const [slack, setSlack] = useState(false);
  const [customRole, setCustomRole] = useState("");

  function updateTeamMemberRole(email, newRole) {
    setTeam(prev => ({
      ...prev,
      members: prev.members?.map(m => m.email === email ? { ...m, role: newRole } : m) || []
    }));
  }

  function addMember() {
    const email = prompt('Invite member by email:');
    if (!email) return;
    setTeam(prev => ({
      ...prev,
      members: [...(prev.members||[]), { email, role: 'Creator' }]
    }));
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Personal Profile</h2>
        <input className="border rounded px-3 py-2 mb-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <select className="border rounded px-3 py-2 mb-2 w-full" value={role} onChange={e => setRole(e.target.value)}>
          <option value="">Select role</option>
          <option>Creator</option>
          <option>Team Manager</option>
          <option>Research</option>
          <option>Editor</option>
          <option>Analyst</option>
          <option>Publisher</option>
        </select>
        <div className="flex gap-2 mb-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Or add custom role" value={customRole} onChange={e => setCustomRole(e.target.value)} />
          <button className="border px-3 py-2 rounded" onClick={() => { if (customRole.trim()) { setRole(customRole.trim()); setCustomRole(""); } }}>Set</button>
        </div>
        <input className="border rounded px-3 py-2 mb-2 w-full" placeholder="Organization" value={org} onChange={e => setOrg(e.target.value)} />
        <div className="text-xs text-gray-600">Avatar upload to be added later.</div>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Workspace Settings</h2>
        <div className="flex gap-2 mb-2">
          <button className="border px-3 py-2 rounded" onClick={addMember}>Invite Member</button>
        </div>
        <div className="space-y-2">
          {team?.members?.map(m => (
            <div key={m.email} className="border rounded p-2 flex items-center justify-between">
              <div className="text-sm">{m.email}</div>
              <select className="text-sm border rounded px-2 py-1" value={m.role} onChange={e => updateTeamMemberRole(m.email, e.target.value)}>
                <option>Admin</option>
                <option>Creator</option>
                <option>Editor</option>
                <option>Researcher</option>
                <option>Analyst</option>
                <option>Publisher</option>
              </select>
            </div>
          ))}
          {(!team?.members || team.members.length === 0) && <div className="text-gray-500 text-sm">No members yet.</div>}
        </div>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Integrations & Notifications</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={drive} onChange={e => setDrive(e.target.checked)} /> Google Drive</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={notion} onChange={e => setNotion(e.target.checked)} /> Notion</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={slack} onChange={e => setSlack(e.target.checked)} /> Slack</label>
        </div>
        <div className="text-xs text-gray-600 mt-3">Email and in-app notifications will be sent for deadlines and approvals.</div>
      </section>
    </main>
  );
}


