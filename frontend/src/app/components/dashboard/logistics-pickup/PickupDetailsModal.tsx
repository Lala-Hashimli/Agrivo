import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import {
  formatPickupQuantity,
  type PickupTask,
} from "../../../utils/pickupTasksStorage";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { PickupPriorityBadge } from "./PickupPriorityBadge";
import { PickupStatusBadge } from "./PickupStatusBadge";
import { PickupTimeline } from "./PickupTimeline";

interface PickupDetailsModalProps {
  task: PickupTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PickupDetailsModal({ task, open, onOpenChange }: PickupDetailsModalProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-assigned-details-dialog sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
              {task.taskId}
            </DialogTitle>
            <PickupStatusBadge status={task.status} />
            <PickupPriorityBadge priority={task.priority} />
          </div>
          <DialogDescription className="text-sm text-[#5F6F64]">
            {task.pickupLocation} → {task.destination}
          </DialogDescription>
        </DialogHeader>

        <div className="agrivo-assigned-details-grid">
          <section>
            <h4 className="agrivo-assigned-details-section-title">Farm &amp; contact</h4>
            <dl className="agrivo-assigned-details-list">
              <div>
                <dt>Farmer / farm</dt>
                <dd>{task.farmerName}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{task.farmerPhone}</dd>
              </div>
              <div>
                <dt>Pickup address</dt>
                <dd>{task.pickupAddress}</dd>
              </div>
              <div>
                <dt>Destination</dt>
                <dd>{task.destination}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>
                  {task.region} · {task.district}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h4 className="agrivo-assigned-details-section-title">Collection details</h4>
            <dl className="agrivo-assigned-details-list">
              <div>
                <dt>Product</dt>
                <dd>{task.productName}</dd>
              </div>
              <div>
                <dt>Sort</dt>
                <dd>
                  <ProductVarietyBadge variety={task.variety} size="sm" />
                </dd>
              </div>
              <div>
                <dt>Quantity</dt>
                <dd>{formatPickupQuantity(task)}</dd>
              </div>
              <div>
                <dt>Pickup time</dt>
                <dd>{task.pickupTime}</dd>
              </div>
              <div>
                <dt>Pickup window</dt>
                <dd>{task.pickupWindow}</dd>
              </div>
              <div>
                <dt>Driver</dt>
                <dd>{task.driverName || "Not assigned"}</dd>
              </div>
              <div>
                <dt>Vehicle</dt>
                <dd>{task.vehicle || "—"}</dd>
              </div>
            </dl>
          </section>
        </div>

        {task.notes ? (
          <div className="agrivo-assigned-details-notes">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Notes</p>
            <p className="mt-1 text-sm leading-6 text-[#33443a]">{task.notes}</p>
          </div>
        ) : null}

        <section>
          <h4 className="agrivo-assigned-details-section-title">Pickup checklist / timeline</h4>
          <PickupTimeline status={task.status} />
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
