"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Page, PageHeader, Stack, Cluster, CardGrid } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon, LineIcon } from "@/components/ui/icon";
import { myOffers } from "@/features/rides/data/rides";
import { vehicleMeta } from "@/components/atoms/badges";
import { Plus, Pencil, Power, ArrowRight, Lightbulb, Clock, Phone } from "lucide-react";

export default function MyPostsPage() {
  const [closed, setClosed] = useState<string[]>([]);

  return (
    <Page>
      <PageHeader layout="row">
        <Title as="h1" size="page">
          เส้นทางที่ฉันแชร์
        </Title>
        <Button size="sm" width="shrink" asChild>
          <Link href="/post">
            <Icon icon={Plus} size="xs" /> แชร์เพิ่ม
          </Link>
        </Button>
      </PageHeader>

      <CardGrid>
        {myOffers.map((o) => {
          const isClosed = closed.includes(o.id);
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
                        <Badge variant="secondary">ที่นั่งเต็มแล้ว</Badge>
                      ) : (
                        <Badge variant="success">เปิดรับอยู่</Badge>
                      )}
                    </Cluster>
                    <Text size="meta" tone="soft" weight="semibold">
                      <Icon icon={Clock} size="xs" tone="faint" inline spaced="after" />
                      {o.dateLabel} • ออก {o.departureTime} น. • ว่าง {o.seatsLeft}/{o.seatsTotal} ที่
                    </Text>
                    <Text size="caption" tone="muted">
                      <Icon
                        icon={vehicleMeta[o.vehicle.type].icon}
                        size="xs"
                        tone="faint"
                        inline
                        spaced="after"
                      />
                      {vehicleMeta[o.vehicle.type].label} • {o.vehicle.model} • สี{o.vehicle.color} • ทะเบียน{" "}
                      {o.vehicle.plate}
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
                      <Icon icon={Pencil} size="xs" /> แก้ไข
                    </Button>
                    <Button
                      variant={isClosed ? "default" : "secondary"}
                      size="sm"
                      width="grow"
                      onClick={() =>
                        setClosed((prev) =>
                          prev.includes(o.id) ? prev.filter((id) => id !== o.id) : [...prev, o.id]
                        )
                      }
                    >
                      <Icon icon={Power} size="xs" /> {isClosed ? "รับอีกครั้ง" : "ที่นั่งเต็มแล้ว"}
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
                ถ้ามีใครไปทางเดียวกัน เขาจะโทรหรือทัก LINE มาเอง
              </Text>
            </Cluster>
            <Text size="caption" tone="muted" align="center">
              ที่นั่งเต็มเมื่อไหร่ อย่าลืมกด “ที่นั่งเต็มแล้ว” นะ
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Page>
  );
}
