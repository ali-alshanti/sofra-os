"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { useToast } from "@/lib/providers/toast-provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getTables,
  updateTableStatus,
  getReservations,
  cancelReservation,
} from "@/services/tables";
import type { TableStatus } from "@/features/tables/components/table-card";

// ─── useTables ────────────────────────────────────────────────────────────────

export function useTables() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.tables.floor(restaurantId),
    queryFn:  () => getTables(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

// ─── useUpdateTableStatus ─────────────────────────────────────────────────────

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: ({ tableId, status }: { tableId: string; status: TableStatus }) =>
      updateTableStatus(tableId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      toastSuccess("Table status updated.");
    },
    onError: (err) => {
      toastError(err instanceof Error ? err.message : "Failed to update table status.");
    },
  });
}

// ─── useReservations ──────────────────────────────────────────────────────────

export function useReservations() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.tables.reservations(restaurantId),
    queryFn:  () => getReservations(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// ─── useCancelReservation ─────────────────────────────────────────────────────

export function useCancelReservation() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: (reservationId: string) => cancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables.all });
      toastSuccess("Reservation cancelled.");
    },
    onError: (err) => {
      toastError(err instanceof Error ? err.message : "Failed to cancel reservation.");
    },
  });
}
