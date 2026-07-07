import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Navigation,
  Truck,
} from "lucide-react";
import type { InTransitSummary } from "../../../utils/inTransitStorage";

interface StatCard {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  accent: "active" | "ontime" | "delayed" | "near" | "issues";
}

export function InTransitStats({ summary }: { summary: InTransitSummary }) {
  const cards: StatCard[] = [
    {
      label: "Active Trips",
      value: summary.activeTrips,
      hint: "On the road now",
      icon: Truck,
      accent: "active",
    },
    {
      label: "On Time",
      value: summary.onTime,
      hint: "Within ETA window",
      icon: CheckCircle2,
      accent: "ontime",
    },
    {
      label: "Delayed",
      value: summary.delayed,
      hint: "Behind schedule",
      icon: AlertTriangle,
      accent: "delayed",
    },
    {
      label: "Near Destination",
      value: summary.nearDestination,
      hint: "Approaching buyer",
      icon: MapPin,
      accent: "near",
    },
    {
      label: "Issues Reported",
      value: summary.issuesReported,
      hint: "Needs attention",
      icon: Navigation,
      accent: "issues",
    },
  ];

  return (
    <section className="agrivo-transit-stats">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`agrivo-transit-stat-card agrivo-card agrivo-transit-stat-card--${card.accent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="agrivo-transit-stat-icon">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <span className="agrivo-heading text-2xl font-bold text-[#102018]">{card.value}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#102018]">{card.label}</p>
            <p className="mt-0.5 text-xs text-[#6b7a70]">{card.hint}</p>
          </div>
        );
      })}
    </section>
  );
}
