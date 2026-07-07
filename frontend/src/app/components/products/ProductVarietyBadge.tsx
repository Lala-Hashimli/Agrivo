import { Sprout } from "lucide-react";
import { cn } from "../ui/utils";

export function ProductVarietyBadge({
  variety,
  label = "Sort",
  size = "sm",
  showLabel = true,
  compact = false,
  className,
}: {
  variety?: string | null;
  label?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
  /** Compact table layout with ellipsis truncation */
  compact?: boolean;
  className?: string;
}) {
  if (!variety?.trim()) return null;

  return (
    <div
      className={cn(
        "agrivo-product-variety-meta",
        size === "md" && "agrivo-product-variety-meta--md",
        compact && "agrivo-product-variety-meta--compact",
        className,
      )}
      title={`${label}: ${variety}`}
    >
      {showLabel ? <span className="agrivo-product-variety-label">{label}</span> : null}
      <span className="agrivo-product-variety-badge">
        <Sprout className="agrivo-product-variety-badge__icon" aria-hidden />
        <span className="agrivo-product-variety-badge__text">{variety}</span>
      </span>
    </div>
  );
}
