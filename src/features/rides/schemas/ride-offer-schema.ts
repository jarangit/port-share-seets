import { z } from "zod";

const phoneDigits = (value: string) => value.replace(/\D/g, "");

export const rideOfferCreateSchema = z.object({
  origin: z.string().trim().min(1),
  destination: z.string().trim().min(1),
  departureTime: z.string().min(1),
  seats: z.coerce.number().int().min(1),
  day: z.enum(["today", "tomorrow"]),
  vehicleName: z.string().trim().min(1),
  via: z.string().trim().optional().default(""),
  driverName: z.string().trim().min(1),
  phone: z.string().refine((value) => phoneDigits(value).length >= 9),
  lineId: z.string().trim().min(1),
  facebookUrl: z.union([z.url(), z.literal("")]).optional(),
  note: z.string().trim().optional().default(""),
});

export type RideOfferCreateInputValues = z.input<typeof rideOfferCreateSchema>;
export type RideOfferCreateValues = z.infer<typeof rideOfferCreateSchema>;
