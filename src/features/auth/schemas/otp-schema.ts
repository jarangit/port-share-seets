import { z } from "zod";

const phoneDigits = (value: string) => value.replace(/\D/g, "");

export const phoneSchema = z.object({
  phone: z.string().refine((value) => phoneDigits(value).length >= 9),
});

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/),
});

export type PhoneValues = z.infer<typeof phoneSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
