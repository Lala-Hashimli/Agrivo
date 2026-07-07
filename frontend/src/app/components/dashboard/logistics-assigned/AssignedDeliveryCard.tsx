import { ArrowRight } from "lucide-react";
import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import {
  formatAssignedQuantity,
  type AssignedDelivery,
  type AssignedDeliveryAction,
} from "../../../utils/assignedDeliveriesStorage";
import { DeliveryCardActions } from "./DeliveryCardActions";
import { DeliveryStatusBadge } from "./DeliveryStatusBadge";
import { PriorityBadge } from "./PriorityBadge";

interface AssignedDeliveryCardProps {
  delivery: AssignedDelivery;
  onAction: (delivery: AssignedDelivery, action: AssignedDeliveryAction) => void;
}

export function AssignedDeliveryCard({ delivery, onAction }: AssignedDeliveryCardProps) {
  return (
    <article className="agrivo-assigned-card">
      <div className="agrivo-assigned-card__top">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">
              {delivery.taskId}
            </p>
            <PriorityBadge priority={delivery.priority} />
          </div>
          <p className="mt-1 text-xs text-[#6b7a70]">{delivery.assignedAt}</p>
        </div>
        <DeliveryStatusBadge status={delivery.status} />
      </div>

      <div className="agrivo-assigned-card__route">
        <h3 className="agrivo-heading flex flex-wrap items-center gap-1.5 text-base font-bold text-[#102018] sm:text-lg">
          <span>{delivery.pickupLocation}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#43A047]" />
          <span>{delivery.dropoffLocation}</span>
        </h3>
      </div>

      <dl className="agrivo-assigned-card__details">
        <div>
          <dt>Farmer</dt>
          <dd>{delivery.farmerName}</dd>
        </div>
        <div>
          <dt>Buyer</dt>
          <dd>{delivery.buyerName}</dd>
        </div>
        <div>
          <dt>Product</dt>
          <dd>{delivery.productName}</dd>
        </div>
        <div>
          <dt>Sort</dt>
          <dd>
            <ProductVarietyBadge variety={delivery.variety} showLabel={false} size="sm" />
          </dd>
        </div>
        <div>
          <dt>Quantity</dt>
          <dd>{formatAssignedQuantity(delivery)}</dd>
        </div>
        <div>
          <dt>Pickup</dt>
          <dd>{delivery.pickupTime}</dd>
        </div>
        <div>
          <dt>ETA</dt>
          <dd>{delivery.eta}</dd>
        </div>
        <div>
          <dt>Driver</dt>
          <dd>{delivery.driverName}</dd>
        </div>
        <div>
          <dt>Vehicle</dt>
          <dd>{delivery.vehicle}</dd>
        </div>
      </dl>

      <DeliveryCardActions delivery={delivery} onAction={onAction} />
    </article>
  );
}
