import type { ReactNode } from "react";

/* AppFrame — app background shell */
export function AppFrame({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-app">{children}</div>;
}

/* ContentGrid — desktop sidebar + content columns */
export function ContentGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[480px] lg:grid lg:max-w-6xl lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:py-6">
      {children}
    </div>
  );
}

/* PageBody — mobile top offset + content padding */
export function PageBody({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="pb-8 pt-14 lg:pt-0">{children}</div>
    </div>
  );
}

/* DesktopHeaderFrame — top bar visible on lg+ */
export function DesktopHeaderFrame({ children }: { children: ReactNode }) {
  return <header className="hidden border-b border-border-subtle bg-surface text-primary lg:block">{children}</header>;
}

/* HeaderInner — centered header content row */
export function HeaderInner({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
      {children}
    </div>
  );
}

/* TopBarFrame — fixed mobile container */
export function TopBarFrame({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 mx-auto w-full max-w-[480px] lg:hidden">{children}</div>
  );
}

/* TopBarRow — the dark mobile bar itself */
export function TopBarRow({ children }: { children: ReactNode }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border-subtle bg-surface px-4 text-primary">
      {children}
    </header>
  );
}

/* TopBarMenu — dropdown panel under the mobile bar */
export function TopBarMenu({ children }: { children: ReactNode }) {
  return <nav className="rounded-b-card border border-t-0 border-border-subtle bg-surface p-4 shadow-card">{children}</nav>;
}

/* SidebarFrame — sticky desktop sidebar column */
export function SidebarFrame({ children }: { children: ReactNode }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6 space-y-4">{children}</div>
    </aside>
  );
}

/* SideNav — sidebar nav panel */
export function SideNav({ children }: { children: ReactNode }) {
  return <nav className="rounded-card border border-border-subtle bg-surface p-2 shadow-card">{children}</nav>;
}

/* SideCard — sidebar promo card */
export function SideCard({ children }: { children: ReactNode }) {
  return <div className="rounded-card border border-border-subtle bg-surface p-4 shadow-card">{children}</div>;
}
