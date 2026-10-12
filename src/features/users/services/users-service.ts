import { apiFetch } from "@/lib/api-client";
import type { UserProfile } from "@/features/users/types";

export interface UpdateCurrentUserInput {
  vehicle?: string;
  phone?: string;
  facebookUrl?: string;
}

export async function getCurrentUser() {
  return apiFetch<UserProfile>("/me");
}

export async function updateCurrentUser(input: UpdateCurrentUserInput) {
  return apiFetch<UserProfile>("/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
