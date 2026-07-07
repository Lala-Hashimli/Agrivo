import { ClipboardList, MapPinPlus } from "lucide-react";
import type { ReactNode } from "react";

export function LogisticsOverviewMainGrid({ children }: { children: ReactNode }) {
  return <div className="agrivo-logistics-overview-grid">{children}</div>;
}

export function LogisticsOverviewLeftColumn({ children }: { children: ReactNode }) {
  return <div className="agrivo-logistics-overview-left">{children}</div>;
}

export function LogisticsOverviewRightColumn({ children }: { children: ReactNode }) {
  return <div className="agrivo-logistics-overview-right">{children}</div>;
}

export function DeliveryTasksCard({
  children,
  taskCount,
}: {
  children: ReactNode;
  taskCount: number;
}) {
  return (
    <section className="agrivo-logistics-tasks-card agrivo-dashboard-panel">
      <div className="agrivo-logistics-tasks-card__header">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-[#43A047]" />
          <h3 className="agrivo-heading text-lg font-bold text-[#102018]">Active Delivery Tasks</h3>
        </div>
        <p className="text-sm text-[#6b7a70]">{taskCount} task{taskCount === 1 ? "" : "s"}</p>
      </div>
      {children}
    </section>
  );
}

export function DeliveryTasksEmptyState({ onAssignPickup }: { onAssignPickup: () => void }) {
  return (
    <div className="agrivo-dashboard-empty agrivo-logistics-tasks-empty">
      <MapPinPlus className="h-10 w-10 text-[#86efac]" strokeWidth={1.5} />
      <h4 className="agrivo-heading mt-4 text-lg font-bold text-[#102018]">No active deliveries</h4>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#5F6F64]">
        Assigned pickup and delivery tasks will appear here.
      </p>
      <button
        type="button"
        className="agrivo-button-soft mt-5 rounded-full bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D6A3B]"
        onClick={onAssignPickup}
      >
        Assign Pickup
      </button>
    </div>
  );
}
