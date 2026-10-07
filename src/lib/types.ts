/* Shared barrel — domain types now live in features/*.
   Kept so existing `@/lib/types` imports keep working. */
export type { AvatarTone, UserProfile } from "@/features/users/types";
export type { VehicleType, Vehicle, RideOffer } from "@/features/rides/types";
