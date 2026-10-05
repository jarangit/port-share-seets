import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-on-brand hover:bg-brand-hover active:bg-brand-hover",
        secondary: "bg-interactive text-primary hover:bg-interactive-hover",
        outline: "border border-border bg-surface text-primary hover:bg-surface-subtle",
        ghost: "bg-transparent text-primary hover:bg-interactive",
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
