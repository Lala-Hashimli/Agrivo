import { Check } from "lucide-react";
import { cn } from "../../ui/utils";
import type { WeekDay } from "../../../utils/workingSchedule";
import { WEEKDAY_META } from "../../../utils/workingSchedule";

export function DayChip({
  day,
  selected,
  disabled = false,
  onClick,
}: {
  day: WeekDay;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "agrivo-schedule-day-chip",
        selected && "agrivo-schedule-day-chip--selected",
        disabled && "agrivo-schedule-day-chip--disabled",
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {selected ? <Check className="agrivo-schedule-day-chip__icon" aria-hidden /> : null}
      <span>{WEEKDAY_META[day].short}</span>
    </button>
  );
}
