import type { LucideIcon } from "lucide-react";
import { CheckCircle2, ClipboardList, Clock3, ChefHat } from "lucide-react";
import type { FarmerOrdersSummary } from "../../../utils/farmerOrdersStorage";

interface StatCard {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  accent?: "default" | "pending" | "preparing" | "completed";
}

export function OrderStats({ summary }: { summary: FarmerOrdersSummary }) {
  const cards: StatCard[] = [
    {
      label: "Total Orders",
      value: summary.total,
      hint: "All buyer requests",
      icon: ClipboardList,
      accent: "default",
    },
    {
      label: "Pending Orders",
      value: summary.pending,
      hint: "Awaiting confirmation",
      icon: Clock3,
      accent: "pending",
    },
    {
      label: "Preparing",
      value: summary.preparing,
      hint: "In progress now",
      icon: ChefHat,
      accent: "preparing",
    },
    {
      label: "Completed",
      value: summary.completed,
      hint: "Delivered orders",
      icon: CheckCircle2,
      accent: "completed",
    },
  ];

  return (
    <section className="agrivo-farmer-order-stats">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`agrivo-farmer-order-stat-card agrivo-card agrivo-farmer-order-stat-card--${card.accent ?? "default"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="agrivo-farmer-order-stat-icon">
                <Icon className="h-5 w-5 text-[#14532D]" strokeWidth={1.75} />
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
