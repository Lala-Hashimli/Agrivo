import { Camera, FileCheck, PenLine } from "lucide-react";
import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import {
  PROOF_STATUS_LABELS,
  formatCompletedQuantity,
  type CompletedDelivery,
} from "../../../utils/completedDeliveriesStorage";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { CompletedDeliveryTimeline } from "./CompletedDeliveryTimeline";
import { CompletionStatusBadge } from "./CompletionStatusBadge";
import { ProofBadge } from "./ProofBadge";
import { RatingDisplay } from "./RatingDisplay";

export function CompletedDeliveryDetailsModal({
  delivery,
  open,
  onOpenChange,
  onDownloadReceipt,
}: {
  delivery: CompletedDelivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadReceipt: (delivery: CompletedDelivery) => void;
}) {
  if (!delivery) return null;

  const hasProof = delivery.proofStatus !== "none";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-assigned-details-dialog sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
              {delivery.taskId}
            </DialogTitle>
            <CompletionStatusBadge status={delivery.status} />
            <RatingDisplay rating={delivery.rating} showEmpty />
          </div>
          <DialogDescription className="text-sm text-[#5F6F64]">
            {delivery.pickupLocation} → {delivery.dropoffLocation}
          </DialogDescription>
        </DialogHeader>

        <div className="agrivo-assigned-details-grid">
          <section>
            <h4 className="agrivo-assigned-details-section-title">Parties &amp; vehicle</h4>
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
                <dt>Driver</dt>
                <dd>{delivery.driverName}</dd>
              </div>
              <div>
                <dt>Vehicle</dt>
                <dd>{delivery.vehicle}</dd>
              </div>
              <div>
                <dt>Pickup address</dt>
                <dd>{delivery.pickupAddress}</dd>
              </div>
              <div>
                <dt>Drop-off address</dt>
                <dd>{delivery.dropoffAddress}</dd>
              </div>
            </dl>
          </section>
          <section>
            <h4 className="agrivo-assigned-details-section-title">Delivery record</h4>
            <dl className="agrivo-assigned-details-list">
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
                <dd>{formatCompletedQuantity(delivery)}</dd>
              </div>
              <div>
                <dt>Pickup time</dt>
                <dd>{delivery.pickupTime}</dd>
              </div>
              <div>
                <dt>Completed at</dt>
                <dd>{delivery.completedAt}</dd>
              </div>
              <div>
                <dt>Total duration</dt>
                <dd>{delivery.deliveryDuration}</dd>
              </div>
              <div>
                <dt>Distance</dt>
                <dd>{delivery.distance}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="agrivo-completed-proof-section">
          <h4 className="agrivo-assigned-details-section-title">Delivery proof</h4>
          {hasProof ? (
            <div className="agrivo-completed-proof-card">
              <div className="agrivo-completed-proof-thumb">
                <Camera className="h-8 w-8 text-[#86efac]" />
                <span>Proof thumbnail</span>
              </div>
              <dl className="agrivo-assigned-details-list">
                <div>
                  <dt>Proof type</dt>
                  <dd>{PROOF_STATUS_LABELS[delivery.proofStatus]}</dd>
                </div>
                <div>
                  <dt>Received by</dt>
                  <dd>{delivery.receivedBy}</dd>
                </div>
                <div>
                  <dt>Completed at</dt>
                  <dd>{delivery.completedAt}</dd>
                </div>
                <div>
                  <dt>Signature</dt>
                  <dd className="flex items-center gap-1">
                    {delivery.proofStatus === "photo_signature" ||
                    delivery.proofStatus === "signature" ? (
                      <>
                        <PenLine className="h-3.5 w-3.5 text-[#16a34a]" /> Received
                      </>
                    ) : (
                      "Not required"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="agrivo-completed-proof-warning">
              <FileCheck className="h-4 w-4 shrink-0" />
              No proof uploaded
            </p>
          )}
        </section>

        {delivery.feedback ? (
          <div className="agrivo-assigned-details-notes">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">
              Buyer feedback
            </p>
            <p className="mt-1 text-sm leading-6 text-[#33443a]">&ldquo;{delivery.feedback}&rdquo;</p>
          </div>
        ) : null}

        {delivery.issue || delivery.notes ? (
          <div className="agrivo-assigned-details-notes">
            {delivery.issue ? (
              <p className="text-sm font-semibold text-[#c2410c]">Issue: {delivery.issue}</p>
            ) : null}
            {delivery.notes ? (
              <p className="mt-1 text-sm text-[#33443a]">{delivery.notes}</p>
            ) : null}
          </div>
        ) : null}

        <section>
          <h4 className="agrivo-assigned-details-section-title">Delivery timeline</h4>
          <CompletedDeliveryTimeline />
        </section>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onDownloadReceipt(delivery)}
          >
            Download Receipt
          </Button>
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
