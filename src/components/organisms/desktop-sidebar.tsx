"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ClipboardList, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/layout";
import { Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { NavItem } from "@/components/ui/nav";
import { SidebarFrame, SideNav, SideCard } from "@/components/ui/chrome";
import { copy } from "@/content/copy";

const items = [
  { href: "/", label: copy.nav.findRide, icon: Search, match: ["/", "/offer"] },
  { href: "/my-posts", label: copy.nav.myRoutes, icon: ClipboardList, match: ["/my-posts", "/post", "/share"] },
  { href: "/profile", label: copy.nav.profile, icon: User, match: ["/profile"] },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  return (
    <SidebarFrame>
      <SideNav>
        {items.map((it) => (
          <NavItem
            key={it.href}
            href={it.href}
            icon={it.icon}
            label={it.label}
            active={it.match.some((m) => pathname === m || pathname.startsWith(m + "/"))}
          />
        ))}
      </SideNav>

      <SideCard>
        <Stack gap="md">
          <Text weight="bold">{copy.sidebar.promo}</Text>
          <Button width="full" size="sm" asChild>
            <Link href="/share">
              <Icon icon={Plus} size="xs" /> {copy.nav.shareSeats}
            </Link>
          </Button>
        </Stack>
      </SideCard>
    </SidebarFrame>
  );
}
