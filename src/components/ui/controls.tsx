"use client";
import { cn } from "@/lib/utils";
import { PairGrid } from "@/components/ui/layout";
import { Icon } from "@/components/ui/icon";
import type { LucideIcon } from "lucide-react";

/* SegmentedControl — day tabs (วันนี้ / พรุ่งนี้) */
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
    <PairGrid>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-card px-4 py-2 text-[13px] font-bold",
            value === o.id ? "bg-ink text-on-ink" : "bg-wash text-ink-soft"
          )}
        >
          {o.label}
        </button>
      ))}
    </PairGrid>
  );
}

/* IconButton — glass tile button (mobile menu toggle) */
export function IconButton({
  label,
  icon,
  toggled = false,
  onClick,
}: {
  label: string;
  icon: { on: LucideIcon; off: LucideIcon };
  toggled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-tile bg-on-ink/10 text-on-ink"
    >
      <Icon icon={toggled ? icon.on : icon.off} size="sm" />
    </button>
  );
}
