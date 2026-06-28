import { Activity, FileLock2, Fingerprint, Gauge, Network, ShieldCheck } from "lucide-react";
import { FoundationCard } from "../components/FoundationCard";

const foundationModules = [
  {
    title: "Identity Boundary",
    description: "Prepared for sessions, refresh rotation, MFA, and device trust.",
    icon: Fingerprint
  },
  {
    title: "Policy Boundary",
    description: "RBAC and ABAC will evaluate every workspace/resource action.",
    icon: ShieldCheck
  },
  {
    title: "Audit Boundary",
    description: "Security events and user actions will be immutable and queryable.",
    icon: Activity
  },
  {
    title: "File Boundary",
    description: "Uploads will flow through validation, encryption, scanning, and signed access.",
    icon: FileLock2
  },
  {
    title: "Risk Boundary",
    description: "Workspace risk scoring will combine identity, permissions, files, and audit signals.",
    icon: Gauge
  },
  {
    title: "Infrastructure Boundary",
    description: "Postgres, Redis, object storage, Nginx, and health probes are first-class services.",
    icon: Network
  }
];

export function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-mark">V</div>
        <nav>
          <a href="#overview" className="nav-item active">Overview</a>
          <a href="#security" className="nav-item">Security</a>
          <a href="#infrastructure" className="nav-item">Infrastructure</a>
          <a href="#roadmap" className="nav-item">Roadmap</a>
        </nav>
      </aside>

      <section className="workspace" id="overview">
        <header className="topbar">
          <div>
            <p className="eyebrow">Secure collaborative workspace</p>
            <h1>Veltra Foundation Console</h1>
          </div>
          <div className="status-pill">
            <span className="status-dot" />
            Milestone 1
          </div>
        </header>

        <section className="summary-grid" aria-label="Foundation status">
          <div className="summary-panel">
            <span className="metric">12</span>
            <span className="label">Security domains planned</span>
          </div>
          <div className="summary-panel">
            <span className="metric">3</span>
            <span className="label">Core infrastructure services</span>
          </div>
          <div className="summary-panel">
            <span className="metric">0</span>
            <span className="label">Secrets stored in client code</span>
          </div>
        </section>

        <section className="module-grid" id="security">
          {foundationModules.map((module) => (
            <FoundationCard key={module.title} {...module} />
          ))}
        </section>
      </section>
    </main>
  );
}
