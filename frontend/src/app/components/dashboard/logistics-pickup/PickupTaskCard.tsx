import { ArrowRight } from "lucide-react";
import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import {
  formatPickupQuantity,
  type PickupTask,
  type PickupTaskAction,
} from "../../../utils/pickupTasksStorage";
import { PickupCardActions } from "./PickupCardActions";
import { PickupPriorityBadge } from "./PickupPriorityBadge";
import { PickupStatusBadge } from "./PickupStatusBadge";

interface PickupTaskCardProps {
  task: PickupTask;
  onAction: (task: PickupTask, action: PickupTaskAction) => void;
}

export function PickupTaskCard({ task, onAction }: PickupTaskCardProps) {
  return (
    <article className="agrivo-pickup-card">
      <div className="agrivo-pickup-card__top">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">
              {task.taskId}
            </p>
            <PickupPriorityBadge priority={task.priority} />
          </div>
          <p className="mt-1 text-xs text-[#6b7a70]">{task.assignedAt}</p>
        </div>
        <PickupStatusBadge status={task.status} />
      </div>

      <div className="agrivo-pickup-card__route">
        <h3 className="agrivo-heading flex flex-wrap items-center gap-1.5 text-base font-bold text-[#102018] sm:text-lg">
          <span>{task.pickupLocation}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#43A047]" />
          <span>{task.destination}</span>
        </h3>
        <p className="mt-1 text-xs font-medium text-[#15803d]">Pickup at {task.pickupTime}</p>
      </div>

      <dl className="agrivo-pickup-card__details">
        <div>
          <dt>Farmer</dt>
          <dd>{task.farmerName}</dd>
        </div>
        <div>
          <dt>Product</dt>
          <dd>{task.productName}</dd>
        </div>
        <div>
          <dt>Sort</dt>
          <dd>
            <ProductVarietyBadge variety={task.variety} showLabel={false} size="sm" />
          </dd>
        </div>
        <div>
          <dt>Quantity</dt>
          <dd>{formatPickupQuantity(task)}</dd>
        </div>
        <div>
          <dt>Pickup Window</dt>
          <dd>{task.pickupWindow}</dd>
        </div>
        <div>
          <dt>Region</dt>
          <dd>{task.district}</dd>
        </div>
        <div>
          <dt>Driver</dt>
          <dd>{task.driverName || "Not assigned"}</dd>
        </div>
        <div>
          <dt>Vehicle</dt>
          <dd>{task.vehicle || "—"}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{task.farmerPhone}</dd>
        </div>
      </dl>

      {task.notes ? <p className="agrivo-pickup-card__notes">{task.notes}</p> : null}

      <PickupCardActions task={task} onAction={onAction} />
    </article>
  );
}
