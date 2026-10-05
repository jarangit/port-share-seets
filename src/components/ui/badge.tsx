import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold leading-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-brand",
        secondary: "bg-interactive text-secondary",
        outline: "border border-border bg-surface text-secondary",
        warning: "bg-brand-identity text-primary",
        danger: "bg-danger text-on-danger",
        success: "bg-success-bg text-text-brand",
      },
      size: {
        default: "",
        xs: "px-2 py-1",
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
