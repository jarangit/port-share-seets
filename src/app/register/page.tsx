"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Page, Stack, NarrowCenter } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { BackLink } from "@/components/ui/nav";
import { IconBox } from "@/components/ui/icon";
import { Check } from "lucide-react";

type Step = "phone" | "otp" | "done";

const RESEND_COOLDOWN = 60;
const MAX_ATTEMPTS = 5;
const MEMBER_KEY = "pdk-member-phone";

function makeOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const THAI_DIGITS = "๐๑๒๓๔๕๖๗๘๙";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function normalizePhone(v: string) {
  return v
    .replace(/[๐-๙]/g, (d) => String(THAI_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/[^\d]/g, "");
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [expected, setExpected] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (step !== "otp" || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  function sendOtp(to: string) {
    const digits = normalizePhone(to);
    if (digits.length < 9) {
      setError("กรุณากรอกเบอร์โทรให้ครบ");
      return;
    }
    setExpected(makeOtp());
    setOtp("");
    setError("");
    setAttempts(0);
    setResendIn(RESEND_COOLDOWN);
    setStep("otp");
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.trim() === expected) {
      try {
        localStorage.setItem(MEMBER_KEY, normalizePhone(phone));
      } catch {
        // localStorage ไม่พร้อมก็ข้ามได้ ยังถือว่ายืนยันสำเร็จในรอบ demo
      }
      setError("");
      setStep("done");
      return;
    }
    const next = attempts + 1;
    setAttempts(next);
    setError(
      next >= MAX_ATTEMPTS ? "กรอกรหัสผิดหลายครั้ง กดส่งรหัสใหม่อีกครั้ง" : "รหัสไม่ถูกต้อง ลองอีกครั้ง"
    );
  }

  if (step === "done") {
    return (
      <Page variant="landing">
        <NarrowCenter>
          <Card>
            <CardBody pad="tall">
              <Stack gap="md" align="center">
                <IconBox icon={Check} size="lg" tone="success" shape="circle" />
                <Stack gap="sm" align="center">
                  <Title as="h1" size="name">
                    ยืนยันเบอร์แล้ว
                  </Title>
                  <Text size="meta" tone="muted" align="center" narrow>
                    เบอร์ {phone} ช่วยเพิ่มความน่าเชื่อถือให้คนหารถกล้าติดต่อมา
                  </Text>
                </Stack>
                <Button width="full" asChild>
                  <Link href="/post">ไปแชร์รถเลย</Link>
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </NarrowCenter>
      </Page>
    );
  }

  return (
    <Page variant="landing">
      <NarrowCenter>
        <Stack gap="md">
          <BackLink href="/share" label="กลับ" />
          <Title as="h1" size="hero">
            สมัครสมาชิก
          </Title>
          <Text size="meta" tone="muted" align="center">
            ใช้แค่เบอร์ เพิ่มความน่าเชื่อถือ
          </Text>

          {step === "phone" ? (
            <Card>
              <CardBody pad="even">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendOtp(phone);
                  }}
                >
                  <Stack gap="md">
                    <Field label="เบอร์โทร">
                      <Input
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08x-xxx-xxxx"
                        inputMode="tel"
                      />
                    </Field>
                    {error ? (
                      <Text size="caption" weight="medium" tone="danger" align="center">
                        {error}
                      </Text>
                    ) : null}
                    <Button type="submit" size="lg" width="full">
                      ส่งรหัส OTP
                    </Button>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody pad="even">
                <form onSubmit={verify}>
                  <Stack gap="md">
                    <Stack gap="sm">
                      <Text size="meta" tone="muted" align="center">
                        ส่งรหัส 6 หลักไปที่ {phone}
                      </Text>
                      <Text size="micro" tone="faint" align="center">
                        Demo: รหัสของคุณคือ {expected}
                      </Text>
                    </Stack>
                    <Field label="รหัส OTP 6 หลัก">
                      <Input
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                        placeholder="••••••"
                        inputMode="numeric"
                        maxLength={6}
                      />
                    </Field>
                    {error ? (
                      <Text size="caption" weight="medium" tone="danger" align="center">
                        {error}
                      </Text>
                    ) : null}
                    <Button type="submit" size="lg" width="full">
                      ยืนยันรหัส
                    </Button>
                    <Stack gap="sm">
                      <Button
                        type="button"
                        variant="ghost"
                        width="full"
                        disabled={resendIn > 0}
                        onClick={() => sendOtp(phone)}
                      >
                        {resendIn > 0 ? `ส่งอีกครั้งใน ${resendIn} วิ` : "ส่งรหัสอีกครั้ง"}
                      </Button>
                      <Button type="button" variant="ghost" width="full" onClick={() => setStep("phone")}>
                        เปลี่ยนเบอร์โทร
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          )}
        </Stack>
      </NarrowCenter>
    </Page>
  );
}
