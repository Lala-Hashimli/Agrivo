import { cn } from "../ui/utils";

export type StatusBadgeTone = "success" | "warning" | "info" | "neutral" | "danger";

const TONE_CLASSES: Record<StatusBadgeTone, string> = {
  success: "agrivo-status-badge--success",
  warning: "agrivo-status-badge--warning",
  info: "agrivo-status-badge--info",
  neutral: "agrivo-status-badge--neutral",
  danger: "agrivo-status-badge--danger",
};

export function resolveStatusTone(status: string): StatusBadgeTone {
  const value = status.toLowerCase();
  if (
    value.includes("deliver") ||
    value.includes("complet") ||
    value.includes("active") ||
    value.includes("verified") ||
    value.includes("confirm")
  ) {
    return "success";
  }
  if (
    value.includes("transit") ||
    value.includes("pending") ||
    value.includes("pickup") ||
    value.includes("review") ||
    value.includes("low")
  ) {
    return "warning";
  }
  if (value.includes("cancel") || value.includes("reject") || value.includes("fail")) {
    return "danger";
  }
  if (value.includes("draft") || value.includes("assign")) {
    return "info";
  }
  return "neutral";
}

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string;
  tone?: StatusBadgeTone;
  className?: string;
}) {
  const resolvedTone = tone ?? resolveStatusTone(status);

  return (
    <span className={cn("agrivo-status-badge", TONE_CLASSES[resolvedTone], className)}>
      {status}
    </span>
  );
}
