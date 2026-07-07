import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import {
  formatTransitQuantity,
  type InTransitDelivery,
} from "../../../utils/inTransitStorage";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { EtaBadge } from "./EtaBadge";
import { TransitStatusBadge } from "./TransitStatusBadge";
import { TransitTimeline } from "./TransitTimeline";

export function TransitDetailsModal({
  delivery,
  open,
  onOpenChange,
}: {
  delivery: InTransitDelivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-assigned-details-dialog sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
              {delivery.taskId}
            </DialogTitle>
            <TransitStatusBadge status={delivery.status} />
            <EtaBadge eta={delivery.eta} etaStatus={delivery.etaStatus} />
          </div>
          <DialogDescription className="text-sm text-[#5F6F64]">
            {delivery.pickupLocation} → {delivery.dropoffLocation}
          </DialogDescription>
        </DialogHeader>

        <div className="agrivo-assigned-details-grid">
          <section>
            <h4 className="agrivo-assigned-details-section-title">Shipment</h4>
            <dl className="agrivo-assigned-details-list">
              <div>
                <dt>Driver</dt>
                <dd>{delivery.driverName}</dd>
              </div>
              <div>
                <dt>Driver phone</dt>
                <dd>{delivery.driverPhone}</dd>
              </div>
              <div>
                <dt>Vehicle</dt>
                <dd>{delivery.vehicle}</dd>
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
          </section>
          <section>
            <h4 className="agrivo-assigned-details-section-title">Cargo &amp; parties</h4>
            <dl className="agrivo-assigned-details-list">
              <div>
                <dt>Farmer</dt>
                <dd>{delivery.farmerName}</dd>
              </div>
              <div>
                <dt>Buyer</dt>
                <dd>{delivery.buyerName}</dd>
              </div>
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
                <dd>{formatTransitQuantity(delivery)}</dd>
              </div>
            </dl>
          </section>
        </div>

        {delivery.notes || delivery.issue ? (
          <div className="agrivo-assigned-details-notes">
            {delivery.issue ? (
              <p className="text-sm font-semibold text-[#c2410c]">Issue: {delivery.issue}</p>
            ) : null}
            {delivery.notes ? (
              <p className="mt-1 text-sm leading-6 text-[#33443a]">{delivery.notes}</p>
            ) : null}
          </div>
        ) : null}

        <section>
          <h4 className="agrivo-assigned-details-section-title">Delivery timeline</h4>
          <TransitTimeline status={delivery.status} />
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
