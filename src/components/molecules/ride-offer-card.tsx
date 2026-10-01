import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cluster, Stack } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { DetailLink } from "@/components/ui/nav";
import { ContactActions } from "@/components/molecules/contact-actions";
import { ArrowRight, BadgeCheck, Clock, Route as RouteIcon, CarFront, Users } from "lucide-react";
import type { RideOffer } from "@/lib/types";

export function RideOfferCard({ offer }: { offer: RideOffer }) {
  const verified = offer.driver.verifiedPhone && offer.driver.verifiedId;
  return (
    <Card>
      <CardBody pad="even">
        <Stack gap="md">
          <Stack gap="sm">
            <Cluster align="start" justify="between" gap="sm">
              <Title as="p" size="card">
                {offer.origin} <Icon icon={ArrowRight} size="xs" inline /> {offer.destination}
              </Title>
              <Badge variant="success">
                <Icon icon={Users} size="xs" /> มีที่ว่าง {offer.seatsLeft} ที่
              </Badge>
            </Cluster>

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
              {offer.vehicle.model} สี{offer.vehicle.color} • ทะเบียน {offer.vehicle.plate} • {offer.driver.name}
              {verified && <Icon icon={BadgeCheck} size="xs" tone="verified" inline spaced="before" />}
            </Text>
          </Stack>

          <Stack gap="sm">
            <ContactActions phone={offer.contact.phone} lineId={offer.contact.lineId} compact />
            <DetailLink href={`/offer/${offer.id}`} label="ดูให้ชัดขึ้น" />
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}
