"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cluster } from "@/components/ui/layout";
import { Text } from "@/components/ui/typography";
import { Icon, BrandMark } from "@/components/ui/icon";
import { DesktopHeaderFrame, HeaderInner } from "@/components/ui/chrome";
import { copy } from "@/content/copy";
import { Plus } from "lucide-react";

export function DesktopHeader() {
  return (
    <DesktopHeaderFrame>
      <HeaderInner>
        <Link href="/">
          <BrandMark name={copy.brand.name} />
        </Link>

        <Cluster gap="md">
          <Text size="meta" tone="mist" weight="semibold">
            {copy.header.todayRideCount(6)}
          </Text>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/share">
              <Icon icon={Plus} size="xs" /> {copy.nav.shareRide}
            </Link>
          </Button>
        </Cluster>
      </HeaderInner>
    </DesktopHeaderFrame>
  );
}
