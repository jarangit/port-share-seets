import type { RideOffer } from "@/features/rides/types";

/* Just-created offer bridge — the post flow has no backend yet, so the
   confirmed offer is cached in sessionStorage for the detail page to
   render at `/offer/preview`. Survives reload, cleared on tab close. */

export const PREVIEW_OFFER_ID = "preview";

const STORAGE_KEY = "pdk-created-offer";

export function saveCreatedOffer(offer: RideOffer) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(offer));
  } catch {
    /* Storage full or unavailable — detail falls back to not-found. */
  }
}

export function readCreatedOffer(): RideOffer | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RideOffer) : null;
  } catch {
    return null;
  }
}
