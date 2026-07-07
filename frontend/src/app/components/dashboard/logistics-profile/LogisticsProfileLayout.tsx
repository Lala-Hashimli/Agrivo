import type { ReactNode } from "react";

export type LogisticsProfileSectionId =
  | "company"
  | "contact"
  | "schedule"
  | "documents"
  | "actions"
  | "operations"
  | "coverage"
  | "preview"
  | "trust";

export function LogisticsProfileMainGrid({ children }: { children: ReactNode }) {
  return <div className="agrivo-logistics-profile-main-grid">{children}</div>;
}

export function LogisticsProfileLeftColumn({ children }: { children: ReactNode }) {
  return <div className="agrivo-logistics-profile-col agrivo-logistics-profile-col--left">{children}</div>;
}

export function LogisticsProfileRightColumn({ children }: { children: ReactNode }) {
  return (
    <div className="agrivo-logistics-profile-col agrivo-logistics-profile-col--right">{children}</div>
  );
}

export function LogisticsProfileSection({
  id,
  children,
}: {
  id: LogisticsProfileSectionId;
  children: ReactNode;
}) {
  return (
    <div className={`agrivo-logistics-profile-section agrivo-logistics-profile-section--${id}`}>
      {children}
    </div>
  );
}
