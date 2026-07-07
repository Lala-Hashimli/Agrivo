import {
  IN_TRANSIT_STATUS_LABELS,
  type InTransitStatus,
} from "../../../utils/inTransitStorage";
import { cn } from "../../ui/utils";

const STATUS_TONES: Record<InTransitStatus, string> = {
  in_transit: "agrivo-transit-status--transit",
  near_destination: "agrivo-transit-status--near",
  delayed: "agrivo-transit-status--delayed",
  issue_reported: "agrivo-transit-status--issue",
  delivered: "agrivo-transit-status--delivered",
};

export function TransitStatusBadge({
  status,
  className,
}: {
  status: InTransitStatus;
  className?: string;
}) {
  return (
    <span className={cn("agrivo-transit-status", STATUS_TONES[status], className)}>
      {IN_TRANSIT_STATUS_LABELS[status]}
    </span>
  );
}
