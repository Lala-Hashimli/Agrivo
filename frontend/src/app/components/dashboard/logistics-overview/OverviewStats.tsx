import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Route,
  Truck,
} from "lucide-react";
import type { LogisticsOverviewSummary } from "../../../utils/logisticsDashboardStorage";

interface StatCard {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  accent: string;
}

export function OverviewStats({ summary }: { summary: LogisticsOverviewSummary }) {
  const cards: StatCard[] = [
    {
      label: "Assigned Today",
      value: summary.assignedToday,
      hint: "Tasks scheduled",
      icon: ClipboardList,
      accent: "assigned",
    },
    {
      label: "Pickup Pending",
      value: summary.pickupPending,
      hint: "Awaiting farm handoff",
      icon: MapPin,
      accent: "pickup",
    },
    {
      label: "In Transit",
      value: summary.inTransit,
      hint: "On the road now",
      icon: Truck,
      accent: "transit",
    },
    {
      label: "Completed Today",
      value: summary.completedToday,
      hint: "Delivered successfully",
      icon: CheckCircle2,
      accent: "completed",
    },
    {
      label: "Delayed Deliveries",
      value: summary.delayed,
      hint: "Needs attention",
      icon: AlertTriangle,
      accent: "delayed",
    },
    {
      label: "Total Stops",
      value: summary.totalStops,
      hint: "Active route stops",
      icon: Route,
      accent: "stops",
    },
  ];

  return (
    <section className="agrivo-logistics-overview-stats">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`agrivo-logistics-overview-stat agrivo-logistics-overview-stat--${card.accent}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="agrivo-logistics-overview-stat-icon">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <span className="agrivo-heading text-2xl font-bold text-[#102018]">{card.value}</span>
            </div>
            <p className="mt-2.5 text-sm font-semibold text-[#102018]">{card.label}</p>
            <p className="mt-0.5 text-xs text-[#6b7a70]">{card.hint}</p>
          </div>
        );
      })}
    </section>
  );
}
