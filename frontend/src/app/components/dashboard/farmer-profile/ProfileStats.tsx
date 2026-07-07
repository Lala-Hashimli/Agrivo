import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Coins, Package, Star } from "lucide-react";
import type { FarmerProfileStats } from "../../../utils/farmerProfileStorage";

interface StatCard {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}

export function ProfileStats({ stats }: { stats: FarmerProfileStats }) {
  const cards: StatCard[] = [
    {
      label: "Active Products",
      value: String(stats.activeProducts),
      hint: "Listed in marketplace",
      icon: Package,
    },
    {
      label: "Completed Orders",
      value: String(stats.completedOrders),
      hint: "Delivered to buyers",
      icon: CheckCircle2,
    },
    {
      label: "Total Revenue",
      value: `${stats.totalRevenue.toLocaleString("en-US")} AZN`,
      hint: "Gross marketplace sales",
      icon: Coins,
    },
    {
      label: "Rating",
      value: stats.rating.toFixed(1),
      hint: "Buyer satisfaction",
      icon: Star,
    },
  ];

  return (
    <section className="agrivo-farmer-dash-profile-stats">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="agrivo-farmer-dash-profile-stat-card agrivo-card">
            <div className="flex items-start justify-between gap-3">
              <div className="agrivo-farmer-dash-profile-stat-icon">
                <Icon className="h-5 w-5 text-[#14532D]" strokeWidth={1.75} />
              </div>
              <span className="agrivo-heading text-xl font-bold text-[#102018] sm:text-2xl">
                {card.value}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#102018]">{card.label}</p>
            <p className="mt-0.5 text-xs text-[#6b7a70]">{card.hint}</p>
          </div>
        );
      })}
    </section>
  );
}
