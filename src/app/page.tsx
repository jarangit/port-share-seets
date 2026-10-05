import { Page, Stack, NarrowCenter } from "@/components/ui/layout";
import { Title } from "@/components/ui/typography";
import { ActionCard } from "@/components/ui/cards";
import { Search, CarFront } from "lucide-react";

export default function HomePage() {
  return (
    <Page variant="landing">
      <NarrowCenter>
        <Stack gap="md">
          <Title as="h1" size="hero">
            วันนี้จะไปไหน?
          </Title>

          <Stack gap="md">
            <ActionCard
              href="/find"
              tone="ink"
              icon={Search}
              title="หารถ"
            />
            <ActionCard
              href="/share"
              tone="raised"
              icon={CarFront}
              title="แชร์รถ"
            />
          </Stack>
        </Stack>
      </NarrowCenter>
    </Page>
  );
}
