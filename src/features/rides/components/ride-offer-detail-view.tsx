import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/avatar";
import { Stack, Cluster, Grow } from "@/components/ui/layout";
import { Surface } from "@/components/ui/surface";
import { Title, Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { RouteTimeline } from "@/components/ui/route-timeline";
import { Disclosure } from "@/components/ui/disclosure";
import { UserRow } from "@/components/atoms/user-row";
import { DriverQuickActions } from "@/components/molecules/driver-quick-actions";
import { TrustProfileCard } from "@/components/organisms/trust-profile-card";
import type { RideOffer } from "@/features/rides/types";
import { copy } from "@/content/copy";
import { Clock3, ArrowRight, ChevronDown } from "lucide-react";

/* RideOfferDetailView — hero route card + driver trust card.
   Shared by the offer detail page and the just-created post preview
   so both render exactly the same information. */
export function RideOfferDetailView({ offer }: { offer: RideOffer }) {
  const full = offer.seatsLeft === 0;

  return (
    <>
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
                  {copy.shared.tripMeta(offer.dateLabel, offer.departureTime)}
                </Text>
              </Stack>
              {full ? (
                <Badge variant="secondary">{copy.shared.full}</Badge>
              ) : (
                <Badge variant="success">{copy.shared.availableSeats(offer.seatsLeft)}</Badge>
              )}
            </Cluster>
            <Text size="caption" tone="muted">
              {copy.shared.postedAgo(offer.postedAgo)}
            </Text>
            <Separator />
            <Stack gap="sm">
              <Title as="h2" size="section">
                {copy.offer.routeSectionTitle}
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
                <UserRow user={offer.driver} sub={copy.shared.postedAgo(offer.postedAgo)} />
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
              openLabel={copy.offer.viewFullProfile}
              closeLabel={copy.offer.hideFullProfile}
              chevron={<Icon icon={ChevronDown} size="xs" inline />}
            >
              <TrustProfileCard user={offer.driver} />
            </Disclosure>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
