import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Page, PageHeader, Stack, Cluster, FormGrid } from "@/components/ui/layout";
import { Surface } from "@/components/ui/surface";
import { Title, Text } from "@/components/ui/typography";
import { Icon, LineIcon } from "@/components/ui/icon";
import { ContactRow } from "@/components/ui/rows";
import { TextLink } from "@/components/ui/nav";
import { TrustProfileCard } from "@/components/organisms/trust-profile-card";
import { myOffers } from "@/data/rides";
import { users } from "@/data/users";
import { Settings, CarFront, Phone, User, BadgeCheck, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const me = users.me;
  return (
    <Page>
      <PageHeader layout="bar">
        <Title as="h1" size="page" icon={User}>
          ฉัน
        </Title>
        <Button variant="outline" size="icon" aria-label="ตั้งค่า">
          <Icon icon={Settings} size="xs" />
        </Button>
      </PageHeader>

      <FormGrid>
        <TrustProfileCard user={me} />

        <Stack gap="md">
          <Card>
            <CardBody pad="even">
              <Stack gap="md">
                <Title as="h2" size="section" icon={BadgeCheck}>
                  ยืนยันตัวตน
                </Title>
                <Surface tone="success" pad="md">
                  <Cluster justify="between" gap="sm">
                    <Text weight="bold">เบอร์โทร</Text>
                    <Badge variant="success">ยืนยันแล้ว</Badge>
                  </Cluster>
                </Surface>
                <Surface tone="wash" pad="md">
                  <Cluster justify="between" gap="sm">
                    <Text weight="bold">บัตรประชาชน / ใบขับขี่</Text>
                    <Badge variant="secondary">ยังไม่ยืนยัน</Badge>
                  </Cluster>
                </Surface>
                <Button width="full">เพิ่มความน่าเชื่อถือ</Button>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardBody pad="even">
              <Stack gap="md">
                <Title as="h2" size="section" icon={CarFront}>
                  รถของฉัน
                </Title>
                <Input defaultValue="Toyota Yaris • ขาว • กท 7788" aria-label="รถของฉัน" />
                <Title as="h2" size="section" icon={Phone}>
                  ช่องทางติดต่อ
                </Title>
                <Input defaultValue="086-123-4567" aria-label="เบอร์โทร" />
                <Input
                  defaultValue={me.facebookUrl ?? ""}
                  placeholder="https://www.facebook.com/..."
                  aria-label="Facebook"
                />
                <ContactRow icon={LineIcon}>
                  <Text as="span" weight="medium">
                    LINE: me.share
                  </Text>
                </ContactRow>
                <Button variant="outline" width="full">
                  บันทึก
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </FormGrid>

      <Stack gap="md">
        <Cluster justify="between" gap="sm">
          <Title as="h2" size="section">
            เส้นทางที่ฉันแชร์ ({myOffers.length})
          </Title>
          <TextLink href="/my-posts">
            ดูทั้งหมด <Icon icon={ArrowRight} size="xs" inline />
          </TextLink>
        </Cluster>
        {myOffers.map((o) => (
          <Card key={o.id}>
            <CardBody pad="even">
              <Cluster justify="between" gap="sm">
                <Stack gap="sm">
                  <Text weight="bold">
                    <Icon icon={CarFront} size="xs" inline spaced="after" />
                    {o.origin} <Icon icon={ArrowRight} size="xs" inline /> {o.destination}
                  </Text>
                  <Text size="caption" tone="muted">
                    {o.dateLabel} • ออก {o.departureTime} น. • ว่าง {o.seatsLeft} ที่
                  </Text>
                </Stack>
                <Badge variant="success">เปิดรับอยู่</Badge>
              </Cluster>
            </CardBody>
          </Card>
        ))}
        <Text size="micro" tone="faint" align="center">
          สมาชิกตั้งแต่ {me.memberSince}
        </Text>
      </Stack>
    </Page>
  );
}
