import {
  ASSIGNED_PRIORITY_LABELS,
  type AssignedDeliveryPriority,
} from "../../../utils/assignedDeliveriesStorage";
import { cn } from "../../ui/utils";

const PRIORITY_TONES: Record<AssignedDeliveryPriority, string> = {
  high: "agrivo-assigned-priority--high",
  medium: "agrivo-assigned-priority--medium",
  low: "agrivo-assigned-priority--low",
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: AssignedDeliveryPriority;
  className?: string;
}) {
  return (
    <span className={cn("agrivo-assigned-priority", PRIORITY_TONES[priority], className)}>
      {ASSIGNED_PRIORITY_LABELS[priority]}
    </span>
  );
}
