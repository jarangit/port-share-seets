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

const items = [
  { href: "/find", label: "หารถ", icon: Search, match: ["/find", "/offer"] },
  { href: "/my-posts", label: "เส้นทางของฉัน", icon: ClipboardList, match: ["/my-posts", "/post"] },
  { href: "/profile", label: "ฉัน", icon: User, match: ["/profile"] },
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
          <Text weight="bold">มีที่ว่างในรถไหม?</Text>
          <Button width="full" size="sm" asChild>
            <Link href="/post">
              <Icon icon={Plus} size="xs" /> แชร์ที่ว่าง
            </Link>
          </Button>
        </Stack>
      </SideCard>
    </SidebarFrame>
  );
}
