import {
  DELIVERY_STATUS_LABELS,
  type DeliveryTaskStatus,
} from "../../../utils/logisticsDashboardStorage";
import { cn } from "../../ui/utils";

const STATUS_TONES: Record<DeliveryTaskStatus, string> = {
  assigned: "agrivo-logistics-status--assigned",
  pickup_scheduled: "agrivo-logistics-status--pickup",
  picked_up: "agrivo-logistics-status--picked",
  in_transit: "agrivo-logistics-status--transit",
  delivered: "agrivo-logistics-status--delivered",
  delayed: "agrivo-logistics-status--delayed",
};

export function LogisticsDeliveryStatusBadge({
  status,
  className,
}: {
  status: DeliveryTaskStatus;
  className?: string;
}) {
  return (
    <span className={cn("agrivo-logistics-status", STATUS_TONES[status], className)}>
      {DELIVERY_STATUS_LABELS[status]}
    </span>
  );
}
