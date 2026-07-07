import type { ReactNode } from "react";
import { cn } from "../../ui/utils";

export function ProfileMainGrid({ children }: { children: ReactNode }) {
  return <div className="agrivo-profile-main-grid">{children}</div>;
}

export function ProfileLeftColumn({ children }: { children: ReactNode }) {
  return <div className="agrivo-profile-left-column">{children}</div>;
}

export function ProfileRightColumn({ children }: { children: ReactNode }) {
  return <div className="agrivo-profile-right-column">{children}</div>;
}

export function ProfileCard({
  children,
  className,
  variant,
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "tips" | "preview" | "actions";
}) {
  return (
    <section
      className={cn(
        "agrivo-profile-card",
        variant && `agrivo-profile-card--${variant}`,
        className,
      )}
    >
      {children}
    </section>
  );
}

export function ProfileCardHeader({
  icon: Icon,
  title,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="agrivo-profile-card-header">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-[#43A047]" /> : null}
        <h3 className="agrivo-profile-section-title">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function ProfileCardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("agrivo-profile-card-body", className)}>{children}</div>;
}
