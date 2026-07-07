import type { ReactNode } from "react";
import { cn } from "../../ui/utils";

export function ProfileInfoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("agrivo-profile-info-grid", className)}>{children}</div>;
}

export function ProfileInfoField({
  label,
  children,
  edit,
  isEditing = false,
  error,
  emphasized = false,
  multiline = false,
  fullWidth = false,
  className,
}: {
  label: string;
  children: ReactNode;
  edit?: ReactNode;
  isEditing?: boolean;
  error?: string;
  emphasized?: boolean;
  multiline?: boolean;
  fullWidth?: boolean;
  className?: string;
}) {
  const placeholder =
    typeof children === "string" &&
    (children.startsWith("Add ") ||
      children.startsWith("Not ") ||
      children.startsWith("Select ") ||
      children === "—");

  return (
    <div
      className={cn(
        "agrivo-profile-info-field",
        fullWidth && "agrivo-profile-info-field--full",
        multiline && "agrivo-profile-info-field--multiline",
        className,
      )}
    >
      <span className="agrivo-profile-info-field__label">{label}</span>
      {isEditing && edit ? (
        <div className="agrivo-profile-info-field__edit">
          {edit}
          {error ? <p className="agrivo-profile-field-error">{error}</p> : null}
        </div>
      ) : (
        <div
          className={cn(
            "agrivo-profile-info-field__value",
            emphasized && "agrivo-profile-info-field__value--emphasized",
            multiline && "agrivo-profile-info-field__value--multiline",
            placeholder && "agrivo-profile-info-field__value--placeholder",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function ProfileInfoGroup({
  label,
  children,
  fullWidth = true,
  className,
}: {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "agrivo-profile-info-group",
        fullWidth && "agrivo-profile-info-field--full",
        className,
      )}
    >
      <span className="agrivo-profile-info-field__label">{label}</span>
      <div className="agrivo-profile-info-group__content">{children}</div>
    </div>
  );
}

const inputClassName =
  "h-11 rounded-xl border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";

export const profileInfoInputClassName = inputClassName;
