import { ArrowRight, AlertTriangle } from "lucide-react";
import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import {
  formatTransitQuantity,
  type InTransitDelivery,
  type InTransitAction,
} from "../../../utils/inTransitStorage";
import { EtaBadge } from "./EtaBadge";
import { TransitCardActions } from "./TransitCardActions";
import { TransitStatusBadge } from "./TransitStatusBadge";

export function InTransitDeliveryCard({
  delivery,
  onAction,
}: {
  delivery: InTransitDelivery;
  onAction: (delivery: InTransitDelivery, action: InTransitAction) => void;
}) {
  return (
    <article className="agrivo-transit-card">
      <div className="agrivo-transit-card__top">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">
            {delivery.taskId}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <TransitStatusBadge status={delivery.status} />
          <EtaBadge eta={delivery.eta} etaStatus={delivery.etaStatus} />
          {delivery.etaStatus === "delay_risk" ? (
            <span className="agrivo-transit-delay-risk">
              <AlertTriangle className="h-3 w-3" />
              Delay risk
            </span>
          ) : null}
        </div>
      </div>

      <div className="agrivo-transit-card__route">
        <h3 className="agrivo-heading flex flex-wrap items-center gap-1.5 text-base font-bold text-[#102018] sm:text-lg">
          <span>{delivery.pickupLocation}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#43A047]" />
          <span>{delivery.dropoffLocation}</span>
        </h3>
      </div>

      <dl className="agrivo-transit-card__details">
        <div>
          <dt>Driver</dt>
          <dd>{delivery.driverName}</dd>
        </div>
        <div>
          <dt>Vehicle</dt>
          <dd>{delivery.vehicle}</dd>
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
          <dd>{formatTransitQuantity(delivery)}</dd>
        </div>
        <div>
          <dt>Current location</dt>
          <dd>{delivery.currentLocation}</dd>
        </div>
        <div>
          <dt>Distance remaining</dt>
          <dd>{delivery.distanceRemaining}</dd>
        </div>
        <div>
          <dt>Progress</dt>
          <dd>{delivery.progress}%</dd>
        </div>
      </dl>

      <div className="agrivo-transit-card__progress">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-[#5F6F64]">Route progress</p>
          <p className="text-sm font-bold text-[#14532D]">{delivery.progress}%</p>
        </div>
        <div className="agrivo-transit-card__progress-track">
          <span style={{ width: `${delivery.progress}%` }} />
        </div>
      </div>

      {delivery.issue ? (
        <p className="agrivo-transit-card__issue">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {delivery.issue}
        </p>
      ) : null}

      <TransitCardActions delivery={delivery} onAction={onAction} />
    </article>
  );
}
