import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  CheckCircle2,
  Scale,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  formatDeliveredWeight,
  type CompletedSummary,
} from "../../../utils/completedDeliveriesStorage";

interface StatCard {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent: "today" | "week" | "weight" | "ontime" | "rating";
}

export function CompletedDeliveryStats({ summary }: { summary: CompletedSummary }) {
  const cards: StatCard[] = [
    {
      label: "Completed Today",
      value: String(summary.completedToday),
      hint: "Delivered today",
      icon: CheckCircle2,
      accent: "today",
    },
    {
      label: "Completed This Week",
      value: String(summary.completedThisWeek),
      hint: "Last 7 days",
      icon: CalendarCheck,
      accent: "week",
    },
    {
      label: "Total Delivered Weight",
      value: formatDeliveredWeight(summary.totalDeliveredWeightKg),
      hint: "All records",
      icon: Scale,
      accent: "weight",
    },
    {
      label: "On-Time Rate",
      value: `${summary.onTimeRate}%`,
      hint: "Delivery punctuality",
      icon: TrendingUp,
      accent: "ontime",
    },
    {
      label: "Average Rating",
      value: summary.averageRating.toFixed(1),
      hint: "Buyer satisfaction",
      icon: Star,
      accent: "rating",
    },
  ];

  return (
    <section className="agrivo-completed-stats">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`agrivo-completed-stat-card agrivo-card agrivo-completed-stat-card--${card.accent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="agrivo-completed-stat-icon">
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
