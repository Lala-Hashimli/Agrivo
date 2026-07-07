import { Clock3, MapPin, Package, Truck, Users } from "lucide-react";
import type { LogisticsProfileStats } from "../../../utils/logisticsProfileStorage";

const STAT_CARDS = [
  {
    key: "totalDeliveries" as const,
    label: "Total Deliveries",
    hint: "Completed shipments",
    icon: Package,
    tone: "green",
  },
  {
    key: "activeDrivers" as const,
    label: "Active Drivers",
    hint: "On your team",
    icon: Users,
    tone: "neutral",
  },
  {
    key: "fleetSize" as const,
    label: "Fleet Size",
    hint: "Registered vehicles",
    icon: Truck,
    tone: "teal",
  },
  {
    key: "serviceRegions" as const,
    label: "Service Regions",
    hint: "Coverage areas",
    icon: MapPin,
    tone: "blue",
  },
  {
    key: "onTimeRate" as const,
    label: "On-Time Rate",
    hint: "Delivery performance",
    icon: Clock3,
    tone: "ontime",
  },
];

export function LogisticsProfileStats({ stats }: { stats: LogisticsProfileStats }) {
  return (
    <section className="agrivo-logistics-profile-stats">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        const value =
          card.key === "onTimeRate" ? `${stats[card.key]}%` : String(stats[card.key]);

        return (
          <div
            key={card.label}
            className={`agrivo-logistics-profile-stat-card agrivo-logistics-profile-stat-card--${card.tone}`}
          >
            <div className="agrivo-logistics-profile-stat-icon">
              <Icon className="h-4 w-4" />
            </div>
            <p className="agrivo-logistics-profile-stat-value">{value}</p>
            <p className="agrivo-logistics-profile-stat-label">{card.label}</p>
            <p className="agrivo-logistics-profile-stat-hint">{card.hint}</p>
          </div>
        );
      })}
    </section>
  );
}
