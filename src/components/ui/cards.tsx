import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Stack, Cluster, Grow } from "@/components/ui/layout";
import { Surface } from "@/components/ui/surface";
import { Title, Text } from "@/components/ui/typography";
import { Icon, IconBox } from "@/components/ui/icon";
import { ChevronRight, type LucideIcon } from "lucide-react";

/* ActionCard — landing role choice cards */
export function ActionCard({
  href,
  tone,
  icon,
  title,
  desc,
}: {
  href: string;
  tone: "ink" | "raised";
  icon: LucideIcon;
  title: string;
  desc?: string;
}) {
  const dark = tone === "ink";
  const compact = !desc;
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-card border shadow-card",
        compact ? "p-4" : "p-6",
        dark
          ? "border-transparent bg-brand-primary text-on-brand"
          : "border-border-subtle bg-surface text-primary"
      )}
    >
      <Cluster gap={compact ? "sm" : "md"}>
        <IconBox icon={icon} size={compact ? "sm" : "md"} tone={dark ? "frost" : "success"} />
        <Grow>
          <Title as="span" size="card">
            {title}
          </Title>
          {desc ? (
            <Text as="span" size="caption" weight="medium" tone={dark ? "inverted" : "muted"}>
              {desc}
            </Text>
          ) : null}
        </Grow>
        <Icon icon={ChevronRight} size="sm" tone={dark ? "inherit" : "faint"} />
      </Cluster>
    </Link>
  );
}

/* MetricCard — small stat tile (seats / vehicle on offer detail) */
export function MetricCard({
  icon,
  value,
  caption,
}: {
  icon: LucideIcon;
  value: string;
  caption: string;
}) {
  return (
    <Surface tone="wash" pad="md">
      <Stack gap="sm" align="center">
        <Cluster gap="sm" justify="center">
          <Icon icon={icon} size="xs" />
          <Text as="span" size="stat" weight="bold">
            {value}
          </Text>
        </Cluster>
        <Text size="micro" weight="bold" tone="soft" align="center">
          {caption}
        </Text>
      </Stack>
    </Surface>
  );
}

/* EmptyState — feed “no results” panel */
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  action?: ReactNode;
}) {
  return (
    <Surface tone="raised" pad="xl">
      <Stack gap="md" align="center">
        <Icon icon={icon} size="md" tone="mist" />
        <Stack gap="sm" align="center">
          <Text weight="bold" align="center">
            {title}
          </Text>
          <Text size="caption" tone="muted" align="center">
            {hint}
          </Text>
        </Stack>
        {action}
      </Stack>
    </Surface>
  );
}
