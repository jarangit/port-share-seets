import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-2 rounded-card px-4 py-2 text-[11px] font-bold leading-none",
  {
    variants: {
      variant: {
        default: "bg-ink text-on-ink",
        secondary: "bg-fill text-ink",
        outline: "bg-wash text-ink",
        warning: "bg-brand-soft text-on-brand",
        danger: "bg-danger text-on-danger",
        success: "bg-success text-on-success",
      },
      size: {
        default: "",
        xs: "px-2 py-2",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
