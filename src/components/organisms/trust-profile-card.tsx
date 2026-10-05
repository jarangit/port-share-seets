import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback, Separator } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Cluster, Stack } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { InfoRow, ContactRow } from "@/components/ui/rows";
import { Flag, Ban, CarFront, Phone, MessageCircle, BadgeCheck } from "lucide-react";
import type { UserProfile } from "@/lib/types";

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
                <Icon icon={BadgeCheck} size="xs" /> เบอร์โทร
              </Badge>
            )}
            {u.verifiedId && (
              <Badge variant="success">
                <Icon icon={BadgeCheck} size="xs" /> ตัวตน
              </Badge>
            )}
            {!u.verifiedId && <Badge variant="secondary">ยังไม่ยืนยันตัวตน</Badge>}
          </Cluster>
          <Text size="caption" tone="muted" align="center">
            สมาชิกตั้งแต่ {u.memberSince} • แชร์รถแล้ว {u.sharedCount} ครั้ง
          </Text>
        </Stack>

        {u.vehicle && (
          <>
            <Separator />
            <InfoRow icon={CarFront}>
              <Text as="span" weight="bold">
                {u.vehicle.model}
              </Text>
              <Text as="span" tone="muted">
                สี{u.vehicle.color} • {u.vehicle.plate}
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
                <ContactRow icon={MessageCircle}>
                  <Text as="span" weight="bold">
                    LINE: {u.lineId}
                  </Text>
                </ContactRow>
              )}
            </Stack>
          </>
        )}

        <Separator />
        <Cluster gap="sm">
          <Button variant="outline" width="grow" size="sm">
            <Icon icon={Flag} size="xs" /> รายงาน
          </Button>
          <Button variant="ghost" width="grow" size="sm">
            <Icon icon={Ban} size="xs" /> บล็อก
          </Button>
        </Cluster>
      </CardBody>
    </Card>
  );
}
