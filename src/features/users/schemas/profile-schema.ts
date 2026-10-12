import { z } from "zod";

export const profileSchema = z.object({
  vehicle: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  lineId: z.string().trim().min(1),
  facebookUrl: z.union([z.url(), z.literal("")]).optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;
