import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ClipboardList, LoaderCircle, Truck } from "lucide-react";
import type { AssignedDeliverySummary } from "../../../utils/assignedDeliveriesStorage";

interface StatCard {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  accent: "total" | "pending" | "progress" | "priority";
}

export function AssignedDeliveryStats({ summary }: { summary: AssignedDeliverySummary }) {
  const cards: StatCard[] = [
    {
      label: "Total Assigned",
      value: summary.totalAssigned,
      hint: "Active delivery tasks",
      icon: ClipboardList,
      accent: "total",
    },
    {
      label: "Pending Pickup",
      value: summary.pendingPickup,
      hint: "Awaiting farm pickup",
      icon: Truck,
      accent: "pending",
    },
    {
      label: "In Progress",
      value: summary.inProgress,
      hint: "On the road now",
      icon: LoaderCircle,
      accent: "progress",
    },
    {
      label: "High Priority",
      value: summary.highPriority,
      hint: "Needs attention first",
      icon: AlertTriangle,
      accent: "priority",
    },
  ];

  return (
    <section className="agrivo-assigned-stats">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`agrivo-assigned-stat-card agrivo-card agrivo-assigned-stat-card--${card.accent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="agrivo-assigned-stat-icon">
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
