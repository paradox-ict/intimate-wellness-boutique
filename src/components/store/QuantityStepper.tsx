import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-secondary disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-secondary disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
