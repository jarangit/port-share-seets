import { ApiError, apiFetch, toQuery } from "@/lib/api-client";
import { rideOffers, myOffers, getOffer as getMockOffer } from "@/features/rides/data/rides";
import { PREVIEW_OFFER_ID, readCreatedOffer } from "@/features/rides/lib/created-offer";
import type { RideOffer, VehicleType } from "@/features/rides/types";

export type RideOfferDay = "today" | "tomorrow";
export type RideOfferStatus = "open" | "full" | "closed" | "expired";

export interface RideOfferFilters {
  q?: string;
  day?: RideOfferDay;
  vehicleType?: "all" | VehicleType;
}

export interface CreateRideOfferInput {
  origin: string;
  destination: string;
  departureTime: string;
  day: RideOfferDay;
  seats: number;
  vehicleType: VehicleType;
  via: string;
  driverName: string;
  phone: string;
  lineId: string;
  facebookUrl?: string;
  note?: string;
}

export async function listRideOffers(filters: RideOfferFilters = {}) {
  const qs = toQuery({
    q: filters.q?.trim() || undefined,
    day: filters.day,
    vehicleType: filters.vehicleType,
  });
  return apiFetch<RideOffer[]>(`/ride-offers${qs}`);
}

export async function getRideOffer(id: string) {
  if (id === PREVIEW_OFFER_ID) return readCreatedOffer();
  try {
    return await apiFetch<RideOffer>(`/ride-offers/${encodeURIComponent(id)}`);
  } catch (error) {
    // Explicit 404/410 means the offer is gone — show not-found
    // instead of a stale mock with the same id.
    if (error instanceof ApiError && (error.status === 404 || error.status === 410)) {
      return null;
    }
    // Keep `next build` and offline dev working when the API is not running:
    // fall back to mock data for pre-rendered static params.
    return getMockOffer(id) ?? myOffers.find((o) => o.id === id) ?? null;
  }
}

export async function listMyRideOffers() {
  // All posts are attached to the backend mock user (`u-me`) for now.
  return apiFetch<RideOffer[]>("/me/ride-offers");
}

interface CreateRideOfferResponse {
  id: string;
  status: string;
  expiresAt: string;
}

export async function createRideOffer(input: CreateRideOfferInput) {
  const created = await apiFetch<CreateRideOfferResponse>("/ride-offers", {
    method: "POST",
    body: JSON.stringify(input),
  });
  // The create endpoint returns only `{ id, status, expiresAt }`,
  // so fetch the full offer to keep the post-flow UI unchanged.
  return apiFetch<RideOffer>(`/ride-offers/${encodeURIComponent(created.id)}`);
}

interface UpdateRideOfferStatusResponse {
  id: string;
  status: string;
  seatsLeft: number;
}

export async function updateRideOfferStatus(id: string, status: Extract<RideOfferStatus, "open" | "full">) {
  const updated = await apiFetch<UpdateRideOfferStatusResponse>(
    `/ride-offers/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
  try {
    return await apiFetch<RideOffer>(`/ride-offers/${encodeURIComponent(updated.id)}`);
  } catch {
    const fallback = getMockOffer(id) ?? myOffers.find((o) => o.id === id) ?? null;
    if (!fallback) return null;
    return {
      ...fallback,
      seatsLeft: updated.seatsLeft,
      status: updated.status as RideOffer["status"],
    };
  }
}

export async function listStaticRideOfferParams() {
  // Static mock ids for `generateStaticParams` — must not call the API
  // at build time, when the backend may not be running.
  return [...rideOffers, ...myOffers].map((o) => ({ id: o.id }));
}
