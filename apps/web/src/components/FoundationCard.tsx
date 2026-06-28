import type { LucideIcon } from "lucide-react";

interface FoundationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FoundationCard({ title, description, icon: Icon }: FoundationCardProps) {
  return (
    <article className="foundation-card">
      <div className="card-icon" aria-hidden="true">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </article>
  );
}
