import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { AvatarTone } from "@/features/users/types";

const avatarToneClass: Record<AvatarTone, string> = {
  ink: "bg-brand-primary",
  slate: "bg-[#3f3f46]",
  coal: "bg-[#262626]",
  bark: "bg-[#44403c]",
};

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      md: "h-10 w-10",
      xl: "h-16 w-16",
    },
  },
  defaultVariants: { size: "md" },
});

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  tone?: AvatarTone;
}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, tone = "ink", size, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarVariants({ size }), avatarToneClass[tone], className)}
      {...props}
    />
  )
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("h-full w-full object-cover", className)} {...props} />
));
AvatarImage.displayName = "AvatarImage";

const avatarFallbackVariants = cva("flex h-full w-full items-center justify-center font-bold text-on-ink", {
  variants: {
    size: {
      md: "text-sm",
      xl: "text-xl",
    },
  },
  defaultVariants: { size: "md" },
});

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps>(
  ({ className, size, ...props }, ref) => (
    <AvatarPrimitive.Fallback ref={ref} className={cn(avatarFallbackVariants({ size }), className)} {...props} />
  )
);
AvatarFallback.displayName = "AvatarFallback";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>((props, ref) => (
  <SeparatorPrimitive.Root ref={ref} orientation="horizontal" className="my-4 h-px w-full shrink-0 bg-border" {...props} />
));
Separator.displayName = "Separator";

export { Avatar, AvatarImage, AvatarFallback, Separator };
