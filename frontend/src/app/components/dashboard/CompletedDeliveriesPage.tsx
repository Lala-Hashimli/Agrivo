import { BarChart3, CheckCircle2, Download, Truck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  computeCompletedSummary,
  computePerformanceSummary,
  downloadCSV,
  exportCompletedDeliveriesToCSV,
  filterCompletedDeliveries,
  getCompletedDeliveries,
  getCompletedDrivers,
  getCompletedRegions,
  getLogisticsSectionHash,
  resolveCompletedDeliveriesUserId,
  seedRecentFeedback,
  seedTopRoutes,
  type CompletedDateFilter,
  type CompletedDelivery,
  type CompletedRatingFilter,
  type CompletedStatusFilter,
} from "../../utils/completedDeliveriesStorage";
import { Button } from "../ui/button";
import { CompletedDeliveriesTable } from "./logistics-completed/CompletedDeliveriesTable";
import { CompletedDeliveryMobileCards } from "./logistics-completed/CompletedDeliveryMobileCards";
import { CompletedDeliveryDetailsModal } from "./logistics-completed/CompletedDeliveryDetailsModal";
import { CompletedDeliveryFilterBar } from "./logistics-completed/CompletedDeliveryFilterBar";
import { CompletedDeliveryStats } from "./logistics-completed/CompletedDeliveryStats";
import { PerformanceSummaryCard } from "./logistics-completed/PerformanceSummaryCard";
import { RecentFeedbackCard } from "./logistics-completed/RecentFeedbackCard";
import { ReportsCard } from "./logistics-completed/ReportsCard";
import { TopRoutesCard } from "./logistics-completed/TopRoutesCard";

function navigate(hash: string) {
  window.location.hash = hash;
}

export function CompletedDeliveriesPage() {
  const { user } = useAuth();
  const userId = resolveCompletedDeliveriesUserId(user);

  const [deliveries, setDeliveries] = useState<CompletedDelivery[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CompletedStatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<CompletedDateFilter>("all");
  const [region, setRegion] = useState("all");
  const [driver, setDriver] = useState("all");
  const [ratingFilter, setRatingFilter] = useState<CompletedRatingFilter>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [detailDelivery, setDetailDelivery] = useState<CompletedDelivery | null>(null);

  const topRoutes = useMemo(() => seedTopRoutes(), []);
  const recentFeedback = useMemo(() => seedRecentFeedback(), []);

  const refresh = useCallback(() => {
    if (!userId) return;
    setDeliveries(getCompletedDeliveries(userId));
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const summary = useMemo(() => computeCompletedSummary(deliveries), [deliveries]);
  const performance = useMemo(() => computePerformanceSummary(deliveries), [deliveries]);
  const regions = useMemo(() => getCompletedRegions(deliveries), [deliveries]);
  const drivers = useMemo(() => getCompletedDrivers(deliveries), [deliveries]);

  const filteredDeliveries = useMemo(
    () =>
      filterCompletedDeliveries(deliveries, {
        search,
        status,
        region,
        dateFilter,
        driver,
        ratingFilter,
      }),
    [deliveries, search, status, region, dateFilter, driver, ratingFilter],
  );

  const handleExport = () => {
    const csv = exportCompletedDeliveriesToCSV(filteredDeliveries);
    downloadCSV(csv, "agrivo-completed-deliveries.csv");
    showToast(`Exported ${filteredDeliveries.length} delivery records.`);
  };

  const handleDownloadReceipt = (delivery: CompletedDelivery) => {
    showToast(`Receipt for ${delivery.taskId} will download shortly.`);
  };

  if (!userId) return null;

  return (
    <div className="agrivo-completed-deliveries space-y-6">
      {toast ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--success" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      ) : null}

      <div className="agrivo-completed-header">
        <div>
          <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">
            Completed Deliveries
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
            Review finished deliveries, delivery proof, customer feedback, and logistics performance.
          </p>
        </div>
        <div className="agrivo-completed-header__actions">
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={() =>
              document
                .querySelector(".agrivo-completed-main-right")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Performance Summary
          </Button>
        </div>
      </div>

      <CompletedDeliveryStats summary={summary} />

      <CompletedDeliveryFilterBar
        search={search}
        onSearchChange={setSearch}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        region={region}
        onRegionChange={setRegion}
        regions={regions}
        driver={driver}
        onDriverChange={setDriver}
        drivers={drivers}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="agrivo-completed-main-grid">
        <div className="agrivo-completed-main-left">
          {filteredDeliveries.length > 0 ? (
            <>
              <CompletedDeliveriesTable
                deliveries={filteredDeliveries}
                onView={setDetailDelivery}
                onDownloadReceipt={handleDownloadReceipt}
              />
              <CompletedDeliveryMobileCards
                deliveries={filteredDeliveries}
                onView={setDetailDelivery}
              />
            </>
          ) : deliveries.length > 0 ? (
            <div className="agrivo-dashboard-panel agrivo-completed-empty-filter">
              <p className="text-sm text-[#5F6F64]">No completed deliveries match your filters.</p>
            </div>
          ) : (
            <div className="agrivo-dashboard-panel">
              <div className="agrivo-dashboard-empty agrivo-completed-empty">
                <Truck className="h-10 w-10 text-[#86efac]" strokeWidth={1.5} />
                <h3 className="agrivo-heading mt-4 text-lg font-bold text-[#102018]">
                  No completed deliveries yet
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#5F6F64]">
                  Finished deliveries will appear here after drivers mark them as delivered.
                </p>
                <Button
                  className="mt-5 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
                  onClick={() => navigate(getLogisticsSectionHash("in-transit"))}
                >
                  View In Transit
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="agrivo-completed-main-right">
          <PerformanceSummaryCard summary={performance} />
          <TopRoutesCard routes={topRoutes} />
          <RecentFeedbackCard feedback={recentFeedback} />
          <ReportsCard
            onExport={handleExport}
            onDownloadMonthly={() => showToast("Monthly report download started.")}
            onDownloadDriver={() => showToast("Driver performance report download started.")}
          />
        </aside>
      </div>

      <CompletedDeliveryDetailsModal
        delivery={detailDelivery}
        open={Boolean(detailDelivery)}
        onOpenChange={(open) => !open && setDetailDelivery(null)}
        onDownloadReceipt={handleDownloadReceipt}
      />
    </div>
  );
}
