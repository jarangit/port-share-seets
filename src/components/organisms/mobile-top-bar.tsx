"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ClipboardList, Plus, User, Menu, X, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/layout";
import { Icon, BrandMark } from "@/components/ui/icon";
import { NavItem } from "@/components/ui/nav";
import { IconButton } from "@/components/ui/controls";
import { TopBarFrame, TopBarRow, TopBarMenu } from "@/components/ui/chrome";

const items = [
  { href: "/", label: "เริ่มต้น", icon: House, match: ["/"] },
  { href: "/find", label: "หารถ", icon: Search, match: ["/find", "/offer"] },
  { href: "/my-posts", label: "เส้นทางของฉัน", icon: ClipboardList, match: ["/my-posts", "/post"] },
  { href: "/profile", label: "ฉัน", icon: User, match: ["/profile"] },
];

export function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <TopBarFrame>
      <TopBarRow>
        <Link href="/" onClick={() => setOpen(false)}>
          <BrandMark name="ไปด้วยกัน" compact />
        </Link>
        <IconButton
          label={open ? "ปิดเมนู" : "เปิดเมนู"}
          icon={{ on: X, off: Menu }}
          toggled={open}
          onClick={() => setOpen((v) => !v)}
        />
      </TopBarRow>

      {open && (
        <TopBarMenu>
          <Stack gap="sm">
            {items.map((it) => (
              <NavItem
                key={it.href}
                href={it.href}
                icon={it.icon}
                label={it.label}
                active={it.match.some((m) => pathname === m || pathname.startsWith(m + "/"))}
                onClick={() => setOpen(false)}
              />
            ))}
            <Button width="full" asChild>
              <Link href="/post" onClick={() => setOpen(false)}>
                <Icon icon={Plus} size="xs" /> แชร์รถ
              </Link>
            </Button>
          </Stack>
        </TopBarMenu>
      )}
    </TopBarFrame>
  );
}
