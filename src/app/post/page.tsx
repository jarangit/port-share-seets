"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/cards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/avatar";
import { Input, Textarea } from "@/components/ui/input";
import { Page, PageHeader, Stack, Cluster, Grow, PairGrid, FormGrid } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { Icon, IconBox } from "@/components/ui/icon";
import { Surface } from "@/components/ui/surface";
import { Field } from "@/components/ui/field";
import { BackLink } from "@/components/ui/nav";
import { RouteTimeline } from "@/components/ui/route-timeline";
import { Disclosure } from "@/components/ui/disclosure";
import { RadioGroup, RadioOption } from "@/components/ui/radio-group";
import { vehicleMeta } from "@/components/atoms/badges";
import { UserRow } from "@/components/atoms/user-row";
import { DriverQuickActions } from "@/components/molecules/driver-quick-actions";
import { TrustProfileCard } from "@/components/organisms/trust-profile-card";
import type { RideOffer, VehicleType } from "@/features/rides/types";
import { PREVIEW_OFFER_ID, saveCreatedOffer } from "@/features/rides/lib/created-offer";
import { useCreateRideOffer } from "@/features/rides/hooks/ride-offer-queries";
import {
  rideOfferCreateSchema,
  type RideOfferCreateInputValues,
  type RideOfferCreateValues,
} from "@/features/rides/schemas/ride-offer-schema";
import { useCurrentUser } from "@/features/users/hooks/user-queries";
import { isUnauthorized } from "@/lib/api-client";
import { copy } from "@/content/copy";
import { Check, ArrowRight, ArrowLeft, Clock, Clock3, ChevronDown, type LucideIcon } from "lucide-react";

const vehicleOptions: { id: VehicleType; label: string; icon: LucideIcon }[] = [
  { id: "car", label: vehicleMeta.car.label, icon: vehicleMeta.car.icon },
  { id: "motorbike", label: vehicleMeta.motorbike.label, icon: vehicleMeta.motorbike.icon },
];

type DayTab = "today" | "tomorrow";

const dayOptions: { id: DayTab; label: string }[] = [
  { id: "today", label: copy.shared.today },
  { id: "tomorrow", label: copy.shared.tomorrow },
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
  const [preview, setPreview] = useState<RideOffer | null>(null);
  const [createdOffer, setCreatedOffer] = useState<RideOffer | null>(null);
  const createRideOffer = useCreateRideOffer();
  const {
    data: currentUser,
    isLoading: userLoading,
    isError: userError,
    error: userFetchError,
    refetch: refetchUser,
  } = useCurrentUser();
  const form = useForm<RideOfferCreateInputValues, unknown, RideOfferCreateValues>({
    resolver: zodResolver(rideOfferCreateSchema),
    defaultValues: {
      origin: "",
      destination: "",
      departureTime: "07:30",
      seats: 2,
      day: "today",
      vehicleType: "car",
      via: "",
      driverName: "",
      phone: "086-123-4567",
      lineId: "me.share",
      facebookUrl: "",
      note: "",
    },
  });
  const vehicleType = useWatch({ control: form.control, name: "vehicleType" }) as VehicleType;
  useEffect(() => {
    if (!currentUser) return;
    form.reset({
      ...form.getValues(),
      driverName: form.getValues("driverName") || currentUser.name,
      phone: form.getValues("phone") || currentUser.phone || "",
      lineId: form.getValues("lineId") || currentUser.lineId || "",
      facebookUrl: form.getValues("facebookUrl") || currentUser.facebookUrl || "",
    });
  }, [currentUser, form]);

  const goNext = async () => {
    const ok = await form.trigger(["origin", "destination", "departureTime", "seats", "day", "vehicleType", "via"]);
    if (ok) setStep(2);
  };

  const buildPreview = (values: RideOfferCreateValues) => {
    const seats = Math.max(1, values.seats || 1);
    const me = currentUser;
    if (!me) return;
    const driverName = values.driverName.trim() || me.name;
    setPreview({
      id: PREVIEW_OFFER_ID,
      driver: {
        ...me,
        name: driverName,
        initials: driverName.charAt(0),
        facebookUrl: values.facebookUrl || undefined,
      },
      origin: values.origin,
      destination: values.destination,
      departureTime: values.departureTime || "07:30",
      dateLabel: values.day === "today" ? copy.shared.today : copy.shared.tomorrow,
      via: values.via
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      seatsTotal: seats,
      seatsLeft: seats,
      pickupPoints: [],
      vehicle: {
        type: values.vehicleType,
        model: me.vehicle?.model ?? "-",
        color: me.vehicle?.color ?? "-",
        plate: me.vehicle?.plate ?? "-",
      },
      contact: { phone: values.phone, lineId: values.lineId },
      note: values.note?.trim() || undefined,
      postedAgo: copy.post.justNow,
    });
  };

  const confirmShare = async () => {
    if (!preview) return;
    const created = await createRideOffer.mutateAsync(rideOfferCreateSchema.parse(form.getValues()));
    saveCreatedOffer(created);
    setCreatedOffer(created);
    setPreview(null);
    setDone(true);
  };

  if (userLoading) {
    return (
      <Page>
        <EmptyState icon={Clock} title={copy.post.userLoadingTitle} hint={copy.post.userLoadingHint} />
      </Page>
    );
  }

  if (userError || !currentUser) {
    const needsLogin = isUnauthorized(userFetchError);
    return (
      <Page>
        <EmptyState
          icon={Clock}
          title={needsLogin ? copy.shared.requireLoginTitle : copy.post.userErrorTitle}
          hint={needsLogin ? copy.shared.requireLoginHint : copy.post.userErrorHint}
          action={
            needsLogin ? (
              <Button size="sm" asChild>
                <Link href="/register">{copy.shared.goLogin}</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => refetchUser()}>
                {copy.shared.retry}
              </Button>
            )
          }
        />
      </Page>
    );
  }

  if (done) {
    const offer = createdOffer;
    return (
      <Page>
        <Card>
          <CardBody pad="tall">
            <Stack gap="md" align="center">
              <IconBox icon={Check} size="lg" tone="success" shape="circle" />
              <Stack gap="sm" align="center">
                <Title as="h1" size="name">
                  {copy.post.successTitle}
                </Title>
                {offer && (
                  <Text size="meta" tone="muted" align="center" narrow>
                    {offer.origin} <Icon icon={ArrowRight} size="xs" inline /> {offer.destination} •{" "}
                    {copy.shared.tripMeta(offer.dateLabel, offer.departureTime)} •{" "}
                    {copy.shared.availableSeats(offer.seatsLeft)} • {vehicleMeta[offer.vehicle.type].label} {copy.post.successContactHint}
                  </Text>
                )}
                <Text size="caption" tone="muted" align="center">
                  {copy.post.successExpiry}
                </Text>
              </Stack>
              <Button width="full" asChild>
                <Link href={`/offer/${offer?.id ?? PREVIEW_OFFER_ID}`}>{copy.post.viewYourPost}</Link>
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Page>
    );
  }

  /* Preview mirrors /offer/[id] so users confirm exactly what riders
     will see before sharing. */
  if (preview) {
    const full = preview.seatsLeft === 0;
    return (
      <Page>
        <PageHeader>
          <Title as="h1" size="page">
            {copy.post.previewTitle}
          </Title>
        </PageHeader>

        <Text size="caption" tone="muted" weight="semibold">
          {copy.post.stepLabel(3, copy.post.confirmStep)}
        </Text>

        <Stack gap="md">
          <Text size="meta" tone="muted" align="center">
            {copy.post.previewHint}
          </Text>

          {/* 1 — Hero summary + route */}
          <Card>
            <CardBody pad="roomy">
              <Stack gap="md">
                <Cluster align="start" justify="between" gap="sm">
                  <Stack gap="sm">
                    <Title as="p" size="route">
                      {preview.origin} <Icon icon={ArrowRight} size="sm" inline /> {preview.destination}
                    </Title>
                    <Text weight="semibold" tone="soft">
                      <Icon icon={Clock3} size="xs" inline spaced="after" />
                      {copy.shared.tripMeta(preview.dateLabel, preview.departureTime)}
                    </Text>
                  </Stack>
                  {full ? (
                    <Badge variant="secondary">{copy.shared.full}</Badge>
                  ) : (
                    <Badge variant="success">{copy.shared.availableSeats(preview.seatsLeft)}</Badge>
                  )}
                </Cluster>
                <Text size="caption" tone="muted">
                  {copy.shared.postedAgo(preview.postedAgo)}
                </Text>
                <Separator />
                <Stack gap="sm">
                  <Title as="h2" size="section">
                    {copy.offer.routeSectionTitle}
                  </Title>
                  <RouteTimeline points={[preview.origin, ...preview.via, preview.destination]} />
                </Stack>
                {preview.note && (
                  <Surface tone="brand" pad="md">
                    <Text size="meta" weight="medium">
                      “{preview.note}”
                    </Text>
                  </Surface>
                )}
              </Stack>
            </CardBody>
          </Card>

          {/* 2 — Driver trust preview + expandable full profile */}
          <Card>
            <CardBody pad="even">
              <Stack gap="md">
                <Cluster align="start" justify="between" gap="sm">
                  <Grow>
                    <UserRow user={preview.driver} sub={copy.shared.postedAgo(preview.postedAgo)} />
                  </Grow>
                  <DriverQuickActions
                    phone={preview.contact.phone}
                    lineId={preview.contact.lineId}
                    facebookUrl={preview.driver.facebookUrl}
                    driverName={preview.driver.name}
                    hidden={full}
                  />
                </Cluster>
                <Disclosure
                  openLabel={copy.offer.viewFullProfile}
                  closeLabel={copy.offer.hideFullProfile}
                  chevron={<Icon icon={ChevronDown} size="xs" inline />}
                >
                  <TrustProfileCard user={preview.driver} />
                </Disclosure>
              </Stack>
            </CardBody>
          </Card>

          {/* 3 — Confirm / back */}
          {createRideOffer.isError ? (
            isUnauthorized(createRideOffer.error) ? (
              <Stack gap="sm" align="center">
                <Text size="caption" weight="medium" tone="danger" align="center">
                  {copy.shared.requireLoginHint}
                </Text>
                <Button size="sm" asChild>
                  <Link href="/register">{copy.shared.goLogin}</Link>
                </Button>
              </Stack>
            ) : (
              <Text size="caption" weight="medium" tone="danger" align="center">
                {copy.post.createFailed}
              </Text>
            )
          ) : null}
          <PairGrid>
            <Button variant="outline" width="full" type="button" onClick={() => setPreview(null)}>
              <Icon icon={ArrowLeft} size="xs" /> {copy.post.editData}
            </Button>
            <Button
              width="full"
              type="button"
              onClick={confirmShare}
              disabled={createRideOffer.isPending}
            >
              {copy.post.confirmShare}
            </Button>
          </PairGrid>
        </Stack>
      </Page>
    );
  }

  return (
    <Page>
      <BackLink href="/my-posts" label={copy.shared.back} />
      <PageHeader>
        <Title as="h1" size="page" icon={vehicleMeta[vehicleType].icon}>
          {copy.post.title}
        </Title>
      </PageHeader>

      <Text size="caption" tone="muted" weight="semibold">
        {copy.post.stepLabel(step, step === 1 ? copy.post.routeStep : copy.post.contactStep)}
      </Text>

      <form onSubmit={form.handleSubmit(buildPreview)}>
        <FormGrid>
          <div hidden={step !== 1}>
            <Card>
              <CardBody pad="even">
                <Stack gap="md">
                  <Title as="h2" size="section">
                    {copy.post.routeTitle}
                  </Title>
                <Field label={copy.post.originLabel}>
                  <Input required placeholder={copy.post.originPlaceholder} {...form.register("origin")} />
                </Field>
                <Field label={copy.post.destinationLabel}>
                  <Input required placeholder={copy.post.destinationPlaceholder} {...form.register("destination")} />
                </Field>
                <PairGrid>
                  <Field label={copy.post.timeLabel}>
                    <Input required type="time" {...form.register("departureTime")} />
                  </Field>
                  <Field label={copy.post.seatsLabel}>
                    <Input
                      required
                      placeholder="2"
                      inputMode="numeric"
                      {...form.register("seats")}
                    />
                  </Field>
                </PairGrid>
                <Field label={copy.post.dayLabel}>
                  <Controller
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange} orientation="horizontal">
                        {dayOptions.map((o) => (
                          <RadioOption key={o.id} value={o.id} label={o.label} />
                        ))}
                      </RadioGroup>
                    )}
                  />
                </Field>
                <Surface tone="wash" pad="md">
                  <Cluster gap="sm">
                    <Icon icon={Clock} size="xs" tone="faint" />
                    <Text size="caption" tone="muted">
                      {copy.post.expiryNotice}
                    </Text>
                  </Cluster>
                </Surface>
                <Field label={copy.post.vehicleLabel}>
                  <Controller
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange} orientation="horizontal">
                        {vehicleOptions.map((o) => (
                          <RadioOption key={o.id} value={o.id} label={o.label} icon={o.icon} />
                        ))}
                      </RadioGroup>
                    )}
                  />
                </Field>
                <Field label={copy.post.viaLabel}>
                  <Input placeholder={copy.post.viaPlaceholder} {...form.register("via")} />
                </Field>
                  <Button type="button" size="lg" width="full" onClick={goNext}>
                    {copy.post.next} <Icon icon={ArrowRight} size="xs" />
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
                    {copy.post.contactTitle}
                  </Title>
                  <Field label={copy.post.nameLabel}>
                    <Input
                      required
                      placeholder={copy.post.namePlaceholder}
                      {...form.register("driverName")}
                    />
                  </Field>
                  <Field label={copy.shared.phoneLabel}>
                    <Input
                      placeholder={copy.post.phonePlaceholder}
                      inputMode="tel"
                      {...form.register("phone", {
                        onChange: (e) => form.setValue("phone", formatPhone(e.target.value)),
                      })}
                    />
                  </Field>
                <Field label={copy.post.lineLabel}>
                  <Input required placeholder={copy.post.linePlaceholder} {...form.register("lineId")} />
                </Field>
                <Field label={copy.post.facebookLabel}>
                  <Input
                    placeholder={copy.post.facebookPlaceholder}
                    inputMode="url"
                    {...form.register("facebookUrl")}
                  />
                </Field>
                <Field label={copy.post.noteLabel}>
                  <Textarea placeholder={copy.post.notePlaceholder} {...form.register("note")} />
                </Field>
                  <PairGrid>
                    <Button variant="outline" width="full" type="button" onClick={() => setStep(1)}>
                      <Icon icon={ArrowLeft} size="xs" /> {copy.post.backStep}
                    </Button>
                    <Button type="submit" size="lg" width="full">
                      {copy.post.submit}
                    </Button>
                  </PairGrid>
                  <Text size="micro" tone="faint" align="center">
                    {copy.post.freeNote}
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
