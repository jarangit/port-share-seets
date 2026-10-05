export type AvatarTone = "ink" | "slate" | "coal" | "bark";

export interface UserProfile {
  id: string;
  name: string;
  avatarTone: AvatarTone;
  initials: string;
  avatarUrl?: string;
  verifiedPhone: boolean;
  verifiedId: boolean;
  memberSince: string;
  sharedCount: number;
  vehicle?: { model: string; color: string; plate: string };
  phone?: string;
  lineId?: string;
  facebookUrl?: string;
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
  vehicle: { model: string; color: string; plate: string };
  contact: { phone: string; lineId: string };
  note?: string;
  postedAgo: string;
}
