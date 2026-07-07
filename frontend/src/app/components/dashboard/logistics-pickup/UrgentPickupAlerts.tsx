import { AlertTriangle, Clock3, MapPin, PackageCheck, Truck } from "lucide-react";
import type { PickupAlert } from "../../../utils/pickupTasksStorage";
import { cn } from "../../ui/utils";

const ALERT_ICONS = {
  delay: Clock3,
  early_arrival: MapPin,
  no_driver: Truck,
  ready_now: PackageCheck,
  road_issue: AlertTriangle,
} as const;

export function UrgentPickupAlerts({ alerts }: { alerts: PickupAlert[] }) {
  return (
    <section className="agrivo-pickup-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Urgent Alerts</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Issues that need quick attention</p>

      <ul className="agrivo-pickup-alerts-list">
        {alerts.map((alert) => {
          const Icon = ALERT_ICONS[alert.type];
          return (
            <li
              key={alert.id}
              className={cn(
                "agrivo-pickup-alert",
                alert.urgency === "high"
                  ? "agrivo-pickup-alert--high"
                  : "agrivo-pickup-alert--medium",
              )}
            >
              <span className="agrivo-pickup-alert__icon" aria-hidden>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#102018]">{alert.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-[#5F6F64]">{alert.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
