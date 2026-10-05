import { Card, CardBody } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Cluster, Stack } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { CardLink } from "@/components/ui/nav";
import { ArrowRight, BadgeCheck, CarFront, ChevronRight, Clock, Route as RouteIcon, Users } from "lucide-react";
import type { RideOffer } from "@/lib/types";

/* RideCard — quiet list card. Whole card opens the trip detail.
   Information hierarchy: route → trip facts (time/via/vehicle) → driver. */
export function RideOfferCard({ offer }: { offer: RideOffer }) {
  const verified = offer.driver.verifiedPhone && offer.driver.verifiedId;
  return (
    <CardLink
      href={`/offer/${offer.id}`}
      label={`${offer.origin} ไป ${offer.destination} ออก ${offer.departureTime} น. ว่าง ${offer.seatsLeft} ที่`}
    >
      <Card>
        <CardBody pad="even">
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
                <Icon icon={CarFront} size="xs" tone="faint" inline spaced="after" />
                {offer.vehicle.model} • สี{offer.vehicle.color} • {offer.vehicle.plate}
              </Text>
            </Stack>

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
          </Stack>
        </CardBody>
      </Card>
    </CardLink>
  );
}
