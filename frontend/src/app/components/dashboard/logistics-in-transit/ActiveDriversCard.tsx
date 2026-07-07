import type { TransitDriver } from "../../../utils/inTransitStorage";
import { cn } from "../../ui/utils";

const DOT_TONES: Record<TransitDriver["statusTone"], string> = {
  active: "agrivo-transit-driver-dot--active",
  near: "agrivo-transit-driver-dot--near",
  delayed: "agrivo-transit-driver-dot--delayed",
  issue: "agrivo-transit-driver-dot--issue",
};

export function ActiveDriversCard({ drivers }: { drivers: TransitDriver[] }) {
  return (
    <section className="agrivo-transit-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Active Drivers</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Drivers currently on the road</p>
      <ul className="agrivo-transit-drivers-list">
        {drivers.map((driver) => (
          <li key={driver.id} className="agrivo-transit-driver-item">
            <span className={cn("agrivo-transit-driver-dot", DOT_TONES[driver.statusTone])} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#102018]">{driver.name}</p>
              <p className="text-xs text-[#5F6F64]">{driver.vehicle}</p>
              <p className="mt-0.5 text-xs font-medium text-[#14532D]">
                {driver.status} — {driver.routeLabel}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
