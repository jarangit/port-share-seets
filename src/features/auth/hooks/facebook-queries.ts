"use client";
import { useMutation } from "@tanstack/react-query";
import { connectFacebook, disconnectFacebook } from "@/features/auth/services/facebook-service";

export function useConnectFacebook() {
  return useMutation({ mutationFn: () => connectFacebook() });
}

export function useDisconnectFacebook() {
  return useMutation({ mutationFn: () => disconnectFacebook() });
}
