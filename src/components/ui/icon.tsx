import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { CarFront } from "lucide-react";
import { FaLine } from "react-icons/fa";

const iconSizes = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
} as const;

const iconTones = {
  inherit: "",
  faint: "text-faint",
  mist: "text-mist",
  verified: "text-verified",
} as const;

/* Icon — the only way to size a lucide icon outside ui */
export function Icon({
  icon,
  size = "xs",
  tone = "inherit",
  inline = false,
  spaced,
}: {
  icon: LucideIcon;
  size?: keyof typeof iconSizes;
  tone?: keyof typeof iconTones;
  inline?: boolean;
  /** spacing when placed inside a text line */
  spaced?: "before" | "after";
}) {
  const L = icon;
  return (
    <L
      aria-hidden
      className={cn(
        iconSizes[size],
        iconTones[tone],
        inline && "inline",
        spaced === "before" && "ml-2",
        spaced === "after" && "mr-2",
        "shrink-0"
      )}
    />
  );
}

const iconBoxVariants = cva("inline-flex shrink-0 items-center justify-center", {
  variants: {
    size: {
      xs: "h-8 w-8",
      sm: "h-10 w-10",
      md: "h-12 w-12",
      lg: "h-14 w-14",
    },
    tone: {
      ink: "bg-primary text-on-brand",
      wash: "bg-surface-subtle text-secondary",
      brand: "bg-success-bg text-text-brand",
      success: "bg-success-bg text-text-brand",
      frost: "bg-white/15 text-white",
    },
    shape: {
      tile: "rounded-tile",
      circle: "rounded-full",
    },
  },
  defaultVariants: { size: "md", tone: "wash", shape: "tile" },
});

const iconBoxIconSize = { xs: "sm", sm: "sm", md: "sm", lg: "md" } as const;

export function IconBox({
  icon,
  size,
  tone,
  shape,
}: {
  icon: LucideIcon;
} & VariantProps<typeof iconBoxVariants>) {
  const resolved = size ?? "md";
  return (
    <span className={cn(iconBoxVariants({ size, tone, shape }))}>
      <Icon icon={icon} size={iconBoxIconSize[resolved]} />
    </span>
  );
}

/* LineIcon — LINE brand icon from react-icons (lucide-react no longer
   ships brand icons). Cast to plug into the app's Icon / ContactRow API. */
export const LineIcon = FaLine as unknown as LucideIcon;

/* BrandMark — logo tile + wordmark lockup */
export function BrandMark({ name, compact = false }: { name: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center", compact ? "gap-2" : "gap-4")}>
      <IconBox icon={CarFront} size={compact ? "xs" : "sm"} tone="brand" />
      <span className={cn("font-display font-bold", compact ? "text-[16px]" : "text-[17px]")}>{name}</span>
    </span>
  );
}
