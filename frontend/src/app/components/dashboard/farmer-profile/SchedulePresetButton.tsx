import { cn } from "../../ui/utils";
import type { SchedulePreset } from "../../../utils/workingSchedule";

export function SchedulePresetButton({
  label,
  active,
  disabled = false,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "agrivo-schedule-preset-btn",
        active && "agrivo-schedule-preset-btn--active",
        disabled && "agrivo-schedule-preset-btn--disabled",
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export type { SchedulePreset };
