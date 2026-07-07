import type { ReactNode } from "react";
import { cn } from "../ui/utils";

export function PageHeader({
  title,
  subtitle,
  helper,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  helper?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("agrivo-dashboard-page-header", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">{title}</h2>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">{subtitle}</p>
          ) : null}
        </div>
        {helper ? <div className="agrivo-dashboard-page-helper shrink-0">{helper}</div> : null}
        {actions ? <div className="agrivo-dashboard-page-actions shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}
