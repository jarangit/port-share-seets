import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/avatar";
import { Page, Stack, Cluster, Grow } from "@/components/ui/layout";
import { Surface } from "@/components/ui/surface";
import { Title, Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { BackLink } from "@/components/ui/nav";
import { RouteTimeline } from "@/components/ui/route-timeline";
import { Disclosure } from "@/components/ui/disclosure";
import { UserRow } from "@/components/atoms/user-row";
import { DriverQuickActions } from "@/components/molecules/driver-quick-actions";
import { TrustProfileCard } from "@/components/organisms/trust-profile-card";
import { getOffer, rideOffers, myOffers } from "@/features/rides/data/rides";
import { Clock3, ArrowRight, ChevronDown } from "lucide-react";

export function generateStaticParams() {
  return [...rideOffers, ...myOffers].map((o) => ({ id: o.id }));
}

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = getOffer(id);
  if (!offer) notFound();

  const full = offer.seatsLeft === 0;

  return (
    <Page>
      <BackLink href="/find" label="กลับไปดูรถทั้งหมด" />

      <Stack gap="md">
            {/* 1 — Hero summary + route */}
            <Card>
              <CardBody pad="roomy">
                <Stack gap="md">
                  <Cluster align="start" justify="between" gap="sm">
                    <Stack gap="sm">
                      <Title as="p" size="route">
                        {offer.origin} <Icon icon={ArrowRight} size="sm" inline /> {offer.destination}
                      </Title>
                      <Text weight="semibold" tone="soft">
                        <Icon icon={Clock3} size="xs" inline spaced="after" />
                        {offer.dateLabel} • ออก {offer.departureTime} น.
                      </Text>
                    </Stack>
                    {full ? (
                      <Badge variant="secondary">เต็มแล้ว</Badge>
                    ) : (
                      <Badge variant="success">ว่าง {offer.seatsLeft} ที่</Badge>
                    )}
                  </Cluster>
                  <Text size="caption" tone="muted">
                    โพสต์เมื่อ {offer.postedAgo}
                  </Text>
                  <Separator />
                  <Stack gap="sm">
                    <Title as="h2" size="section">
                      จะผ่านทางไหนบ้าง
                    </Title>
                    <RouteTimeline points={[offer.origin, ...offer.via, offer.destination]} />
                  </Stack>
                  {offer.note && (
                    <Surface tone="brand" pad="md">
                      <Text size="meta" weight="medium">
                        “{offer.note}”
                      </Text>
                    </Surface>
                  )}
                </Stack>
              </CardBody>
            </Card>

            {/* 2 — Driver trust preview + expandable full profile */}
            <Card>
              <CardBody pad="even">
                <Stack gap="md">
                  <Cluster align="start" justify="between" gap="sm">
                    <Grow>
                      <UserRow user={offer.driver} sub={`โพสต์เมื่อ ${offer.postedAgo}`} />
                    </Grow>
                    <DriverQuickActions
                      phone={offer.contact.phone}
                      lineId={offer.contact.lineId}
                      facebookUrl={offer.driver.facebookUrl}
                      driverName={offer.driver.name}
                      hidden={full}
                    />
                  </Cluster>
                  <Disclosure
                    openLabel="ดูโปรไฟล์เต็ม"
                    closeLabel="ซ่อนโปรไฟล์เต็ม"
                    chevron={<Icon icon={ChevronDown} size="xs" inline />}
                  >
                    <TrustProfileCard user={offer.driver} />
                  </Disclosure>
                </Stack>
              </CardBody>
            </Card>

            {/* 3 — Escape hatch */}
            <Button variant="outline" width="full" asChild>
              <Link href="/find">ดูคันอื่น</Link>
            </Button>
      </Stack>
    </Page>
  );
}
