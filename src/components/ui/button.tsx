import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-card text-sm font-bold transition-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ink text-on-ink hover:bg-ink-hover active:bg-ink-active",
        secondary: "bg-fill text-ink hover:bg-mist",
        outline: "bg-wash text-ink hover:bg-fill",
        ghost: "bg-transparent text-ink hover:bg-fill",
        warning: "bg-brand text-on-brand hover:bg-brand-soft",
        danger: "bg-danger text-on-danger hover:bg-danger-hover",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-[13px]",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10",
      },
      width: {
        auto: "",
        full: "w-full",
        grow: "flex-1",
        shrink: "shrink-0",
      },
    },
    defaultVariants: { variant: "default", size: "default", width: "auto" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, width, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, width, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
