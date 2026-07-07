import type { ReactNode } from "react";
import { cn } from "../../ui/utils";

export function FormGrid({
  children,
  columns = 2,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "agrivo-form-grid",
        columns === 3 && "agrivo-form-grid--3",
        columns === 2 && "agrivo-form-grid--2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FormGridItem({
  children,
  span,
  className,
}: {
  children: ReactNode;
  span?: "full";
  className?: string;
}) {
  return (
    <div className={cn(span === "full" && "agrivo-form-grid-item--full", className)}>
      {children}
    </div>
  );
}

export function FormMediaGrid({ children }: { children: ReactNode }) {
  return <div className="agrivo-form-media-grid">{children}</div>;
}
