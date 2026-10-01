"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Page, PageHeader, Stack, PairGrid, FormGrid } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon, IconBox } from "@/components/ui/icon";
import { Field } from "@/components/ui/field";
import { BackLink } from "@/components/ui/nav";
import { Check, CarFront, ArrowRight } from "lucide-react";

export default function PostPage() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Page>
        <Card>
          <CardBody pad="tall">
            <Stack gap="md" align="center">
              <IconBox icon={Check} size="lg" tone="success" shape="circle" />
              <Stack gap="sm" align="center">
                <Title as="h1" size="name">
                  พร้อมช่วยแล้ว
                </Title>
                <Text size="meta" tone="muted" align="center" narrow>
                  หลักสี่ <Icon icon={ArrowRight} size="xs" inline /> สยาม • ออก 07:30 น. • ว่าง 2 ที่
                  ถ้ามีใครไปทางเดียวกัน เขาจะติดต่อคุณทางโทรหรือ LINE
                </Text>
              </Stack>
              <PairGrid>
                <Button variant="outline" width="full" asChild>
                  <Link href="/my-posts">ดูเส้นทางที่แชร์</Link>
                </Button>
                <Button width="full" asChild>
                  <Link href="/find">ดูรถที่เปิดรับ</Link>
                </Button>
              </PairGrid>
            </Stack>
          </CardBody>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <BackLink href="/my-posts" label="กลับ" />
      <PageHeader>
        <Title as="h1" size="page" icon={CarFront}>
          แชร์ที่ว่างของคุณ
        </Title>
      </PageHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <FormGrid>
          <Card>
            <CardBody pad="even">
              <Stack gap="md">
                <Title as="h2" size="section">
                  คุณจะไปทางไหน
                </Title>
                <Field label="ต้นทาง">
                  <Input required placeholder="เช่น หลักสี่" />
                </Field>
                <Field label="ปลายทาง">
                  <Input required placeholder="เช่น สยาม" />
                </Field>
                <PairGrid>
                  <Field label="เวลาออก">
                    <Input required placeholder="07:30" defaultValue="07:30" />
                  </Field>
                  <Field label="ที่ว่างในรถ">
                    <Input required placeholder="2" defaultValue="2" inputMode="numeric" />
                  </Field>
                </PairGrid>
                <Field label="เส้นทางผ่าน (คั่นด้วยคอมมา)">
                  <Input placeholder="วิภาวดี, อนุสาวรีย์" />
                </Field>
                <Field label="จุดรับที่สะดวก">
                  <Textarea placeholder="เช่น MRT หลักสี่ ทางออก 3" />
                </Field>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardBody pad="even">
              <Stack gap="md">
                <Title as="h2" size="section">
                  ติดต่อคุณได้ทางไหน
                </Title>
                <Field label="เบอร์โทร">
                  <Input required placeholder="08x-xxx-xxxx" defaultValue="086-123-4567" />
                </Field>
                <Field label="LINE ID">
                  <Input required placeholder="line id ของคุณ" defaultValue="me.share" />
                </Field>
                <Field label="รายละเอียดเพิ่มเติม">
                  <Textarea placeholder="เช่น ออกทุกเช้า ทักมาได้เลย" />
                </Field>
                <Button type="submit" size="lg" width="full">
                  แชร์เส้นทาง
                </Button>
                <Text size="micro" tone="faint" align="center">
                  แชร์ฟรี ไม่มีค่าใช้จ่าย
                </Text>
              </Stack>
            </CardBody>
          </Card>
        </FormGrid>
      </form>
    </Page>
  );
}
