import {
  AlertTriangle,
  CheckCircle2,
  Map,
  RefreshCw,
  Truck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  applyInTransitAction,
  computeInTransitSummary,
  computeRouteProgressSummary,
  filterInTransitDeliveries,
  getInTransitDeliveries,
  getInTransitDrivers,
  getInTransitRegions,
  getLogisticsSectionHash,
  getTransitActionLabel,
  IN_TRANSIT_STATUS_LABELS,
  resolveInTransitUserId,
  seedTransitDrivers,
  seedTransitEtaAlerts,
  seedTransitIssues,
  type EtaStatusFilter,
  type InTransitAction,
  type InTransitDelivery,
  type InTransitStatusFilter,
} from "../../utils/inTransitStorage";
import { Button } from "../ui/button";
import { ActiveDriversCard } from "./logistics-in-transit/ActiveDriversCard";
import { EtaAlertsCard } from "./logistics-in-transit/EtaAlertsCard";
import { InTransitDeliveryCard } from "./logistics-in-transit/InTransitDeliveryCard";
import { InTransitFilterBar } from "./logistics-in-transit/InTransitFilterBar";
import { InTransitStats } from "./logistics-in-transit/InTransitStats";
import { IssueCenterCard } from "./logistics-in-transit/IssueCenterCard";
import { LiveDeliveryMap } from "./logistics-in-transit/LiveDeliveryMap";
import { RouteProgressCard } from "./logistics-in-transit/RouteProgressCard";
import { TransitDetailsModal } from "./logistics-in-transit/TransitDetailsModal";
import { TransitRouteModal } from "./logistics-in-transit/TransitRouteModal";

function navigate(hash: string) {
  window.location.hash = hash;
}

export function InTransitPage() {
  const { user } = useAuth();
  const userId = resolveInTransitUserId(user);

  const [deliveries, setDeliveries] = useState<InTransitDelivery[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InTransitStatusFilter>("all");
  const [region, setRegion] = useState("all");
  const [etaFilter, setEtaFilter] = useState<EtaStatusFilter>("all");
  const [driver, setDriver] = useState("all");
  const [toast, setToast] = useState<string | null>(null);
  const [detailDelivery, setDetailDelivery] = useState<InTransitDelivery | null>(null);
  const [routeDelivery, setRouteDelivery] = useState<InTransitDelivery | null>(null);
  const [showLiveMap, setShowLiveMap] = useState(false);

  const drivers = useMemo(() => seedTransitDrivers(), []);
  const etaAlerts = useMemo(() => seedTransitEtaAlerts(), []);
  const issues = useMemo(() => seedTransitIssues(), []);

  const refresh = useCallback(() => {
    if (!userId) return;
    setDeliveries(getInTransitDeliveries(userId));
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const activeDeliveries = useMemo(
    () => deliveries.filter((d) => d.status !== "delivered"),
    [deliveries],
  );

  const summary = useMemo(() => computeInTransitSummary(deliveries), [deliveries]);
  const routeProgress = useMemo(() => computeRouteProgressSummary(deliveries), [deliveries]);
  const regions = useMemo(() => getInTransitRegions(deliveries), [deliveries]);
  const driverNames = useMemo(() => getInTransitDrivers(deliveries), [deliveries]);

  const filteredDeliveries = useMemo(
    () =>
      filterInTransitDeliveries(activeDeliveries, {
        search,
        status,
        region,
        etaFilter,
        driver,
      }),
    [activeDeliveries, search, status, region, etaFilter, driver],
  );

  const handleAction = (delivery: InTransitDelivery, action: InTransitAction) => {
    if (!userId) return;

    if (action === "view_details") {
      setDetailDelivery(delivery);
      return;
    }

    if (action === "open_route") {
      setRouteDelivery(delivery);
      return;
    }

    if (action === "contact_driver") {
      showToast(`Calling ${delivery.driverName} at ${delivery.driverPhone}`);
      return;
    }

    if (action === "notify_buyer") {
      showToast(`Buyer ${delivery.buyerName} notified about ${delivery.taskId}.`);
      return;
    }

    const next = applyInTransitAction(userId, delivery.id, action);
    setDeliveries(next);
    const updated = next.find((d) => d.id === delivery.id);

    showToast(
      updated
        ? `${delivery.taskId}: ${getTransitActionLabel(action)} — ${IN_TRANSIT_STATUS_LABELS[updated.status]}.`
        : `${delivery.taskId}: ${getTransitActionLabel(action)} completed.`,
    );

    if (detailDelivery?.id === delivery.id && updated) {
      setDetailDelivery(updated);
    }
  };

  const handleViewIssue = (taskId: string) => {
    const match = deliveries.find((d) => d.taskId === taskId);
    if (match) setDetailDelivery(match);
    else showToast(`Opening issue for ${taskId}.`);
  };

  const handleReportIssue = () => {
    const candidate = activeDeliveries.find((d) => !d.issue);
    if (!candidate || !userId) {
      showToast("All active trips already have reported issues or none available.");
      return;
    }
    handleAction(candidate, "report_issue");
  };

  if (!userId) return null;

  return (
    <div className="agrivo-in-transit space-y-6">
      {toast ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--success" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      ) : null}

      <div className="agrivo-transit-header">
        <div>
          <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">In Transit</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
            Track active deliveries, monitor ETA, and manage shipments currently on the road.
          </p>
        </div>
        <div className="agrivo-transit-header__actions">
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={refresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Locations
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => setShowLiveMap(true)}
          >
            <Map className="mr-2 h-4 w-4" />
            View Live Map
          </Button>
          <Button
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={handleReportIssue}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </div>
      </div>

      <InTransitStats summary={summary} />

      <div className="agrivo-transit-main-grid">
        <div className="agrivo-transit-main-left">
          <LiveDeliveryMap />

          <InTransitFilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            region={region}
            onRegionChange={setRegion}
            regions={regions}
            etaFilter={etaFilter}
            onEtaFilterChange={setEtaFilter}
            driver={driver}
            onDriverChange={setDriver}
            drivers={driverNames}
          />

          {filteredDeliveries.length > 0 ? (
            <div className="agrivo-transit-list">
              {filteredDeliveries.map((delivery) => (
                <InTransitDeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  onAction={handleAction}
                />
              ))}
            </div>
          ) : activeDeliveries.length > 0 ? (
            <div className="agrivo-dashboard-panel agrivo-transit-empty-filter">
              <p className="text-sm text-[#5F6F64]">No in-transit deliveries match your filters.</p>
            </div>
          ) : (
            <div className="agrivo-dashboard-panel">
              <div className="agrivo-dashboard-empty agrivo-transit-empty">
                <Truck className="h-10 w-10 text-[#86efac]" strokeWidth={1.5} />
                <h3 className="agrivo-heading mt-4 text-lg font-bold text-[#102018]">
                  No deliveries in transit
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#5F6F64]">
                  Collected deliveries will appear here once drivers start moving toward buyers.
                </p>
                <Button
                  className="mt-5 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
                  onClick={() => navigate(getLogisticsSectionHash("pickup"))}
                >
                  View Pickup Tasks
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="agrivo-transit-main-right">
          <ActiveDriversCard drivers={drivers} />
          <EtaAlertsCard alerts={etaAlerts} />
          <RouteProgressCard summary={routeProgress} />
          <IssueCenterCard issues={issues} onViewIssue={handleViewIssue} />
        </aside>
      </div>

      <TransitDetailsModal
        delivery={detailDelivery}
        open={Boolean(detailDelivery)}
        onOpenChange={(open) => !open && setDetailDelivery(null)}
      />

      <TransitRouteModal
        delivery={routeDelivery ?? (showLiveMap ? activeDeliveries[0] ?? null : null)}
        open={Boolean(routeDelivery) || showLiveMap}
        onOpenChange={(open) => {
          if (!open) {
            setRouteDelivery(null);
            setShowLiveMap(false);
          }
        }}
      />
    </div>
  );
}
