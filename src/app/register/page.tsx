"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Page, Stack, NarrowCenter } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { BackLink } from "@/components/ui/nav";
import { IconBox } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { useRequestOtp, useVerifyOtp } from "@/features/auth/hooks/otp-queries";
import { otpSchema, phoneSchema, type OtpValues, type PhoneValues } from "@/features/auth/schemas/otp-schema";
import { Check } from "lucide-react";

type Step = "phone" | "otp" | "done";

const RESEND_COOLDOWN = 60;
const MAX_ATTEMPTS = 5;
export default function RegisterPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [expected, setExpected] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [resendIn, setResendIn] = useState(0);
  const requestOtp = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();
  const phoneForm = useForm<PhoneValues>({ resolver: zodResolver(phoneSchema), defaultValues: { phone: "" } });
  const otpForm = useForm<OtpValues>({ resolver: zodResolver(otpSchema), defaultValues: { otp: "" } });

  useEffect(() => {
    if (step !== "otp" || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  async function sendOtp(to: string) {
    const parsed = phoneSchema.safeParse({ phone: to });
    if (!parsed.success) {
      setError(copy.register.phoneIncomplete);
      return;
    }
    const result = await requestOtp.mutateAsync(to);
    setExpected(result.demoCode);
    otpForm.reset({ otp: "" });
    setError("");
    setAttempts(0);
    setResendIn(RESEND_COOLDOWN);
    setStep("otp");
  }

  async function verify(values: OtpValues) {
    const result = await verifyOtpMutation.mutateAsync({ phone, otp: values.otp });
    if (result.ok) {
      setError("");
      setStep("done");
      return;
    }
    const next = attempts + 1;
    setAttempts(next);
    setError(
      next >= MAX_ATTEMPTS ? copy.register.tooManyAttempts : copy.register.wrongOtp
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
                    {copy.register.doneTitle}
                  </Title>
                  <Text size="meta" tone="muted" align="center" narrow>
                    {copy.register.doneHint(phone)}
                  </Text>
                </Stack>
                <Button width="full" asChild>
                  <Link href="/post">{copy.register.goShare}</Link>
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
          <BackLink href="/share" label={copy.shared.back} />
          <Title as="h1" size="hero">
            {copy.register.title}
          </Title>
          <Text size="meta" tone="muted" align="center">
            {copy.register.subtitle}
          </Text>

          {step === "phone" ? (
            <Card>
              <CardBody pad="even">
                <form onSubmit={phoneForm.handleSubmit((values) => {
                  setPhone(values.phone);
                  return sendOtp(values.phone);
                })}>
                  <Stack gap="md">
                    <Field label={copy.shared.phoneLabel}>
                      <Input
                        required
                        placeholder="08x-xxx-xxxx"
                        inputMode="tel"
                        {...phoneForm.register("phone")}
                      />
                    </Field>
                    {error ? (
                      <Text size="caption" weight="medium" tone="danger" align="center">
                        {error}
                      </Text>
                    ) : null}
                    <Button type="submit" size="lg" width="full">
                      {copy.register.sendOtp}
                    </Button>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody pad="even">
                <form onSubmit={otpForm.handleSubmit(verify)}>
                  <Stack gap="md">
                    <Stack gap="sm">
                      <Text size="meta" tone="muted" align="center">
                        {copy.register.otpSentTo(phone)}
                      </Text>
                      <Text size="micro" tone="faint" align="center">
                        {copy.register.demoCode(expected)}
                      </Text>
                    </Stack>
                    <Field label={copy.register.otpLabel}>
                      <Input
                        required
                        {...otpForm.register("otp", {
                          onChange: (e) => otpForm.setValue("otp", e.target.value.replace(/[^\d]/g, "").slice(0, 6)),
                        })}
                        placeholder={copy.register.otpPlaceholder}
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
                      {copy.register.verifyOtp}
                    </Button>
                    <Stack gap="sm">
                      <Button
                        type="button"
                        variant="ghost"
                        width="full"
                        disabled={resendIn > 0}
                        onClick={() => sendOtp(phone)}
                      >
                        {resendIn > 0 ? copy.register.resendIn(resendIn) : copy.register.resend}
                      </Button>
                      <Button type="button" variant="ghost" width="full" onClick={() => setStep("phone")}>
                        {copy.register.changePhone}
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
