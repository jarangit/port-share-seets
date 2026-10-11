import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Page, Stack, PairGrid } from "@/components/ui/layout";
import { Title, Text } from "@/components/ui/typography";
import { IconBox } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <Page>
      <Card>
        <CardBody pad="tall">
          <Stack gap="md" align="center">
            <IconBox icon={Search} size="lg" tone="wash" shape="circle" />
            <Stack gap="sm" align="center">
              <Title as="h1" size="name">
                {copy.notFound.title}
              </Title>
              <Text size="meta" tone="muted" align="center" narrow>
                {copy.notFound.description}
              </Text>
            </Stack>
            <PairGrid>
              <Button variant="outline" width="full" asChild>
                <Link href="/share">{copy.nav.shareSeats}</Link>
              </Button>
              <Button width="full" asChild>
                <Link href="/">{copy.notFound.backHome}</Link>
              </Button>
            </PairGrid>
          </Stack>
        </CardBody>
      </Card>
    </Page>
  );
}
