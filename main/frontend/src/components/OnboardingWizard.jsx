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
  const [availableRoles, setAvailableRoles] = useState(["Creator","Team Manager","Research","Editor","Analyst","Publisher"]);
  const [defaultTeamRole, setDefaultTeamRole] = useState("Creator");

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
      .map(email => ({ email, role: defaultTeamRole || "Creator" }));

    onComplete({
      type: "team",
      user: { name, role, organization, email },
      team: { name: teamName, members: parsedMembers },
      workspace: { tasks: [], research: [], drafts: [], approvals: [], calendar: [] }
    });
  }

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="modal-content relative w-full max-w-2xl p-8">
        {step === "auth" && (
          <div className="animate-fade-in-up">
            <h2 className="heading-2 mb-4">Create your account</h2>
            <p className="text-gray-600 mb-8 text-lg">Sign up to get started with Veltra</p>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <input className="modern-input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
              <input className="modern-input" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="modern-input" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="modern-input"
                  value={role}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === "__custom") {
                      const custom = prompt('Enter a custom role');
                      if (custom && custom.trim()) {
                        const next = custom.trim();
                        if (!availableRoles.includes(next)) setAvailableRoles(prev => [...prev, next]);
                        setRole(next);
                      } else {
                        setRole("");
                      }
                    } else {
                      setRole(value);
                    }
                  }}
                >
                  <option value="">Select role</option>
                  {availableRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                  <option value="__custom">+ Add custom role…</option>
                </select>
                <input className="modern-input md:col-span-2" placeholder="Organization (optional)" value={organization} onChange={e => setOrganization(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <button className="btn-secondary flex-1">Continue with Google</button>
              <button className="btn-secondary flex-1">GitHub</button>
              <button className="btn-secondary flex-1">LinkedIn</button>
            </div>

            <div className="flex justify-end gap-4">
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn-primary" onClick={handleAuthContinue}>Continue</button>
            </div>
          </div>
        )}

        {step === "usage" && (
          <div className="animate-fade-in-up">
            <h2 className="heading-2 mb-4">How will you use Veltra?</h2>
            <p className="text-gray-600 mb-8 text-lg">Choose the setup that fits you best.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button onClick={() => setUsage("individual")} className={`modern-card p-6 text-left transition-all duration-300 ${usage === "individual" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}>
                <h3 className="heading-3 mb-3">I'm an Individual Creator</h3>
                <p className="text-gray-600">Get a personal dashboard with calendar, tasks, and drafts.</p>
              </button>
              <button onClick={() => setUsage("team")} className={`modern-card p-6 text-left transition-all duration-300 ${usage === "team" ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}>
                <h3 className="heading-3 mb-3">I'm a Team / Organization</h3>
                <p className="text-gray-600">Launch a team workspace with boards and calendars.</p>
              </button>
            </div>
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={() => setStep("auth")}>Back</button>
              <div className="flex gap-4">
                <button className="btn-secondary" onClick={onClose}>Cancel</button>
                <button disabled={!usage} className="btn-primary disabled:opacity-50" onClick={handleUsageContinue}>Continue</button>
              </div>
            </div>
          </div>
        )}

        {step === "individual-setup" && (
          <div className="animate-fade-in-up">
            <h2 className="heading-2 mb-4">Personal Creator Setup</h2>
            <p className="text-gray-600 mb-8 text-lg">We'll create a default workspace with Content Calendar, Task Tracker, and Draft Box.</p>
            <div className="modern-card p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Content Calendar (empty but ready)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Task Tracker (personal)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Draft Box (ideas & drafts)
                </li>
              </ul>
            </div>
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={() => setStep("usage")}>Back</button>
              <div className="flex gap-4">
                <button className="btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn-primary" onClick={handleIndividualCreate}>Create my workspace</button>
              </div>
            </div>
          </div>
        )}

        {step === "team-setup" && (
          <div className="animate-fade-in-up">
            <h2 className="heading-2 mb-4">Team Workspace Setup</h2>
            <p className="text-gray-600 mb-8 text-lg">Name your organization, add members, and we'll set up roles and dashboards.</p>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <input className="modern-input" placeholder="Team / Organization name" value={teamName} onChange={e => setTeamName(e.target.value)} />
              <textarea className="modern-input" placeholder="Invite members (emails, comma-separated)" rows={3} value={members} onChange={e => setMembers(e.target.value)} />
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-700 font-medium">Default role for invites:</label>
                <select
                  className="modern-input flex-1"
                  value={defaultTeamRole}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === "__custom") {
                      const custom = prompt('Enter a custom role');
                      if (custom && custom.trim()) {
                        const next = custom.trim();
                        if (!availableRoles.includes(next)) setAvailableRoles(prev => [...prev, next]);
                        setDefaultTeamRole(next);
                      }
                    } else {
                      setDefaultTeamRole(value);
                    }
                  }}
                >
                  {availableRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                  <option value="__custom">+ Add custom role…</option>
                </select>
              </div>
            </div>
            <div className="modern-card p-4 mb-8">
              <p className="text-sm text-gray-600">
                Default roles will be assigned. You can adjust later (Admin, Creator, Editor, Researcher, Analyst, Publisher).
              </p>
            </div>
            <div className="flex justify-between">
              <button className="btn-secondary" onClick={() => setStep("usage")}>Back</button>
              <div className="flex gap-4">
                <button className="btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn-primary" onClick={handleTeamCreate}>Create team workspace</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


