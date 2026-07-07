import { ArrowRight, Navigation, Package, Phone } from "lucide-react";
import {
  DELIVERY_PRIORITY_LABELS,
  formatTaskQuantity,
  type DeliveryTask,
} from "../../../utils/logisticsDashboardStorage";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import { LogisticsDeliveryStatusBadge } from "./LogisticsDeliveryStatusBadge";

interface DeliveryTaskItemProps {
  task: DeliveryTask;
  onViewDetails: (task: DeliveryTask) => void;
  onUpdateStatus: (task: DeliveryTask) => void;
  onOpenRoute: (task: DeliveryTask) => void;
  onContact: (task: DeliveryTask) => void;
}

export function DeliveryTaskItem({
  task,
  onViewDetails,
  onUpdateStatus,
  onOpenRoute,
  onContact,
}: DeliveryTaskItemProps) {
  const priorityTone =
    task.priority === "high"
      ? "agrivo-logistics-priority--high"
      : task.priority === "normal"
        ? "agrivo-logistics-priority--normal"
        : "agrivo-logistics-priority--low";

  return (
    <article className="agrivo-logistics-task-card">
      <div className="agrivo-logistics-task-card__top">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">
              {task.taskId}
            </p>
            <span className={cn("agrivo-logistics-priority", priorityTone)}>
              {DELIVERY_PRIORITY_LABELS[task.priority]} priority
            </span>
          </div>
          <h4 className="agrivo-heading mt-1 flex flex-wrap items-center gap-1.5 text-base font-bold text-[#102018] sm:text-lg">
            <span className="truncate">{task.pickupLocation}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#43A047]" />
            <span className="truncate">{task.dropoffLocation}</span>
          </h4>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5F6F64]">
            <Package className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
            {task.productName} · {formatTaskQuantity(task)}
          </p>
        </div>
        <LogisticsDeliveryStatusBadge status={task.status} />
      </div>

      <dl className="agrivo-logistics-task-card__meta">
        <div>
          <dt>Pickup</dt>
          <dd>{task.pickupTime}</dd>
        </div>
        <div>
          <dt>ETA</dt>
          <dd>{task.eta}</dd>
        </div>
        <div>
          <dt>Driver</dt>
          <dd>{task.driverName}</dd>
        </div>
        <div>
          <dt>Vehicle</dt>
          <dd>{task.vehicle}</dd>
        </div>
      </dl>

      <div className="agrivo-logistics-task-card__actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={() => onViewDetails(task)}
        >
          View Details
        </Button>
        {task.status !== "delivered" ? (
          <Button
            type="button"
            size="sm"
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={() => onUpdateStatus(task)}
          >
            Update Status
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={() => onOpenRoute(task)}
        >
          <Navigation className="mr-1.5 h-3.5 w-3.5" />
          Open Route
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={() => onContact(task)}
        >
          <Phone className="mr-1.5 h-3.5 w-3.5" />
          Contact
        </Button>
      </div>
    </article>
  );
}
