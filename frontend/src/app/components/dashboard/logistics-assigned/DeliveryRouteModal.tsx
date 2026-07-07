import { MapPin, Navigation } from "lucide-react";
import { todayRouteData } from "../../../data/logisticsRoutes";
import { RouteMap } from "../../logistics/RouteMap";
import type { AssignedDelivery } from "../../../utils/assignedDeliveriesStorage";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

interface DeliveryRouteModalProps {
  delivery: AssignedDelivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeliveryRouteModal({ delivery, open, onOpenChange }: DeliveryRouteModalProps) {
  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-assigned-route-dialog sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
            Route plan · {delivery.taskId}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5F6F64]">
            {delivery.pickupLocation} → {delivery.dropoffLocation}
          </DialogDescription>
        </DialogHeader>

        <div className="agrivo-assigned-route-summary">
          <div className="agrivo-assigned-route-point">
            <MapPin className="h-4 w-4 text-[#43A047]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Pickup</p>
              <p className="text-sm font-semibold text-[#102018]">{delivery.pickupLocation}</p>
              <p className="text-xs text-[#5F6F64]">{delivery.pickupAddress}</p>
            </div>
          </div>
          <div className="agrivo-assigned-route-point">
            <Navigation className="h-4 w-4 text-[#14532D]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Drop-off</p>
              <p className="text-sm font-semibold text-[#102018]">{delivery.dropoffLocation}</p>
              <p className="text-xs text-[#5F6F64]">{delivery.dropoffAddress}</p>
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
