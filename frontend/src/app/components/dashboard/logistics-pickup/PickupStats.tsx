import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CalendarClock, CheckCircle2, Clock3, PackageCheck } from "lucide-react";
import type { PickupTaskSummary } from "../../../utils/pickupTasksStorage";

interface StatCard {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  accent: "today" | "scheduled" | "ready" | "delayed" | "completed";
}

export function PickupStats({ summary }: { summary: PickupTaskSummary }) {
  const cards: StatCard[] = [
    {
      label: "Today's Pickups",
      value: summary.todaysPickups,
      hint: "Scheduled for today",
      icon: CalendarClock,
      accent: "today",
    },
    {
      label: "Scheduled",
      value: summary.scheduled,
      hint: "Awaiting collection",
      icon: Clock3,
      accent: "scheduled",
    },
    {
      label: "Ready for Pickup",
      value: summary.readyForPickup,
      hint: "Packed and waiting",
      icon: PackageCheck,
      accent: "ready",
    },
    {
      label: "Delayed Pickups",
      value: summary.delayed,
      hint: "Needs attention",
      icon: AlertTriangle,
      accent: "delayed",
    },
    {
      label: "Completed Pickups",
      value: summary.completed,
      hint: "Collected today",
      icon: CheckCircle2,
      accent: "completed",
    },
  ];

  return (
    <section className="agrivo-pickup-stats">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`agrivo-pickup-stat-card agrivo-card agrivo-pickup-stat-card--${card.accent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="agrivo-pickup-stat-icon">
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
