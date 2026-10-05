import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const surfaceVariants = cva("rounded-card text-primary", {
  variants: {
    tone: {
      raised: "bg-surface",
      wash: "bg-surface-subtle",
      ink: "bg-brand-primary text-on-brand",
      brand: "border border-border-brand bg-brand-soft text-primary",
      success: "bg-success-bg text-primary",
    },
    pad: {
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
      xl: "p-6",
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

/* SearchPanel — route search container (consumes search component tokens) */
export function SearchPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card bg-surface p-4">
      {children}
    </div>
  );
}
