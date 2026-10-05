import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Page — the only sanctioned <main> wrapper */
const pageVariants = cva("", {
  variants: {
    variant: {
      default: "space-y-4 px-4 pt-4 lg:px-0 lg:pt-0",
      landing: "hero-glow px-4 pt-6 lg:px-0 lg:pt-8",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Page({
  children,
  variant,
}: {
  children: ReactNode;
} & VariantProps<typeof pageVariants>) {
  return <main className={pageVariants({ variant })}>{children}</main>;
}

/* PageHeader — alignment of title row vs actions */
const pageHeaderVariants = cva("", {
  variants: {
    layout: {
      stack: "",
      row: "flex items-end justify-between gap-4",
      bar: "flex items-center justify-between gap-4",
    },
  },
  defaultVariants: { layout: "stack" },
});

export function PageHeader({
  children,
  layout,
}: {
  children: ReactNode;
} & VariantProps<typeof pageHeaderVariants>) {
  return <header className={pageHeaderVariants({ layout })}>{children}</header>;
}

/* Stack — vertical rhythm, 8px grid only */
const stackVariants = cva("", {
  variants: {
    gap: {
      sm: "space-y-2",
      md: "space-y-3",
      lg: "space-y-5",
    },
    align: {
      start: "",
      center: "flex flex-col items-center text-center",
    },
  },
  defaultVariants: { gap: "md", align: "start" },
});

export function Stack({
  children,
  gap,
  align,
}: {
  children: ReactNode;
} & VariantProps<typeof stackVariants>) {
  return <div className={cn(stackVariants({ gap, align }))}>{children}</div>;
}

/* Cluster — horizontal row */
const clusterVariants = cva("flex items-center", {
  variants: {
    gap: {
      sm: "gap-2",
      md: "gap-4",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      between: "justify-between",
    },
    align: {
      center: "items-center",
      start: "items-start",
    },
    wrap: {
      true: "flex-wrap",
      false: "",
    },
  },
  defaultVariants: { gap: "sm", justify: "start", align: "center", wrap: false },
});

export function Cluster({
  children,
  gap,
  justify,
  align,
  wrap,
}: {
  children: ReactNode;
} & VariantProps<typeof clusterVariants>) {
  return <div className={cn(clusterVariants({ gap, justify, align, wrap }))}>{children}</div>;
}

/* Shrink — flex child allowed to truncate */
export function Shrink({ children }: { children: ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}

/* Grow — flex child that takes remaining space */
export function Grow({ children }: { children: ReactNode }) {
  return <div className="min-w-0 flex-1">{children}</div>;
}

/* CardGrid — responsive 2-col card grid (my-posts) */
export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

/* PairGrid — fixed 2-col tight grid (tabs, stats, form pairs, actions) */
export function PairGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

/* FormGrid — responsive 2-col form layout (post, profile) */
export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 lg:grid-cols-2 lg:items-start">{children}</div>;
}

/* DetailLayout — offer detail 3/2 split */
export function DetailLayout({ main, side }: { main: ReactNode; side: ReactNode }) {
  return (
    <div className="grid gap-3 lg:grid-cols-5 lg:items-start">
      <div className="space-y-3 lg:col-span-3">{main}</div>
      <div className="space-y-3 lg:col-span-2">{side}</div>
    </div>
  );
}

/* NarrowCenter — landing hero column */
export function NarrowCenter({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[420px] text-center">{children}</div>;
}

/* MobileOnly — rendered below md breakpoint only */
export function MobileOnly({ children }: { children: ReactNode }) {
  return <div className="md:hidden">{children}</div>;
}
