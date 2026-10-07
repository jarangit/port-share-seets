"use client";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { LucideIcon } from "lucide-react";

/* SegmentedControl — option tabs (day tabs, vehicle filter).
   Columns follow the option count (2–3 supported). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div
      className="grid gap-1 rounded-full bg-interactive p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      role="group"
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={cn(
            "h-12 rounded-full px-4 text-[13px] font-bold",
            value === o.id ? "bg-brand-primary text-on-brand shadow-xs" : "text-secondary"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* IconButton — circular button (mobile menu toggle) */
export function IconButton({
  label,
  icon,
  toggled = false,
  onDark = false,
  onClick,
}: {
  label: string;
  icon: { on: LucideIcon; off: LucideIcon };
  toggled?: boolean;
  onDark?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full",
        onDark ? "bg-interactive text-primary" : "bg-interactive text-primary"
      )}
    >
      <Icon icon={toggled ? icon.on : icon.off} size="sm" />
    </button>
  );
}
