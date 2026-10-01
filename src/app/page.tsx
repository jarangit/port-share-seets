import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Page, Stack, NarrowCenter, MobileOnly } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon, IconBox } from "@/components/ui/icon";
import { ActionCard } from "@/components/ui/cards";
import { rideOffers } from "@/data/rides";
import { Search, CarFront, ArrowRight } from "lucide-react";

export default function HomePage() {
  const openCount = rideOffers.filter((o) => o.seatsLeft > 0).length;
  const seatCount = rideOffers.reduce((sum, o) => sum + o.seatsLeft, 0);

  return (
    <Page variant="landing">
      <NarrowCenter>
        <Stack gap="lg">
          <Stack gap="md">
            <IconBox icon={CarFront} size="lg" tone="ink" />
            <Stack gap="sm">
              <Text size="meta" weight="bold" tone="muted" align="center">
                ไปด้วยกัน
              </Text>
              <Title as="h1" size="hero">
                วันนี้อยากเดินทางแบบไหน?
              </Title>
            </Stack>
          </Stack>

          <Stack gap="md">
            <ActionCard
              href="/find"
              tone="ink"
              icon={Search}
              title="หารถที่ไปทางเดียวกัน"
              desc="ดูคนที่พอแวะรับได้ แล้วติดต่อกันได้เลย"
            />
            <ActionCard
              href="/post"
              tone="raised"
              icon={CarFront}
              title="มีที่ว่าง ช่วยรับสักคน"
              desc="บอกทางที่คุณจะไป เผื่อมีใครไปด้วยกันได้"
            />
          </Stack>

          <Stack gap="md">
            <Text size="caption" weight="semibold" tone="faint" align="center">
              วันนี้มีรถ {openCount} คัน • ที่ว่าง {seatCount} ที่
            </Text>
            <MobileOnly>
              <Link href="/find">
                <Button variant="ghost" size="sm">
                  ดูรถทั้งหมด <Icon icon={ArrowRight} size="xs" />
                </Button>
              </Link>
            </MobileOnly>
          </Stack>
        </Stack>
      </NarrowCenter>
    </Page>
  );
}
