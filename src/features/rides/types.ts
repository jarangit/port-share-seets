import type { UserProfile } from "@/features/users/types";

export interface Vehicle {
  name: string;
}

export interface RideOffer {
  id: string;
  driver: UserProfile;
  origin: string;
  destination: string;
  departureTime: string;
  dateLabel: string;
  via: string[];
  seatsTotal: number;
  seatsLeft: number;
  pickupPoints: string[];
  vehicle: Vehicle;
  contact: { phone: string; lineId: string; facebookUrl?: string };
  note?: string;
  postedAgo: string;
  status?: "open" | "full" | "closed" | "expired";
  departureDate?: string;
  createdAt?: string;
  expiresAt?: string;
}
