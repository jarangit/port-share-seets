"use client";
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Page, PageHeader, Stack, PairGrid, FormGrid } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon, IconBox } from "@/components/ui/icon";
import { Field } from "@/components/ui/field";
import { BackLink } from "@/components/ui/nav";
import { RadioGroup, RadioOption } from "@/components/ui/radio-group";
import { vehicleMeta } from "@/components/atoms/badges";
import { RideOfferCard } from "@/features/rides/components/ride-offer-card";
import { users } from "@/features/users/data/users";
import type { RideOffer, VehicleType } from "@/features/rides/types";
import { Check, ArrowRight, ArrowLeft, type LucideIcon } from "lucide-react";

const vehicleOptions: { id: VehicleType; label: string; icon: LucideIcon }[] = [
  { id: "car", label: vehicleMeta.car.label, icon: vehicleMeta.car.icon },
  { id: "motorbike", label: vehicleMeta.motorbike.label, icon: vehicleMeta.motorbike.icon },
];

type DayTab = "today" | "tomorrow";

const dayOptions: { id: DayTab; label: string }[] = [
  { id: "today", label: "วันนี้" },
  { id: "tomorrow", label: "พรุ่งนี้" },
];

/* Format Thai mobile digits as 08x-xxx-xxxx while typing. */
const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)]
    .filter(Boolean)
    .join("-");
};

export default function PostPage() {
  const [done, setDone] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [day, setDay] = useState<DayTab>("today");
  const [phone, setPhone] = useState("086-123-4567");
  const [preview, setPreview] = useState<RideOffer | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const goNext = () => {
    if (formRef.current?.reportValidity()) setStep(2);
  };

  /* Build a real RideOffer from the form so the confirmation
     screen can preview the exact card others will see. */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const str = (key: string) => String(fd.get(key) ?? "").trim();
    const seats = Math.max(1, parseInt(str("seats"), 10) || 1);
    const me = users.me;
    const driverName = str("driverName") || me.name;
    setPreview({
      id: "preview",
      driver: {
        ...me,
        name: driverName,
        initials: driverName.charAt(0),
        facebookUrl: str("facebookUrl") || undefined,
      },
      origin: str("origin"),
      destination: str("destination"),
      departureTime: str("departureTime") || "07:30",
      dateLabel: day === "today" ? "วันนี้" : "พรุ่งนี้",
      via: str("via")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      seatsTotal: seats,
      seatsLeft: seats,
      pickupPoints: [],
      vehicle: {
        type: vehicleType,
        model: me.vehicle?.model ?? "-",
        color: me.vehicle?.color ?? "-",
        plate: me.vehicle?.plate ?? "-",
      },
      contact: { phone: str("phone"), lineId: str("lineId") },
      note: str("note") || undefined,
      postedAgo: "เมื่อสักครู่",
    });
  };

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
                  หลักสี่ <Icon icon={ArrowRight} size="xs" inline /> สยาม •{" "}
                  {day === "today" ? "วันนี้" : "พรุ่งนี้"} • ออก 07:30 น. • ว่าง 2 ที่ •{" "}
                  {vehicleMeta[vehicleType].label}
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

  if (preview) {
    return (
      <Page>
        <PageHeader>
          <Title as="h1" size="page">
            ตรวจสอบข้อมูล
          </Title>
        </PageHeader>

        <Text size="caption" tone="muted" weight="semibold">
          ขั้นตอนที่ 3 จาก 3 • ยืนยัน
        </Text>

        <Stack gap="md">
          <Text size="meta" tone="muted" align="center">
            การ์ดด้านล่างคือสิ่งที่คนอื่นจะเห็น
          </Text>
          <RideOfferCard offer={preview} interactive={false} />
          <PairGrid>
            <Button variant="outline" width="full" type="button" onClick={() => setPreview(null)}>
              <Icon icon={ArrowLeft} size="xs" /> แก้ไขข้อมูล
            </Button>
            <Button
              width="full"
              type="button"
              onClick={() => {
                setPreview(null);
                setDone(true);
              }}
            >
              ยืนยันแชร์เส้นทาง
            </Button>
          </PairGrid>
        </Stack>
      </Page>
    );
  }

  return (
    <Page>
      <BackLink href="/my-posts" label="กลับ" />
      <PageHeader>
        <Title as="h1" size="page" icon={vehicleMeta[vehicleType].icon}>
          แชร์ที่ว่างของคุณ
        </Title>
      </PageHeader>

      <Text size="caption" tone="muted" weight="semibold">
        ขั้นตอนที่ {step} จาก 3 • {step === 1 ? "เส้นทาง" : "ช่องทางติดต่อ"}
      </Text>

      <form ref={formRef} onSubmit={handleSubmit}>
        <FormGrid>
          <div hidden={step !== 1}>
            <Card>
              <CardBody pad="even">
                <Stack gap="md">
                  <Title as="h2" size="section">
                    คุณจะไปทางไหน
                  </Title>
                <Field label="ต้นทาง">
                  <Input name="origin" required placeholder="เช่น หลักสี่" />
                </Field>
                <Field label="ปลายทาง">
                  <Input name="destination" required placeholder="เช่น สยาม" />
                </Field>
                <PairGrid>
                  <Field label="เวลาออก">
                    <Input name="departureTime" required type="time" defaultValue="07:30" />
                  </Field>
                  <Field label="ที่ว่างในรถ">
                    <Input
                      name="seats"
                      required
                      placeholder="2"
                      defaultValue="2"
                      inputMode="numeric"
                    />
                  </Field>
                </PairGrid>
                <Field label="วันที่เดินทาง">
                  <RadioGroup
                    value={day}
                    onValueChange={(v) => setDay(v as DayTab)}
                    orientation="horizontal"
                  >
                    {dayOptions.map((o) => (
                      <RadioOption key={o.id} value={o.id} label={o.label} />
                    ))}
                  </RadioGroup>
                </Field>
                <Field label="ประเภทรถ">
                  <RadioGroup
                    value={vehicleType}
                    onValueChange={(v) => setVehicleType(v as VehicleType)}
                    orientation="horizontal"
                  >
                    {vehicleOptions.map((o) => (
                      <RadioOption key={o.id} value={o.id} label={o.label} icon={o.icon} />
                    ))}
                  </RadioGroup>
                </Field>
                <Field label="เส้นทางผ่าน (คั่นด้วยคอมมา)">
                  <Input name="via" placeholder="วิภาวดี, อนุสาวรีย์" />
                </Field>
                  <Button type="button" size="lg" width="full" onClick={goNext}>
                    ถัดไป <Icon icon={ArrowRight} size="xs" />
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </div>

          <div hidden={step !== 2}>
            <Card>
              <CardBody pad="even">
                <Stack gap="md">
                  <Title as="h2" size="section">
                    ติดต่อคุณได้ทางไหน
                  </Title>
                  <Field label="ชื่อผู้แชร์">
                    <Input
                      name="driverName"
                      required
                      placeholder="เช่น ต้น"
                      defaultValue={users.me.name}
                    />
                  </Field>
                  <Field label="เบอร์โทร">
                    <Input
                      name="phone"
                      placeholder="08x-xxx-xxxx"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                    />
                  </Field>
                <Field label="LINE ID">
                  <Input name="lineId" required placeholder="line id ของคุณ" defaultValue="me.share" />
                </Field>
                <Field label="Facebook URL">
                  <Input
                    name="facebookUrl"
                    placeholder="เช่น https://www.facebook.com/..."
                    defaultValue={users.me.facebookUrl}
                    inputMode="url"
                  />
                </Field>
                <Field label="รายละเอียดเพิ่มเติม">
                  <Textarea name="note" placeholder="เช่น ออกทุกเช้า ทักมาได้เลย" />
                </Field>
                  <PairGrid>
                    <Button variant="outline" width="full" type="button" onClick={() => setStep(1)}>
                      <Icon icon={ArrowLeft} size="xs" /> ย้อนกลับ
                    </Button>
                    <Button type="submit" size="lg" width="full">
                      แชร์เส้นทาง
                    </Button>
                  </PairGrid>
                  <Text size="micro" tone="faint" align="center">
                    แชร์ฟรี ไม่มีค่าใช้จ่าย
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </div>
        </FormGrid>
      </form>
    </Page>
  );
}
