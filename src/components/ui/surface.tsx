import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const surfaceVariants = cva("rounded-card text-ink", {
  variants: {
    tone: {
      raised: "bg-surface",
      wash: "bg-wash",
      ink: "bg-ink text-on-ink",
      brand: "bg-brand-soft text-on-brand",
      success: "bg-success-soft text-ink",
    },
    pad: {
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    },
  },
  defaultVariants: { tone: "raised", pad: "md" },
});

/* Surface — flat panel box (search box, pickup rows, note, stat tiles) */
export function Surface({
  children,
  tone,
  pad,
}: {
  children: ReactNode;
} & VariantProps<typeof surfaceVariants>) {
  return <div className={cn(surfaceVariants({ tone, pad }))}>{children}</div>;
}
