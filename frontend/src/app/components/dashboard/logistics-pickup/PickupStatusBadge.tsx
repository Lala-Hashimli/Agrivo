import {
  PICKUP_STATUS_LABELS,
  type PickupTaskStatus,
} from "../../../utils/pickupTasksStorage";
import { cn } from "../../ui/utils";

const STATUS_TONES: Record<PickupTaskStatus, string> = {
  scheduled: "agrivo-pickup-status--scheduled",
  ready_for_pickup: "agrivo-pickup-status--ready",
  driver_assigned: "agrivo-pickup-status--assigned",
  pickup_started: "agrivo-pickup-status--started",
  collected: "agrivo-pickup-status--collected",
  delayed: "agrivo-pickup-status--delayed",
  cancelled: "agrivo-pickup-status--cancelled",
};

export function PickupStatusBadge({
  status,
  className,
}: {
  status: PickupTaskStatus;
  className?: string;
}) {
  return (
    <span className={cn("agrivo-pickup-status", STATUS_TONES[status], className)}>
      {PICKUP_STATUS_LABELS[status]}
    </span>
  );
}
