import { CheckCircle2, Route, Truck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { isApiMode } from "../../../config/dataMode";
import {
  getLogisticsOverview,
  getDeliveries,
  updateDeliveryStatus as updateDeliveryStatusApi,
  type ApiDelivery,
} from "../../../api/logisticsApi";
import {
  computeLogisticsSummary,
  DELIVERY_STATUS_LABELS,
  filterDeliveryTasks,
  getDeliveryRegions,
  getDeliveryTasks,
  getLogisticsSectionHash,
  NEXT_STATUS,
  resolveLogisticsUserId,
  seedLogisticsPerformance,
  seedTodayRoute,
  seedUrgentAlerts,
  updateDeliveryTaskStatus,
  type DeliveryDateFilter,
  type DeliveryPriorityFilter,
  type DeliveryStatusFilter,
  type DeliveryTask,
  type DeliveryTaskStatus,
} from "../../utils/logisticsDashboardStorage";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DeliveryTaskItem } from "./logistics-overview/DeliveryTaskItem";
import { DeliveryTasksFilterBar } from "./logistics-overview/DeliveryTasksFilterBar";
import {
  DeliveryTasksCard,
  DeliveryTasksEmptyState,
  LogisticsOverviewLeftColumn,
  LogisticsOverviewMainGrid,
  LogisticsOverviewRightColumn,
} from "./logistics-overview/LogisticsOverviewLayout";
import { OverviewStats } from "./logistics-overview/OverviewStats";
import { PerformanceSummaryCard } from "./logistics-overview/PerformanceSummaryCard";
import { QuickActionsCard } from "./logistics-overview/QuickActionsCard";
import { RouteSummaryCard } from "./logistics-overview/RouteSummaryCard";
import { UrgentAlertsCard } from "./logistics-overview/UrgentAlertsCard";

function navigate(hash: string) {
  window.location.hash = hash;
}

export function LogisticsOverviewPage() {
  const { user } = useAuth();
  const userId = resolveLogisticsUserId(user);

  const [tasks, setTasks] = useState<DeliveryTask[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DeliveryStatusFilter>("all");
  const [region, setRegion] = useState("all");
  const [dateFilter, setDateFilter] = useState<DeliveryDateFilter>("today");
  const [priority, setPriority] = useState<DeliveryPriorityFilter>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [detailTask, setDetailTask] = useState<DeliveryTask | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiOverview, setApiOverview] = useState<{
    assignedToday: number;
    pickupPending: number;
    inTransit: number;
    completedToday: number;
    delayed: number;
    totalStops: number;
  } | null>(null);

  const route = useMemo(() => seedTodayRoute(), []);
  const alerts = useMemo(() => seedUrgentAlerts(), []);
  const performance = useMemo(() => seedLogisticsPerformance(), []);

  const refresh = useCallback(() => {
    if (!userId) return;
    if (isApiMode) {
      Promise.all([getDeliveries(), getLogisticsOverview()])
        .then(([deliveries, overview]) => {
          setTasks(deliveries.map(mapApiDeliveryToTask));
          setApiOverview({
            assignedToday: overview.assigned,
            pickupPending: overview.pickupScheduled,
            inTransit: overview.inTransit,
            completedToday: overview.delivered,
            delayed: overview.delayed,
            totalStops: overview.total,
          });
        })
        .catch((error) =>
          setApiError(error instanceof Error ? error.message : "Failed to load logistics overview."),
        );
      return;
    }
    setTasks(getDeliveryTasks(userId));
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const summary = useMemo(
    () => (isApiMode && apiOverview ? apiOverview : computeLogisticsSummary(tasks)),
    [tasks, apiOverview],
  );
  const regions = useMemo(() => getDeliveryRegions(tasks), [tasks]);

  const filteredTasks = useMemo(
    () => filterDeliveryTasks(tasks, { search, status, region, dateFilter, priority }),
    [tasks, search, status, region, dateFilter, priority],
  );

  const activeTasks = useMemo(
    () => filteredTasks.filter((task) => task.status !== "delivered"),
    [filteredTasks],
  );

  const handleStatusAdvance = (task: DeliveryTask) => {
    if (!userId) return;
    if (isApiMode) {
      const next = NEXT_STATUS[task.status];
      if (!next) return;
      updateDeliveryStatusApi(task.id, next)
        .then(() => refresh())
        .catch((error) =>
          setApiError(error instanceof Error ? error.message : "Failed to update delivery status."),
        );
      return;
    }
    const next = NEXT_STATUS[task.status];
    if (!next) {
      showToast(`Task ${task.taskId} is already ${DELIVERY_STATUS_LABELS[task.status]}.`);
      return;
    }
    const updated = updateDeliveryTaskStatus(userId, task.id, next);
    setTasks(updated);
    showToast(`Task ${task.taskId} updated to ${DELIVERY_STATUS_LABELS[next]}.`);
    if (detailTask?.id === task.id) {
      setDetailTask({ ...task, status: next });
    }
  };

  const handleQuickStatus = (targetStatus: DeliveryTaskStatus, label: string) => {
    const candidate = tasks.find((task) => task.status !== "delivered");
    if (!candidate || !userId) {
      showToast("No active task available to update.");
      return;
    }
    const updated = updateDeliveryTaskStatus(userId, candidate.id, targetStatus);
    setTasks(updated);
    showToast(`${candidate.taskId} marked as ${label}.`);
  };

  if (!userId) return null;

  const hasTasks = tasks.length > 0;

  return (
    <div className="agrivo-logistics-overview">
      {toast ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--success" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      ) : null}
      {apiError ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c]">
          {apiError}
        </div>
      ) : null}

      <div className="agrivo-logistics-overview-header">
        <div>
          <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">
            Logistics Overview
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
            Monitor assigned deliveries, manage pickups, track routes, and update shipment progress.
          </p>
        </div>
        <div className="agrivo-logistics-overview-header-actions">
          <Button
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={() => navigate(getLogisticsSectionHash("pickup"))}
          >
            <Truck className="mr-2 h-4 w-4" />
            Assign Pickup
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => navigate(getLogisticsSectionHash("assigned"))}
          >
            View Deliveries
          </Button>
          <Button
            variant="outline"
            className="hidden rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC] sm:inline-flex"
            onClick={() => showToast("Route optimization will be available in the next update.")}
          >
            <Route className="mr-2 h-4 w-4" />
            Optimize Route
          </Button>
        </div>
      </div>

      <OverviewStats summary={summary} />

      <LogisticsOverviewMainGrid>
        <LogisticsOverviewLeftColumn>
          <RouteSummaryCard route={route} />

          {hasTasks ? (
            <DeliveryTasksCard taskCount={activeTasks.length}>
              <DeliveryTasksFilterBar
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                region={region}
                onRegionChange={setRegion}
                regions={regions}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                priority={priority}
                onPriorityChange={setPriority}
              />

              {activeTasks.length > 0 ? (
                <div className="agrivo-logistics-tasks-list">
                  {activeTasks.map((task) => (
                    <DeliveryTaskItem
                      key={task.id}
                      task={task}
                      onViewDetails={setDetailTask}
                      onUpdateStatus={handleStatusAdvance}
                      onOpenRoute={() => showToast(`Opening route for ${task.taskId}…`)}
                      onContact={() => showToast(`Contact options for ${task.taskId} will open here.`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="agrivo-logistics-tasks-empty-filter">
                  <p className="text-sm text-[#5F6F64]">No tasks match your filters.</p>
                </div>
              )}
            </DeliveryTasksCard>
          ) : (
            <DeliveryTasksEmptyState onAssignPickup={() => navigate(getLogisticsSectionHash("pickup"))} />
          )}
        </LogisticsOverviewLeftColumn>

        <LogisticsOverviewRightColumn>
          <QuickActionsCard
            onAssignPickup={() => navigate(getLogisticsSectionHash("pickup"))}
            onMarkPickedUp={() => handleQuickStatus("picked_up", "Picked Up")}
            onMarkInTransit={() => handleQuickStatus("in_transit", "In Transit")}
            onMarkDelivered={() => handleQuickStatus("delivered", "Delivered")}
            onContactFarmer={() => showToast("Farmer contact will open here.")}
            onContactBuyer={() => showToast("Buyer contact will open here.")}
          />
          <UrgentAlertsCard alerts={alerts} />
          <PerformanceSummaryCard performance={performance} />
        </LogisticsOverviewRightColumn>
      </LogisticsOverviewMainGrid>

      <Dialog open={Boolean(detailTask)} onOpenChange={(open) => !open && setDetailTask(null)}>
        <DialogContent className="agrivo-profile-dialog sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
              {detailTask ? `Task ${detailTask.taskId}` : "Delivery task"}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#5F6F64]">
              {detailTask
                ? `${detailTask.pickupLocation} → ${detailTask.dropoffLocation}`
                : null}
            </DialogDescription>
          </DialogHeader>
          {detailTask ? (
            <dl className="agrivo-logistics-task-detail-grid">
              <div>
                <dt>Product</dt>
                <dd>
                  {detailTask.productName} · {detailTask.quantity} {detailTask.unit}
                </dd>
              </div>
              <div>
                <dt>Pickup time</dt>
                <dd>{detailTask.pickupTime}</dd>
              </div>
              <div>
                <dt>ETA</dt>
                <dd>{detailTask.eta}</dd>
              </div>
              <div>
                <dt>Driver</dt>
                <dd>{detailTask.driverName}</dd>
              </div>
              <div>
                <dt>Vehicle</dt>
                <dd>{detailTask.vehicle}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>{detailTask.region}</dd>
              </div>
            </dl>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={() => setDetailTask(null)}
            >
              Close
            </Button>
            {detailTask && detailTask.status !== "delivered" ? (
              <Button
                className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
                onClick={() => {
                  handleStatusAdvance(detailTask);
                }}
              >
                Update Status
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function mapApiDeliveryToTask(delivery: ApiDelivery): DeliveryTask {
  return {
    id: delivery.id,
    taskId: delivery.id.slice(-8).toUpperCase(),
    pickupLocation: delivery.pickupLocation ?? "Pickup location",
    dropoffLocation: delivery.dropoffLocation ?? "Dropoff location",
    productName: "Produce",
    quantity: 0,
    unit: "kg",
    pickupTime: delivery.pickupTime ? new Date(delivery.pickupTime).toLocaleTimeString() : "TBD",
    eta: delivery.eta ? new Date(delivery.eta).toLocaleTimeString() : "TBD",
    driverName: delivery.driverName ?? "Driver",
    vehicle: delivery.vehicle ?? "Vehicle",
    status:
      delivery.status === "pickup_started"
        ? "picked_up"
        : delivery.status === "pickup_scheduled"
          ? "pickup_scheduled"
          : delivery.status === "in_transit"
            ? "in_transit"
            : delivery.status === "delivered"
              ? "delivered"
              : delivery.status === "delayed"
                ? "delayed"
                : "assigned",
    priority: delivery.priority === "high" ? "high" : delivery.priority === "low" ? "low" : "normal",
    region: "Azerbaijan",
    dateLabel: "Today",
  };
}
