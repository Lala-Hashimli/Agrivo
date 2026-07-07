import {
  COMPLETION_STATUS_LABELS,
  COMPLETION_STATUS_SHORT_LABELS,
  type CompletionStatus,
} from "../../../utils/completedDeliveriesStorage";
import { cn } from "../../ui/utils";

const STATUS_TONES: Record<CompletionStatus, string> = {
  completed_on_time: "agrivo-completed-status--ontime",
  completed_late: "agrivo-completed-status--late",
  completed_with_issue: "agrivo-completed-status--issue",
};

export function CompletionStatusBadge({
  status,
  className,
  short = false,
}: {
  status: CompletionStatus;
  className?: string;
  short?: boolean;
}) {
  return (
    <span className={cn("agrivo-completed-status", STATUS_TONES[status], className)}>
      {short ? COMPLETION_STATUS_SHORT_LABELS[status] : COMPLETION_STATUS_LABELS[status]}
    </span>
  );
}
