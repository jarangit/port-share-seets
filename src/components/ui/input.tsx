import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { LucideIcon } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border border-border bg-surface px-4 text-base font-medium text-primary outline-none placeholder:text-disabled focus:border-border-brand",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[76px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-primary outline-none placeholder:text-disabled focus:border-border-brand",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

/* SearchInput — text input with a leading icon (find page) */
const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { icon: LucideIcon }
>(({ icon, className, ...props }, ref) => (
  <div className="relative">
    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
      <Icon icon={icon} size="xs" tone="faint" />
    </span>
    <Input ref={ref} {...props} className={cn("pl-11", className)} />
  </div>
));
SearchInput.displayName = "SearchInput";

export { Input, Textarea, SearchInput };
