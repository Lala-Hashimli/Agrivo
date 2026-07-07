import { Minus, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { cn } from "../../ui/utils";

export function QuantityInput({
  value,
  onChange,
  min = 0,
  className,
  id,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  className?: string;
  id?: string;
}) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(value + 1);

  const handleInput = (raw: string) => {
    if (raw === "") {
      onChange(min);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    onChange(Math.max(min, Math.floor(parsed)));
  };

  return (
    <div className={cn("agrivo-quantity-input", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11 shrink-0 rounded-xl border-[#DEECE0] bg-white text-[#14532D] hover:bg-[#EAF7EC]"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        id={id}
        type="number"
        min={min}
        step={1}
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        className="h-11 rounded-xl border-[#DEECE0] bg-[#F7FBF5] text-center text-sm font-semibold text-[#102018] focus:border-[#86efac] focus:ring-[#bbf7d0]/60"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-11 w-11 shrink-0 rounded-xl border-[#DEECE0] bg-white text-[#14532D] hover:bg-[#EAF7EC]"
        onClick={increment}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
