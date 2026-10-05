import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

/* NavItem — sidebar + mobile menu link */
export function NavItem({
  href,
  icon,
  label,
  active = false,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold",
        active ? "bg-brand-primary text-on-brand" : "text-secondary hover:bg-interactive"
      )}
    >
      <Icon icon={icon} size="sm" />
      {label}
    </Link>
  );
}

/* BackLink — “กลับ” links above page headers */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-[13px] font-bold text-secondary">
      <Icon icon={ChevronLeft} size="xs" />
      {label}
    </Link>
  );
}

/* TextLink — small inline “ดูทั้งหมด” style link */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-xs font-bold text-primary">
      {children}
    </Link>
  );
}

/* CardLink — block-level link wrapper so whole cards are tappable.
   Keeps layout margins (e.g. Stack space-y) working, since a plain
   inline <a> would ignore vertical margins. */
export function CardLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} className="block">
      {children}
    </Link>
  );
}

/* DetailLink — centered faint “ดูให้ชัดขึ้น” link */
export function DetailLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-2 py-2 text-[12px] font-bold text-tertiary"
    >
      {label}
      <Icon icon={ChevronRight} size="xs" />
    </Link>
  );
}
