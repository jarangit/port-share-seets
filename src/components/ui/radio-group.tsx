"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { LucideIcon } from "lucide-react";

/* RadioGroup — shadcn primitives, themed to app tokens.
   orientation="horizontal" lays options side by side (and tells
   Radix to use left/right arrows). */
function RadioGroup({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      orientation={orientation}
      className={cn(
        orientation === "horizontal" ? "flex flex-row gap-2" : "grid gap-3",
        className
      )}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-border bg-surface text-text-brand outline-none focus-visible:border-border-brand disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <Circle className="size-2 fill-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

/* RadioOption — labeled radio row (icon + text label toggles the item). */
function RadioOption({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon?: LucideIcon;
}) {
  const id = React.useId();
  return (
    <div data-slot="radio-option" className="flex flex-1 items-center gap-3">
      <RadioGroupItem value={value} id={id} aria-label={label} />
      <label
        htmlFor={id}
        className="flex flex-1 cursor-pointer items-center gap-2 text-sm font-medium text-primary"
      >
        {icon && <Icon icon={icon} size="xs" />}
        {label}
      </label>
    </div>
  );
}

export { RadioGroup, RadioGroupItem, RadioOption };
