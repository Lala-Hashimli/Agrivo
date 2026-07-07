import type { ReactNode } from "react";
import { Label } from "../../ui/label";
import { cn } from "../../ui/utils";

export function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("agrivo-form-field", className)}>
      <Label htmlFor={htmlFor} className="agrivo-form-label">
        {label}
        {required ? <span className="agrivo-form-required">*</span> : null}
      </Label>
      {children}
      {error ? <p className="agrivo-form-error">{error}</p> : null}
    </div>
  );
}

export const formInputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-[#DEECE0] bg-[#F7FBF5] px-3.5 text-sm text-[#102018] transition-colors placeholder:text-[#9ca3af] focus:border-[#86efac] focus:outline-none focus:ring-2 focus:ring-[#bbf7d0]/60";

export const formTextareaClass =
  "mt-1.5 min-h-[120px] w-full rounded-xl border border-[#DEECE0] bg-[#F7FBF5] px-3.5 py-3 text-sm text-[#102018] transition-colors placeholder:text-[#9ca3af] focus:border-[#86efac] focus:outline-none focus:ring-2 focus:ring-[#bbf7d0]/60";
