import { MapPin, Navigation } from "lucide-react";
import { todayRouteData } from "../../../data/logisticsRoutes";
import { RouteMap } from "../../logistics/RouteMap";
import type { PickupTask } from "../../../utils/pickupTasksStorage";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

interface PickupRouteModalProps {
  task: PickupTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PickupRouteModal({ task, open, onOpenChange }: PickupRouteModalProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-assigned-route-dialog sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
            Pickup route · {task.taskId}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5F6F64]">
            {task.pickupLocation} → {task.destination}
          </DialogDescription>
        </DialogHeader>

        <div className="agrivo-assigned-route-summary">
          <div className="agrivo-assigned-route-point">
            <MapPin className="h-4 w-4 text-[#43A047]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Farm pickup</p>
              <p className="text-sm font-semibold text-[#102018]">{task.pickupLocation}</p>
              <p className="text-xs text-[#5F6F64]">{task.pickupAddress}</p>
            </div>
          </div>
          <div className="agrivo-assigned-route-point">
            <Navigation className="h-4 w-4 text-[#14532D]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Destination</p>
              <p className="text-sm font-semibold text-[#102018]">{task.destination}</p>
              <p className="text-xs text-[#5F6F64]">ETA after collection: {task.pickupTime}</p>
            </div>
          </div>
        </div>

        <RouteMap route={todayRouteData} className="agrivo-assigned-route-map" />

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
