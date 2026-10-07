import { RideOfferFeed } from "@/features/rides/components/ride-offer-feed";
import { Page, PageHeader } from "@/components/ui/layout";
import { Title } from "@/components/ui/typography";

export default function FindPage() {
  return (
    <Page>
      <PageHeader>
        <Title as="h1" size="page">
          จะไปที่ไหน?
        </Title>
      </PageHeader>

      <RideOfferFeed />
    </Page>
  );
}
