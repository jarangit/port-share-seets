"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRideOffer,
  listMyRideOffers,
  listRideOffers,
  updateRideOfferStatus,
  type CreateRideOfferInput,
  type RideOfferFilters,
} from "@/features/rides/services/rides-service";

export const rideOfferKeys = {
  all: ["ride-offers"] as const,
  list: (filters: RideOfferFilters) => [...rideOfferKeys.all, "list", filters] as const,
  mine: () => [...rideOfferKeys.all, "mine"] as const,
};

export function useRideOffers(filters: RideOfferFilters) {
  return useQuery({
    queryKey: rideOfferKeys.list(filters),
    queryFn: () => listRideOffers(filters),
  });
}

export function useMyRideOffers() {
  return useQuery({
    queryKey: rideOfferKeys.mine(),
    queryFn: listMyRideOffers,
  });
}

export function useCreateRideOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRideOfferInput) => createRideOffer(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rideOfferKeys.all }),
  });
}

export function useUpdateRideOfferStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "open" | "full" }) => updateRideOfferStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rideOfferKeys.mine() }),
  });
}
