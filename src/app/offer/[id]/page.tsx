import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Page, Stack } from "@/components/ui/layout";
import { BackLink } from "@/components/ui/nav";
import { RideOfferDetailView } from "@/features/rides/components/ride-offer-detail-view";
import { PreviewOfferDetail } from "@/features/rides/components/preview-offer-detail";
import { getRideOffer, listStaticRideOfferParams } from "@/features/rides/services/rides-service";
import { PREVIEW_OFFER_ID } from "@/features/rides/lib/created-offer";
import { copy } from "@/content/copy";

export function generateStaticParams() {
  return listStaticRideOfferParams();
}

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  /* Reserved id: renders the just-created post from the post flow
     instead of mock data. */
  if (id === PREVIEW_OFFER_ID) return <PreviewOfferDetail />;

  const offer = await getRideOffer(id);
  if (!offer) notFound();

  return (
    <Page>
      <BackLink href="/" label={copy.offer.backToAll} />

      <Stack gap="md">
        <RideOfferDetailView offer={offer} />

        {/* 3 — Escape hatch */}
        <Button variant="outline" width="full" asChild>
          <Link href="/">{copy.offer.seeOtherOffers}</Link>
        </Button>
      </Stack>
    </Page>
  );
}
