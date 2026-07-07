import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import {
  formatAssignedQuantity,
  type AssignedDelivery,
} from "../../../utils/assignedDeliveriesStorage";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { DeliveryStatusBadge } from "./DeliveryStatusBadge";
import { DeliveryTimeline } from "./DeliveryTimeline";
import { PriorityBadge } from "./PriorityBadge";

interface DeliveryDetailsModalProps {
  delivery: AssignedDelivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeliveryDetailsModal({
  delivery,
  open,
  onOpenChange,
}: DeliveryDetailsModalProps) {
  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-assigned-details-dialog sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
              {delivery.taskId}
            </DialogTitle>
            <DeliveryStatusBadge status={delivery.status} />
            <PriorityBadge priority={delivery.priority} />
          </div>
          <DialogDescription className="text-sm text-[#5F6F64]">
            {delivery.pickupLocation} → {delivery.dropoffLocation}
          </DialogDescription>
        </DialogHeader>

        <div className="agrivo-assigned-details-grid">
          <section>
            <h4 className="agrivo-assigned-details-section-title">Parties</h4>
            <dl className="agrivo-assigned-details-list">
              <div>
                <dt>Farmer</dt>
                <dd>{delivery.farmerName}</dd>
              </div>
              <div>
                <dt>Farmer contact</dt>
                <dd>{delivery.farmerPhone}</dd>
              </div>
              <div>
                <dt>Buyer</dt>
                <dd>{delivery.buyerName}</dd>
              </div>
              <div>
                <dt>Buyer contact</dt>
                <dd>{delivery.buyerPhone}</dd>
              </div>
              <div>
                <dt>Buyer type</dt>
                <dd>{delivery.buyerType}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h4 className="agrivo-assigned-details-section-title">Route &amp; cargo</h4>
            <dl className="agrivo-assigned-details-list">
              <div>
                <dt>Pickup address</dt>
                <dd>{delivery.pickupAddress}</dd>
              </div>
              <div>
                <dt>Drop-off address</dt>
                <dd>{delivery.dropoffAddress}</dd>
              </div>
              <div>
                <dt>Product</dt>
                <dd>{delivery.productName}</dd>
              </div>
              <div>
                <dt>Sort</dt>
                <dd>
                  <ProductVarietyBadge variety={delivery.variety} size="sm" />
                </dd>
              </div>
              <div>
                <dt>Quantity</dt>
                <dd>{formatAssignedQuantity(delivery)}</dd>
              </div>
              <div>
                <dt>Pickup time</dt>
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
              <div>
                <dt>Region</dt>
                <dd>{delivery.region}</dd>
              </div>
            </dl>
          </section>
        </div>

        {delivery.notes ? (
          <div className="agrivo-assigned-details-notes">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Notes</p>
            <p className="mt-1 text-sm leading-6 text-[#33443a]">{delivery.notes}</p>
          </div>
        ) : null}

        <section>
          <h4 className="agrivo-assigned-details-section-title">Delivery timeline</h4>
          <DeliveryTimeline status={delivery.status} />
        </section>

        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
