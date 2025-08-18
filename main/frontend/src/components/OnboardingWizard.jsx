import { useState } from "react";

export default function OnboardingWizard({ onClose, onComplete }) {
  const [step, setStep] = useState("auth");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usage, setUsage] = useState(null); // "individual" | "team"
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState(""); // comma-separated emails

  function handleAuthContinue() {
    if (!name || !email) {
      alert("Please provide at least your name and email.");
      return;
    }
    setStep("usage");
  }

  function handleUsageContinue() {
    if (!usage) return;
    if (usage === "individual") {
      setStep("individual-setup");
    } else {
      setStep("team-setup");
    }
  }

  function handleIndividualCreate() {
    onComplete({
      type: "individual",
      user: { name, role, organization, email },
      workspace: { calendar: [], tasks: [], drafts: [] }
    });
  }

  function handleTeamCreate() {
    if (!teamName) {
      alert("Please enter a team or organization name.");
      return;
    }
    const parsedMembers = members
      .split(',')
      .map(m => m.trim())
      .filter(Boolean)
      .map(email => ({ email, role: "Creator" }));

    onComplete({
      type: "team",
      user: { name, role, organization, email },
      team: { name: teamName, members: parsedMembers },
      workspace: { tasks: [], research: [], drafts: [], approvals: [], calendar: [] }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
        {step === "auth" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Create your account</h2>
            <p className="text-gray-600 mb-6">Sign up to get started with Veltra</p>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input className="border rounded px-3 py-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              <input className="border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select className="border rounded px-3 py-2" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="">Select role</option>
                  <option>Creator</option>
                  <option>Team Manager</option>
                  <option>Research</option>
                  <option>Editor</option>
                  <option>Analyst</option>
                  <option>Publisher</option>
                </select>
                <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Organization (optional)" value={organization} onChange={e => setOrganization(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button className="flex-1 border rounded px-3 py-2 hover:bg-gray-50">Continue with Google</button>
              <button className="flex-1 border rounded px-3 py-2 hover:bg-gray-50">GitHub</button>
              <button className="flex-1 border rounded px-3 py-2 hover:bg-gray-50">LinkedIn</button>
            </div>

            <div className="flex justify-end gap-3">
              <button className="px-4 py-2" onClick={onClose}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAuthContinue}>Continue</button>
            </div>
          </div>
        )}

        {step === "usage" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">How will you use Veltra?</h2>
            <p className="text-gray-600 mb-6">Choose the setup that fits you best.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button onClick={() => setUsage("individual")} className={`border rounded p-4 text-left hover:border-blue-500 ${usage === "individual" ? "border-blue-500 ring-2 ring-blue-200" : ""}`}>
                <h3 className="font-bold mb-1">I'm an Individual Creator</h3>
                <p className="text-sm text-gray-600">Get a personal dashboard with calendar, tasks, and drafts.</p>
              </button>
              <button onClick={() => setUsage("team")} className={`border rounded p-4 text-left hover:border-blue-500 ${usage === "team" ? "border-blue-500 ring-2 ring-blue-200" : ""}`}>
                <h3 className="font-bold mb-1">I'm a Team / Organization</h3>
                <p className="text-sm text-gray-600">Launch a team workspace with boards and calendars.</p>
              </button>
            </div>
            <div className="flex justify-between">
              <button className="px-4 py-2" onClick={() => setStep("auth")}>Back</button>
              <div className="flex gap-3">
                <button className="px-4 py-2" onClick={onClose}>Cancel</button>
                <button disabled={!usage} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" onClick={handleUsageContinue}>Continue</button>
              </div>
            </div>
          </div>
        )}

        {step === "individual-setup" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Personal Creator Setup</h2>
            <p className="text-gray-600 mb-6">We'll create a default workspace with Content Calendar, Task Tracker, and Draft Box.</p>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>Content Calendar (empty but ready)</li>
              <li>Task Tracker (personal)</li>
              <li>Draft Box (ideas & drafts)</li>
            </ul>
            <div className="flex justify-between">
              <button className="px-4 py-2" onClick={() => setStep("usage")}>Back</button>
              <div className="flex gap-3">
                <button className="px-4 py-2" onClick={onClose}>Cancel</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleIndividualCreate}>Create my workspace</button>
              </div>
            </div>
          </div>
        )}

        {step === "team-setup" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Team Workspace Setup</h2>
            <p className="text-gray-600 mb-6">Name your organization, add members, and we'll set up roles and dashboards.</p>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input className="border rounded px-3 py-2" placeholder="Team / Organization name" value={teamName} onChange={e => setTeamName(e.target.value)} />
              <textarea className="border rounded px-3 py-2" placeholder="Invite members (emails, comma-separated)" rows={3} value={members} onChange={e => setMembers(e.target.value)} />
            </div>
            <div className="text-sm text-gray-600 mb-6">
              Default roles will be assigned. You can adjust later (Admin, Creator, Editor, Researcher, Analyst, Publisher).
            </div>
            <div className="flex justify-between">
              <button className="px-4 py-2" onClick={() => setStep("usage")}>Back</button>
              <div className="flex gap-3">
                <button className="px-4 py-2" onClick={onClose}>Cancel</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleTeamCreate}>Create team workspace</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


