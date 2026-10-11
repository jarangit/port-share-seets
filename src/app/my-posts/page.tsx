"use client";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Page, PageHeader, Stack, Cluster, CardGrid } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon, LineIcon } from "@/components/ui/icon";
import { useMyRideOffers, useUpdateRideOfferStatus } from "@/features/rides/hooks/ride-offer-queries";
import { vehicleMeta } from "@/components/atoms/badges";
import { copy } from "@/content/copy";
import { Plus, Pencil, Power, ArrowRight, Lightbulb, Clock, Phone } from "lucide-react";

export default function MyPostsPage() {
  const { data: myOffers = [] } = useMyRideOffers();
  const updateStatus = useUpdateRideOfferStatus();

  return (
    <Page>
      <PageHeader layout="row">
        <Title as="h1" size="page">
          {copy.myPosts.title}
        </Title>
        <Button size="sm" width="shrink" asChild>
          <Link href="/post">
            <Icon icon={Plus} size="xs" /> {copy.myPosts.shareMore}
          </Link>
        </Button>
      </PageHeader>

      <CardGrid>
        {myOffers.map((o) => {
          const isClosed = o.seatsLeft === 0;
          return (
            <Card key={o.id} state={isClosed ? "dimmed" : "open"}>
              <CardBody pad="even">
                <Stack gap="md">
                  <Stack gap="sm">
                    <Cluster align="start" justify="between" gap="sm">
                      <Title as="p" size="card">
                        {o.origin} <Icon icon={ArrowRight} size="xs" inline /> {o.destination}
                      </Title>
                      {isClosed ? (
                        <Badge variant="secondary">{copy.myPosts.markFull}</Badge>
                      ) : (
                        <Badge variant="success">{copy.shared.openSeats}</Badge>
                      )}
                    </Cluster>
                    <Text size="meta" tone="soft" weight="semibold">
                      <Icon icon={Clock} size="xs" tone="faint" inline spaced="after" />
                      {copy.shared.tripMeta(o.dateLabel, o.departureTime)} •{" "}
                      {copy.shared.seatsMeta(o.seatsLeft, o.seatsTotal)}
                    </Text>
                    <Text size="caption" tone="muted">
                      <Icon
                        icon={vehicleMeta[o.vehicle.type].icon}
                        size="xs"
                        tone="faint"
                        inline
                        spaced="after"
                      />
                      {vehicleMeta[o.vehicle.type].label} • {o.vehicle.model} •{" "}
                      {copy.shared.vehicleColor(o.vehicle.color)} •{" "}
                      {copy.shared.vehiclePlate(o.vehicle.plate)}
                    </Text>
                  </Stack>

                  <Cluster gap="sm" wrap>
                    <Cluster gap="sm">
                      <Icon icon={Phone} size="xs" />
                      <Text as="span" size="caption" tone="muted">
                        {o.contact.phone}
                      </Text>
                    </Cluster>
                    <Cluster gap="sm">
                      <Icon icon={LineIcon} size="xs" />
                      <Text as="span" size="caption" tone="muted">
                        {o.contact.lineId}
                      </Text>
                    </Cluster>
                  </Cluster>

                  <Cluster gap="sm">
                    <Button variant="outline" size="sm" width="grow">
                      <Icon icon={Pencil} size="xs" /> {copy.shared.edit}
                    </Button>
                    <Button
                      variant={isClosed ? "default" : "secondary"}
                      size="sm"
                      width="grow"
                      onClick={() => updateStatus.mutate({ id: o.id, status: isClosed ? "open" : "full" })}
                      disabled={updateStatus.isPending}
                    >
                      <Icon icon={Power} size="xs" /> {isClosed ? copy.myPosts.reopen : copy.myPosts.markFull}
                    </Button>
                  </Cluster>
                </Stack>
              </CardBody>
            </Card>
          );
        })}
      </CardGrid>

      <Card>
        <CardBody pad="even">
          <Stack gap="sm" align="center">
            <Cluster gap="sm" justify="center">
              <Icon icon={Lightbulb} size="xs" />
              <Text weight="bold" align="center">
                {copy.myPosts.tipTitle}
              </Text>
            </Cluster>
            <Text size="caption" tone="muted" align="center">
              {copy.myPosts.tipReminder(copy.myPosts.markFull)}
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Page>
  );
}
