"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Page, Stack } from "@/components/ui/layout";
import { BackLink } from "@/components/ui/nav";
import { RideOfferDetailView } from "@/features/rides/components/ride-offer-detail-view";
import { readCreatedOffer } from "@/features/rides/lib/created-offer";
import type { RideOffer } from "@/features/rides/types";
import { copy } from "@/content/copy";

/* PreviewOfferDetail — detail page for the just-created post.
   Reads the confirmed offer cached by the post flow; direct visits
   without one fall back to not-found. */
export function PreviewOfferDetail() {
  const [offer, setOffer] = useState<RideOffer | null | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setOffer(readCreatedOffer()), 0);
    return () => clearTimeout(timer);
  }, []);

  if (offer === undefined) return null;
  if (offer === null) notFound();

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
