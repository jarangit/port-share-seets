import { Card, CardBody } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Cluster, Grow, Stack } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { CardLink } from "@/components/ui/nav";
import { DriverQuickActions } from "@/components/molecules/driver-quick-actions";
import { ArrowRight, BadgeCheck, ChevronRight, Clock, Route as RouteIcon, Users } from "lucide-react";
import type { ReactNode } from "react";
import type { RideOffer } from "@/features/rides/types";
import { vehicleMeta } from "@/components/atoms/badges";

/* CardSection — link wrapper, or a plain fragment in preview mode
   (confirmation screen shows the real card without navigating away). */
function CardSection({
  href,
  label,
  interactive,
  children,
}: {
  href: string;
  label: string;
  interactive: boolean;
  children: ReactNode;
}) {
  if (!interactive) return <>{children}</>;
  return (
    <CardLink href={href} label={label}>
      {children}
    </CardLink>
  );
}

/* RideCard — quiet list card. Trip info + driver open the detail;
   quick actions sit beside the driver (never nested inside a link).
   Information hierarchy: route → trip facts (time/via/vehicle) → driver. */
export function RideOfferCard({ offer, interactive = true }: { offer: RideOffer; interactive?: boolean }) {
  const verified = offer.driver.verifiedPhone && offer.driver.verifiedId;
  const href = `/offer/${offer.id}`;
  const vehicle = vehicleMeta[offer.vehicle.type];
  return (
      <Card>
        <CardBody pad="spacious">
          <Stack gap="md">
            <CardSection
              href={href}
              label={`${offer.origin} ไป ${offer.destination} ออก ${offer.departureTime} น. ว่าง ${offer.seatsLeft} ที่`}
              interactive={interactive}
            >
              <Stack gap="md">
                <Cluster align="start" justify="between" gap="sm">
                  <Title as="p" size="card">
                    {offer.origin} <Icon icon={ArrowRight} size="xs" inline /> {offer.destination}
                  </Title>
                  <Cluster gap="sm">
                    <Badge variant="success">
                      <Icon icon={Users} size="xs" /> ว่าง {offer.seatsLeft} ที่
                    </Badge>
                    <Icon icon={ChevronRight} size="sm" tone="faint" />
                  </Cluster>
                </Cluster>

                <Stack gap="sm">
                  <Text size="meta" tone="soft" weight="semibold">
                    <Icon icon={Clock} size="xs" tone="faint" inline spaced="after" />
                    {offer.dateLabel} • ออก {offer.departureTime} น.
                  </Text>
                  <Text size="caption" tone="muted" lines={1}>
                    <Icon icon={RouteIcon} size="xs" tone="faint" inline spaced="after" />
                    ผ่านทาง {offer.via.join(" • ")}
                  </Text>
                  <Text size="caption" tone="muted">
                    <Icon icon={vehicle.icon} size="xs" tone="faint" inline spaced="after" />
                    {vehicle.label} • {offer.vehicle.model} • สี{offer.vehicle.color} • ทะเบียน{" "}
                    {offer.vehicle.plate}
                  </Text>
                </Stack>
              </Stack>
            </CardSection>

            <Cluster align="start" justify="between" gap="sm">
              <Grow>
                <CardSection
                  href={href}
                  label={`ดูรายละเอียดรถของ ${offer.driver.name}`}
                  interactive={interactive}
                >
                  <Cluster gap="sm">
                    <Avatar tone={offer.driver.avatarTone}>
                      {offer.driver.avatarUrl && <AvatarImage src={offer.driver.avatarUrl} alt={offer.driver.name} />}
                      <AvatarFallback>{offer.driver.initials}</AvatarFallback>
                    </Avatar>
                    <Stack gap="sm">
                      <Cluster gap="sm">
                        <Text as="span" weight="bold" size="meta">
                          {offer.driver.name}
                        </Text>
                        {verified && <Icon icon={BadgeCheck} size="xs" tone="verified" />}
                      </Cluster>
                      <Text as="span" size="caption" tone="muted">
                        แชร์การเดินทาง {offer.driver.sharedCount} ครั้ง
                      </Text>
                    </Stack>
                  </Cluster>
                </CardSection>
              </Grow>
              <DriverQuickActions
                phone={offer.contact.phone}
                lineId={offer.contact.lineId}
                facebookUrl={offer.driver.facebookUrl}
                driverName={offer.driver.name}
                hidden={offer.seatsLeft === 0}
              />
            </Cluster>
          </Stack>
        </CardBody>
      </Card>
  );
}
