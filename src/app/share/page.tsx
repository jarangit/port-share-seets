import { Page, Stack, NarrowCenter } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { ActionCard } from "@/components/ui/cards";
import { BackLink } from "@/components/ui/nav";
import { copy } from "@/content/copy";
import { Zap, User } from "lucide-react";

export default function SharePage() {
  return (
    <Page variant="landing">
      <NarrowCenter>
        <Stack gap="md">
          <BackLink href="/" label={copy.shared.back} />
          <Title as="h1" size="hero">
            {copy.share.title}
          </Title>

          <Stack gap="md">
            <ActionCard href="/post" tone="ink" icon={Zap} title={copy.share.guestTitle} desc={copy.share.guestDescription} />
            <ActionCard
              href="/register"
              tone="raised"
              icon={User}
              title={copy.share.memberTitle}
              desc={copy.share.memberDescription}
            />
          </Stack>

          <Text size="micro" tone="faint" align="center">
            {copy.share.guestNote}
          </Text>
        </Stack>
      </NarrowCenter>
    </Page>
  );
}
