import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/avatar";
import { Page, Stack, Cluster, PairGrid, DetailLayout } from "@/components/ui/layout";
import { Surface } from "@/components/ui/surface";
import { Title, Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { ContactRow } from "@/components/ui/rows";
import { BackLink } from "@/components/ui/nav";
import { RouteTimeline } from "@/components/ui/route-timeline";
import { MetricCard } from "@/components/ui/cards";
import { UserRow } from "@/components/atoms/user-row";
import { ContactActions } from "@/components/molecules/contact-actions";
import { TrustProfileCard } from "@/components/organisms/trust-profile-card";
import { getOffer, rideOffers, myOffers } from "@/data/rides";
import { Clock3, MapPin, Users, CarFront, Phone, MessageCircle, ArrowRight } from "lucide-react";

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

      <DetailLayout
        main={
          <>
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

                  <Separator />

                  <Stack gap="sm">
                    <Stack gap="sm">
                      <Title as="h2" size="section">
                        จะผ่านทางไหนบ้าง
                      </Title>
                      <RouteTimeline points={[offer.origin, ...offer.via, offer.destination]} />
                    </Stack>
                    <Stack gap="sm">
                      <Title as="h2" size="section" icon={MapPin}>
                        รอรับตรงไหนได้บ้าง
                      </Title>
                      <Stack gap="sm">
                        {offer.pickupPoints.map((p) => (
                          <Surface key={p} tone="wash" pad="md">
                            <Text weight="medium">{p}</Text>
                          </Surface>
                        ))}
                      </Stack>
                    </Stack>
                  </Stack>

                  <PairGrid>
                    <MetricCard
                      icon={Users}
                      value={`${offer.seatsLeft}/${offer.seatsTotal}`}
                      caption="ที่ว่าง"
                    />
                    <MetricCard
                      icon={CarFront}
                      value={offer.vehicle.model}
                      caption={`สี${offer.vehicle.color} • ${offer.vehicle.plate}`}
                    />
                  </PairGrid>

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

            <Card>
              <CardBody pad="even">
                <UserRow user={offer.driver} sub={`โพสต์เมื่อ ${offer.postedAgo}`} />
              </CardBody>
            </Card>
          </>
        }
        side={
          <>
            <Card>
              <CardBody pad="even">
                <Stack gap="md">
                  <Title as="h2" size="section">
                    ติดต่อ{offer.driver.name}ได้เลย
                  </Title>
                  {!full ? (
                    <Stack gap="md">
                      <ContactActions phone={offer.contact.phone} lineId={offer.contact.lineId} />
                      <Stack gap="sm">
                        <ContactRow icon={Phone}>
                          <Text as="span" weight="bold">
                            {offer.contact.phone}
                          </Text>
                        </ContactRow>
                        <ContactRow icon={MessageCircle}>
                          <Text as="span" weight="bold">
                            LINE: {offer.contact.lineId}
                          </Text>
                        </ContactRow>
                      </Stack>
                    </Stack>
                  ) : (
                    <Surface tone="wash" pad="md">
                      <Text weight="bold" tone="muted" align="center">
                        คันนี้เต็มแล้ว ลองดูคันอื่นนะ
                      </Text>
                    </Surface>
                  )}
                  <Text size="micro" tone="faint" align="center">
                    คุยกันได้เลย ไม่ต้องจองผ่านแอป
                  </Text>
                </Stack>
              </CardBody>
            </Card>

            <TrustProfileCard user={offer.driver} />

            <Button variant="outline" width="full" asChild>
              <Link href="/find">ดูคันอื่น</Link>
            </Button>
          </>
        }
      />
    </Page>
  );
}
