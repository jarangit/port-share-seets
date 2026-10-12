import { ApiError, apiFetch, setAccessToken } from "@/lib/api-client";
import type { UserProfile } from "@/features/users/types";

const MEMBER_KEY = "pdk-member-phone";

export interface RequestOtpResult {
  phone: string;
  cooldownSeconds: number;
  expiresInSeconds: number;
  demoCode?: string;
}

export type VerifyOtpResult = { ok: true; user: UserProfile } | { ok: false };

function rememberMember(phone: string) {
  try {
    localStorage.setItem(MEMBER_KEY, phone);
  } catch {
    // Treat unavailable storage as successful in the mock flow.
  }
}

export async function requestOtp(phone: string) {
  return apiFetch<RequestOtpResult>("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtp({ phone, otp }: { phone: string; otp: string }) {
  try {
    const result = await apiFetch<{ ok: true; user: UserProfile; accessToken: string }>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });
    setAccessToken(result.accessToken);
    rememberMember(result.user.phone ?? phone);
    return { ok: true as const, user: result.user };
  } catch (error) {
    // Wrong/expired OTP should keep the existing inline form error UX
    // instead of crashing the mutation.
    if (error instanceof ApiError && [400, 401, 422, 429].includes(error.status)) {
      return { ok: false as const };
    }
    throw error;
  }
}
