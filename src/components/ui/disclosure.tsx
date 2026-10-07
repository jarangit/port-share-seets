import type { ReactNode } from "react";

/* Disclosure — native details/summary expander with open/close label swap
   (offer detail: full driver profile). */
export function Disclosure({
  openLabel,
  closeLabel,
  chevron,
  children,
}: {
  openLabel: string;
  closeLabel: string;
  chevron: ReactNode;
  children: ReactNode;
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{openLabel}</span>
        <span className="hidden group-open:inline">{closeLabel}</span>
        {chevron}
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}
