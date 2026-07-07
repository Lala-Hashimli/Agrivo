import { Route } from "lucide-react";
import type { TopRoute } from "../../../utils/completedDeliveriesStorage";

export function TopRoutesCard({ routes }: { routes: TopRoute[] }) {
  return (
    <section className="agrivo-completed-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Top Completed Routes</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Most frequent delivery routes</p>
      <ul className="agrivo-completed-routes-list">
        {routes.map((route) => (
          <li key={route.route} className="agrivo-completed-route-item">
            <Route className="h-4 w-4 shrink-0 text-[#43A047]" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#102018]">{route.route}</p>
              <p className="text-xs text-[#5F6F64]">{route.count} deliveries</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
