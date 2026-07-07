import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Input } from "../../ui/input";
import { cn } from "../../ui/utils";

export function ComboboxInput({
  value,
  onChange,
  options,
  disabled = false,
  placeholder,
  id,
  className,
  emptyHint,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
  emptyHint?: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.toLowerCase().includes(query));
  }, [options, value]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <Input
        id={id}
        value={value}
        disabled={disabled}
        placeholder={disabled ? emptyHint ?? "Select product first" : placeholder}
        list={options.length > 0 ? listId : undefined}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className={cn(className, disabled && "cursor-not-allowed opacity-60")}
        autoComplete="off"
      />
      {options.length > 0 ? (
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
      {open && !disabled && filtered.length > 0 ? (
        <ul className="agrivo-combobox-suggestions" role="listbox">
          {filtered.slice(0, 8).map((option) => (
            <li key={option}>
              <button
                type="button"
                className="agrivo-combobox-suggestion"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
