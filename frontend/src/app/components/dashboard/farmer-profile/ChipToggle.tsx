import { cn } from "../../ui/utils";

export function ChipToggle({
  label,
  selected,
  onClick,
  disabled = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "agrivo-profile-chip",
        selected && "agrivo-profile-chip--selected",
        disabled && "agrivo-profile-chip--disabled",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
