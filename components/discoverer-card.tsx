import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DiscovererCardProps {
  name: string;
  icon: string;
  lastAdventure: string;
  href: string;
  colorClass: string;
}

export function DiscovererCard({
  name,
  icon,
  lastAdventure,
  href,
  colorClass,
}: DiscovererCardProps) {
  return (
    <article className={`discoverer-card ${colorClass}`}>
      <div className="discoverer-card-heading">
        <span className="discoverer-icon" aria-hidden="true">
          {icon}
        </span>
        <h2>{name}</h2>
      </div>

      <div className="discoverer-last-story">
        <span>Laatste avontuur</span>
        <p>{lastAdventure}</p>
      </div>

      <Link
        href={href}
        className="discoverer-continue"
        aria-label={`Samen met ${name} verdergaan: ${lastAdventure}`}
      >
        Samen verder
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}
