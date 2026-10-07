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
      /** compact rhythm: 12px sides, 8px top */
      default: "px-3 pb-3 pt-2",
      /** even 12px all around */
      even: "p-3",
      /** even 16px all around (offer cards) */
      spacious: "p-4",
      /** roomy top for profile-style cards */
      roomy: "px-3 pb-3 pt-4",
      /** tall success panel */
      tall: "px-3 py-8",
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
