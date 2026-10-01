import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-card bg-surface", {
  variants: {
    state: {
      open: "",
      dimmed: "opacity-70",
    },
  },
  defaultVariants: { state: "open" },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, state, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ state }), className)} {...props} />
  )
);
Card.displayName = "Card";

const cardBodyVariants = cva("", {
  variants: {
    pad: {
      /** matches legacy rhythm: 16px sides, 8px top */
      default: "px-4 pb-4 pt-2",
      /** even 16px all around */
      even: "p-4",
      /** roomy 24px top for profile-style cards */
      roomy: "px-4 pb-4 pt-6",
      /** tall success panel */
      tall: "px-4 py-10",
    },
  },
  defaultVariants: { pad: "default" },
});

export interface CardBodyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardBodyVariants> {}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, pad, ...props }, ref) => (
    <div ref={ref} className={cn(cardBodyVariants({ pad }), className)} {...props} />
  )
);
CardBody.displayName = "CardBody";

export { Card, CardBody, cardVariants, cardBodyVariants };
