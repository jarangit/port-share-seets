"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, updateCurrentUser, type UpdateCurrentUserInput } from "@/features/users/services/users-service";

export const userKeys = {
  me: ["users", "me"] as const,
};

export function useCurrentUser() {
  return useQuery({ queryKey: userKeys.me, queryFn: getCurrentUser });
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCurrentUserInput) => updateCurrentUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me }),
  });
}
