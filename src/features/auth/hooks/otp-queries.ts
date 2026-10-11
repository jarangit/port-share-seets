"use client";
import { useMutation } from "@tanstack/react-query";
import { requestOtp, verifyOtp } from "@/features/auth/services/otp-service";

export function useRequestOtp() {
  return useMutation({ mutationFn: (phone: string) => requestOtp(phone) });
}

export function useVerifyOtp() {
  return useMutation({ mutationFn: (input: { phone: string; otp: string }) => verifyOtp(input) });
}
