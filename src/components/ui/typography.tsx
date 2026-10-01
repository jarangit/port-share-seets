import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { LucideIcon } from "lucide-react";

const titleSizes = {
  hero: "font-display text-[26px] font-bold leading-tight lg:text-[32px]",
  page: "font-display text-[22px] font-bold leading-tight lg:text-[28px]",
  route: "font-display text-[24px] font-bold leading-tight",
  card: "font-display text-[17px] font-bold leading-snug",
  section: "font-display flex items-center gap-2 text-[15px] font-bold",
  name: "font-display text-lg font-bold",
  brand: "font-display text-[17px] font-bold",
} as const;

type TitleTag = "h1" | "h2" | "h3" | "p" | "span";

const titleIconSize = {
  hero: "sm",
  page: "sm",
  route: "sm",
  card: "xs",
  section: "xs",
  name: "xs",
  brand: "xs",
} as const;

/* Title — every heading in the app */
export function Title({
  as = "h2",
  size = "section",
  icon,
  children,
}: {
  as?: TitleTag;
  size?: keyof typeof titleSizes;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        titleSizes[size],
        as === "span" && size !== "section" && "block",
        icon && "flex items-center gap-2"
      )}
    >
      {icon && <Icon icon={icon} size={titleIconSize[size]} />}
      {children}
    </Tag>
  );
}

const textSizes = {
  body: "text-sm",
  meta: "text-[13px]",
  caption: "text-[12px]",
  micro: "text-[11px]",
  stat: "text-lg",
} as const;

const textTones = {
  default: "text-ink",
  soft: "text-ink-soft",
  muted: "text-muted",
  faint: "text-faint",
  mist: "text-mist",
  inverted: "text-on-ink",
} as const;

const textWeights = {
  regular: "",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

/* Text — every paragraph / label / caption in the app */
export function Text({
  as = "p",
  size = "body",
  tone = "default",
  weight = "regular",
  align = "left",
  truncate = false,
  lines,
  narrow = false,
  children,
}: {
  as?: "p" | "span" | "label";
  size?: keyof typeof textSizes;
  tone?: keyof typeof textTones;
  weight?: keyof typeof textWeights;
  align?: "left" | "center";
  truncate?: boolean;
  lines?: 1;
  narrow?: boolean;
  children: ReactNode;
}) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        textSizes[size],
        textTones[tone],
        textWeights[weight],
        as === "span" && "block",
        align === "center" && "text-center",
        truncate && "truncate",
        lines === 1 && "line-clamp-1",
        narrow && "mx-auto max-w-[280px]"
      )}
    >
      {children}
    </Tag>
  );
}

