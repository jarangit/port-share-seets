import Link from "next/link";
import { RideOfferFeed } from "@/features/rides/components/ride-offer-feed";
import { Button } from "@/components/ui/button";
import { Page, PageHeader } from "@/components/ui/layout";
import { Title } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { Plus } from "lucide-react";

export default function HomePage() {
  return (
    <Page>
      <PageHeader layout="row">
        <Title as="h1" size="page">
          {copy.home.title}
        </Title>
        <Button size="sm" width="shrink" asChild>
          <Link href="/share">
            <Icon icon={Plus} size="xs" /> {copy.nav.shareRide}
          </Link>
        </Button>
      </PageHeader>

      <RideOfferFeed />
    </Page>
  );
}
