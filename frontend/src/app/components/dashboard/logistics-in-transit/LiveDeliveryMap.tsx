import { todayRouteData } from "../../../data/logisticsRoutes";
import { RouteMap } from "../../logistics/RouteMap";

export function LiveDeliveryMap({ className }: { className?: string }) {
  return (
    <section className={`agrivo-transit-live-map agrivo-dashboard-panel ${className ?? ""}`}>
      <div className="agrivo-transit-live-map__header">
        <div>
          <h3 className="agrivo-heading text-base font-bold text-[#102018] sm:text-lg">
            Live Delivery Map
          </h3>
          <p className="mt-1 text-xs text-[#6b7a70]">
            Active routes with pickup, vehicle, and destination markers
          </p>
        </div>
      </div>
      <RouteMap route={todayRouteData} className="agrivo-transit-live-map__canvas" />
    </section>
  );
}
