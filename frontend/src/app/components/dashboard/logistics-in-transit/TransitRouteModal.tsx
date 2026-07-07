import { Crosshair, MapPin, Navigation, Truck } from "lucide-react";
import { useState } from "react";
import { todayRouteData } from "../../../data/logisticsRoutes";
import { RouteMap } from "../../logistics/RouteMap";
import type { InTransitDelivery } from "../../../utils/inTransitStorage";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export function TransitRouteModal({
  delivery,
  open,
  onOpenChange,
}: {
  delivery: InTransitDelivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [centerTrigger, setCenterTrigger] = useState(0);

  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-assigned-route-dialog sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
            Live route · {delivery.taskId}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5F6F64]">
            {delivery.pickupLocation} → {delivery.dropoffLocation}
          </DialogDescription>
        </DialogHeader>

        <div className="agrivo-transit-route-meta">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">ETA</p>
            <p className="text-sm font-bold text-[#14532D]">{delivery.eta}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Remaining</p>
            <p className="text-sm font-bold text-[#102018]">{delivery.distanceRemaining}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Vehicle</p>
            <p className="text-sm font-bold text-[#102018]">{delivery.vehicle}</p>
          </div>
        </div>

        <div className="agrivo-assigned-route-summary">
          <div className="agrivo-assigned-route-point">
            <MapPin className="h-4 w-4 text-[#43A047]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Pickup</p>
              <p className="text-sm font-semibold text-[#102018]">{delivery.pickupLocation}</p>
            </div>
          </div>
          <div className="agrivo-assigned-route-point">
            <Truck className="h-4 w-4 text-[#14532D]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Current</p>
              <p className="text-sm font-semibold text-[#102018]">{delivery.currentLocation}</p>
            </div>
          </div>
          <div className="agrivo-assigned-route-point">
            <Navigation className="h-4 w-4 text-[#14532D]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Destination</p>
              <p className="text-sm font-semibold text-[#102018]">{delivery.dropoffLocation}</p>
            </div>
          </div>
        </div>

        <RouteMap
          key={centerTrigger}
          route={todayRouteData}
          className="agrivo-transit-route-modal-map"
        />

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => setCenterTrigger((v) => v + 1)}
          >
            <Crosshair className="mr-2 h-4 w-4" />
            Center vehicle
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
