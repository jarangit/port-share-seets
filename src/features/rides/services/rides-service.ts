import { copy } from "@/content/copy";
import { rideOffers, myOffers, getOffer as getMockOffer } from "@/features/rides/data/rides";
import { PREVIEW_OFFER_ID, readCreatedOffer, saveCreatedOffer } from "@/features/rides/lib/created-offer";
import type { RideOffer, VehicleType } from "@/features/rides/types";
import { users } from "@/features/users/data/users";

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

let localMyOffers: RideOffer[] = [...myOffers];

const wait = () => new Promise((resolve) => setTimeout(resolve, 120));

export async function listRideOffers(filters: RideOfferFilters = {}) {
  await wait();
  const q = filters.q?.trim() ?? "";
  const dayLabel = filters.day === "tomorrow" ? copy.shared.tomorrow : copy.shared.today;
  return rideOffers.filter((o) => {
    if (o.seatsLeft === 0) return false;
    if (o.dateLabel !== dayLabel) return false;
    if (filters.vehicleType && filters.vehicleType !== "all" && o.vehicle.type !== filters.vehicleType) return false;
    if (q && !`${o.destination} ${o.via.join(" ")}`.includes(q)) return false;
    return true;
  });
}

export async function getRideOffer(id: string) {
  await wait();
  if (id === PREVIEW_OFFER_ID) return readCreatedOffer();
  return getMockOffer(id) ?? localMyOffers.find((o) => o.id === id) ?? null;
}

export async function listMyRideOffers() {
  await wait();
  return localMyOffers;
}

export async function createRideOffer(input: CreateRideOfferInput) {
  await wait();
  const seats = Math.max(1, input.seats || 1);
  const driverName = input.driverName.trim() || users.me.name;
  const offer: RideOffer = {
    id: PREVIEW_OFFER_ID,
    driver: {
      ...users.me,
      name: driverName,
      initials: driverName.charAt(0),
      facebookUrl: input.facebookUrl || undefined,
    },
    origin: input.origin.trim(),
    destination: input.destination.trim(),
    departureTime: input.departureTime || "07:30",
    dateLabel: input.day === "today" ? copy.shared.today : copy.shared.tomorrow,
    via: input.via
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    seatsTotal: seats,
    seatsLeft: seats,
    pickupPoints: [],
    vehicle: {
      type: input.vehicleType,
      model: users.me.vehicle?.model ?? "-",
      color: users.me.vehicle?.color ?? "-",
      plate: users.me.vehicle?.plate ?? "-",
    },
    contact: { phone: input.phone, lineId: input.lineId },
    note: input.note?.trim() || undefined,
    postedAgo: copy.post.justNow,
  };
  saveCreatedOffer(offer);
  localMyOffers = [offer, ...localMyOffers.filter((o) => o.id !== offer.id)];
  return offer;
}

export async function updateRideOfferStatus(id: string, status: Extract<RideOfferStatus, "open" | "full">) {
  await wait();
  localMyOffers = localMyOffers.map((offer) => {
    if (offer.id !== id) return offer;
    return { ...offer, seatsLeft: status === "full" ? 0 : offer.seatsTotal };
  });
  return localMyOffers.find((offer) => offer.id === id) ?? null;
}

export async function listStaticRideOfferParams() {
  await wait();
  return [...rideOffers, ...myOffers].map((o) => ({ id: o.id }));
}
