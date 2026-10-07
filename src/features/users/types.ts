import type { Vehicle } from "@/features/rides/types";

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
  vehicle?: Vehicle;
  phone?: string;
  lineId?: string;
  facebookUrl?: string;
}
