import {
  PICKUP_PRIORITY_LABELS,
  type PickupPriority,
} from "../../../utils/pickupTasksStorage";
import { cn } from "../../ui/utils";

const PRIORITY_TONES: Record<PickupPriority, string> = {
  high: "agrivo-pickup-priority--high",
  medium: "agrivo-pickup-priority--medium",
  low: "agrivo-pickup-priority--low",
};

export function PickupPriorityBadge({
  priority,
  className,
}: {
  priority: PickupPriority;
  className?: string;
}) {
  return (
    <span className={cn("agrivo-pickup-priority", PRIORITY_TONES[priority], className)}>
      {PICKUP_PRIORITY_LABELS[priority]}
    </span>
  );
}
