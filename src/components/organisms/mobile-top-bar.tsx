"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ClipboardList, Plus, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cluster, Stack } from "@/components/ui/layout";
import { Icon, BrandMark } from "@/components/ui/icon";
import { NavItem } from "@/components/ui/nav";
import { IconButton } from "@/components/ui/controls";
import { Fade } from "@/components/ui/fade";
import { TopBarFrame, TopBarRow, TopBarMenu, TopBarScrim } from "@/components/ui/chrome";
import {
  RIDE_SEARCH_INPUT_ID,
  SEARCH_VISIBILITY_EVENT,
  type SearchVisibilityDetail,
} from "@/lib/search-shortcut";
import { copy } from "@/content/copy";

const items = [
  { href: "/", label: copy.nav.findRide, icon: Search, match: ["/", "/offer"] },
  { href: "/my-posts", label: copy.nav.myRoutes, icon: ClipboardList, match: ["/my-posts", "/post", "/share"] },
  { href: "/profile", label: copy.nav.profile, icon: User, match: ["/profile"] },
];

export function MobileTopBar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  /* The ride search feed reports whether its input is on screen.
     Gated by pathname since only the home page has a search input;
     the feed re-reports on mount when navigating back. */
  const onSearchPage = pathname === "/";

  useEffect(() => {
    const onVisibility = (e: Event) => {
      setShowSearch(!(e as CustomEvent<SearchVisibilityDetail>).detail.visible);
    };
    window.addEventListener(SEARCH_VISIBILITY_EVENT, onVisibility);
    return () => window.removeEventListener(SEARCH_VISIBILITY_EVENT, onVisibility);
  }, []);

  const backToSearch = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(RIDE_SEARCH_INPUT_ID)?.focus({ preventScroll: true });
  };

  return (
    <>
      {open && <TopBarScrim onClose={() => setOpen(false)} />}
      <TopBarFrame>
        <TopBarRow>
          <Link href="/" onClick={() => setOpen(false)}>
            <BrandMark name={copy.brand.name} compact />
          </Link>
          <Cluster>
            <Fade show={showSearch && onSearchPage}>
              <IconButton
                label={copy.topBar.backToSearch}
                icon={{ on: Search, off: Search }}
                onDark
                onClick={backToSearch}
              />
            </Fade>
            <IconButton
              label={open ? copy.topBar.closeMenu : copy.topBar.openMenu}
              icon={{ on: X, off: Menu }}
              toggled={open}
              onDark
              onClick={() => setOpen((v) => !v)}
            />
          </Cluster>
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
                <Link href="/share" onClick={() => setOpen(false)}>
                  <Icon icon={Plus} size="xs" /> {copy.nav.shareRide}
                </Link>
              </Button>
            </Stack>
          </TopBarMenu>
        )}
      </TopBarFrame>
    </>
  );
}
