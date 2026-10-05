import { Page, Stack, NarrowCenter } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { ActionCard } from "@/components/ui/cards";
import { BackLink } from "@/components/ui/nav";
import { Zap, User } from "lucide-react";

export default function SharePage() {
  return (
    <Page variant="landing">
      <NarrowCenter>
        <Stack gap="md">
          <BackLink href="/" label="กลับ" />
          <Title as="h1" size="hero">
            จะลงข้อมูลแบบไหน?
          </Title>

          <Stack gap="md">
            <ActionCard href="/post" tone="ink" icon={Zap} title="Guest" desc="ใช้ทันที ไม่ต้องเข้าสู่ระบบ" />
            <ActionCard
              href="/register"
              tone="raised"
              icon={User}
              title="สมาชิก"
              desc="ใช้แค่เบอร์ เพิ่มความน่าเชื่อถือ"
            />
          </Stack>

          <Text size="micro" tone="faint" align="center">
            Guest ลงได้เลย ไม่ต้องจำรหัส
          </Text>
        </Stack>
      </NarrowCenter>
    </Page>
  );
}
