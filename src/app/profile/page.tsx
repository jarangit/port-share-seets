"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/cards";
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
import { useMyRideOffers } from "@/features/rides/hooks/ride-offer-queries";
import { useCurrentUser, useUpdateCurrentUser } from "@/features/users/hooks/user-queries";
import { isUnauthorized } from "@/lib/api-client";
import { profileSchema, type ProfileValues } from "@/features/users/schemas/profile-schema";
import { copy } from "@/content/copy";
import { Settings, CarFront, Phone, User, BadgeCheck, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const { data: me, isLoading, isError, error, refetch } = useCurrentUser();
  const { data: myOffers = [], isLoading: routesLoading, isError: routesError } = useMyRideOffers();
  const updateUser = useUpdateCurrentUser();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { vehicle: "Toyota Yaris", phone: "086-123-4567", facebookUrl: "" },
  });

  useEffect(() => {
    if (!me) return;
    form.reset({
      vehicle: me.vehicle?.name ?? "",
      phone: me.phone ?? "",
      facebookUrl: me.facebookUrl ?? "",
    });
  }, [form, me]);

  if (isLoading) {
    return (
      <Page>
        <EmptyState icon={User} title={copy.profile.loadingTitle} hint={copy.profile.loadingHint} />
      </Page>
    );
  }

  if (isError || !me) {
    const needsLogin = isUnauthorized(error);
    return (
      <Page>
        <EmptyState
          icon={User}
          title={needsLogin ? copy.shared.requireLoginTitle : copy.profile.errorTitle}
          hint={needsLogin ? copy.shared.requireLoginHint : copy.profile.errorHint}
          action={
            needsLogin ? (
              <Button size="sm" asChild>
                <Link href="/register">{copy.shared.goLogin}</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                {copy.shared.retry}
              </Button>
            )
          }
        />
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader layout="bar">
        <Title as="h1" size="page" icon={User}>
          {copy.profile.title}
        </Title>
        <Button variant="outline" size="icon" aria-label={copy.profile.settings}>
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
                  {copy.profile.verifyTitle}
                </Title>
                <Surface tone="success" pad="md">
                  <Cluster justify="between" gap="sm">
                    <Text weight="bold">{copy.profile.phoneRow}</Text>
                    <Badge variant="success">{copy.trust.verified}</Badge>
                  </Cluster>
                </Surface>
                <Surface tone="wash" pad="md">
                  <Cluster justify="between" gap="sm">
                    <Text weight="bold">{copy.profile.idRow}</Text>
                    <Badge variant="secondary">{copy.profile.unverified}</Badge>
                  </Cluster>
                </Surface>
                <Button width="full">{copy.profile.boostTrust}</Button>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardBody pad="even">
              <Stack gap="md">
                <Title as="h2" size="section" icon={CarFront}>
                  {copy.profile.vehicleTitle}
                </Title>
                <Input aria-label={copy.profile.vehicleTitle} {...form.register("vehicle")} />
                <Title as="h2" size="section" icon={Phone}>
                  {copy.profile.contactTitle}
                </Title>
                <Input aria-label={copy.shared.phoneLabel} {...form.register("phone")} />
                <Input
                  placeholder={copy.post.facebookPlaceholder}
                  aria-label={copy.profile.facebookLabel}
                  {...form.register("facebookUrl")}
                />
                <ContactRow icon={LineIcon}>
                  <Text as="span" weight="medium">
                    {copy.shared.lineLabel(me.lineId ?? "")}
                  </Text>
                </ContactRow>
                {updateUser.isError ? (
                  <Text size="caption" weight="medium" tone="danger" align="center">
                    {copy.profile.saveFailed}
                  </Text>
                ) : null}
                <Button
                  variant="outline"
                  width="full"
                  onClick={form.handleSubmit((values) => updateUser.mutate(values))}
                  disabled={updateUser.isPending}
                >
                  {copy.profile.save}
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </FormGrid>

      <Stack gap="md">
        <Cluster justify="between" gap="sm">
          <Title as="h2" size="section">
            {copy.profile.routesTitle(myOffers.length)}
          </Title>
          <TextLink href="/my-posts">
            {copy.profile.viewAll} <Icon icon={ArrowRight} size="xs" inline />
          </TextLink>
        </Cluster>
        {routesLoading ? (
          <Text size="caption" tone="muted" align="center">
            {copy.profile.loadingHint}
          </Text>
        ) : routesError ? (
          <Text size="caption" weight="medium" tone="danger" align="center">
            {copy.myPosts.errorHint}
          </Text>
        ) : myOffers.length === 0 ? (
          <Text size="caption" tone="muted" align="center">
            {copy.profile.routesEmpty}
          </Text>
        ) : (
          myOffers.map((o) => (
          <Card key={o.id}>
            <CardBody pad="even">
              <Cluster justify="between" gap="sm">
                <Stack gap="sm">
                  <Text weight="bold">
                    <Icon icon={CarFront} size="xs" inline spaced="after" />
                    {o.origin} <Icon icon={ArrowRight} size="xs" inline /> {o.destination}
                  </Text>
                  <Text size="caption" tone="muted">
                    {copy.shared.tripMeta(o.dateLabel, o.departureTime)} •{" "}
                    {copy.shared.availableSeats(o.seatsLeft)}
                  </Text>
                </Stack>
                <Badge variant="success">{copy.shared.openSeats}</Badge>
              </Cluster>
            </CardBody>
          </Card>
          ))
        )}
        <Text size="micro" tone="faint" align="center">
          {copy.profile.memberSince(me.memberSince)}
        </Text>
      </Stack>
    </Page>
  );
}
