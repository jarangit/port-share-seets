import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback, Separator } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Cluster, Stack } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon, LineIcon } from "@/components/ui/icon";
import { InfoRow, ContactRow } from "@/components/ui/rows";
import { Flag, Ban, Phone, BadgeCheck } from "lucide-react";
import type { UserProfile } from "@/features/users/types";
import { vehicleMeta } from "@/components/atoms/badges";
import { copy } from "@/content/copy";

export function TrustProfileCard({ user: u }: { user: UserProfile }) {
  return (
    <Card>
      <CardBody pad="roomy">
        <Stack gap="sm" align="center">
          <Avatar tone={u.avatarTone} size="xl">
            {u.avatarUrl && <AvatarImage src={u.avatarUrl} alt={u.name} />}
            <AvatarFallback size="xl">{u.initials}</AvatarFallback>
          </Avatar>
          <Title as="h3" size="name">
            {u.name}
          </Title>
          <Cluster gap="sm" justify="center" wrap>
            {u.verifiedPhone && (
              <Badge variant="success">
                <Icon icon={BadgeCheck} size="xs" /> {copy.trust.phone}
              </Badge>
            )}
            {u.verifiedId && (
              <Badge variant="success">
                <Icon icon={BadgeCheck} size="xs" /> {copy.trust.identity}
              </Badge>
            )}
            {!u.verifiedId && <Badge variant="secondary">{copy.trust.unverifiedIdentity}</Badge>}
          </Cluster>
          <Text size="caption" tone="muted" align="center">
            {copy.trust.memberStats(u.memberSince, u.sharedCount)}
          </Text>
        </Stack>

        {u.vehicle && (
          <>
            <Separator />
            <InfoRow icon={vehicleMeta[u.vehicle.type].icon}>
              <Text as="span" weight="bold">
                {vehicleMeta[u.vehicle.type].label} • {u.vehicle.model}
              </Text>
              <Text as="span" tone="muted">
                {copy.shared.vehicleColor(u.vehicle.color)} • {copy.shared.vehiclePlate(u.vehicle.plate)}
              </Text>
            </InfoRow>
          </>
        )}

        {u.phone && (
          <>
            <Separator />
            <Stack gap="sm">
              <ContactRow icon={Phone}>
                <Text as="span" weight="bold">
                  {u.phone}
                </Text>
              </ContactRow>
              {u.lineId && (
                <ContactRow icon={LineIcon}>
                  <Text as="span" weight="bold">
                    {copy.shared.lineLabel(u.lineId)}
                  </Text>
                </ContactRow>
              )}
            </Stack>
          </>
        )}

        <Separator />
        <Cluster gap="sm">
          <Button variant="outline" width="grow" size="sm">
            <Icon icon={Flag} size="xs" /> {copy.trust.report}
          </Button>
          <Button variant="ghost" width="grow" size="sm">
            <Icon icon={Ban} size="xs" /> {copy.trust.block}
          </Button>
        </Cluster>
      </CardBody>
    </Card>
  );
}
