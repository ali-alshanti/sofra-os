"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "./use-auth";
import { useAppToast } from "./use-app-toast";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getTables,
  updateTableStatus,
  getReservations,
  cancelReservation,
  createReservation,
  createTable,
  getTablesFilterOptions,
} from "@/services/tables";
import type { CreateReservationPayload, CreateTablePayload } from "@/services/tables";
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
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.tables");

  return useMutation({
    mutationFn: ({ tableId, status }: { tableId: string; status: TableStatus }) =>
      updateTableStatus(tableId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      toastSuccess(t("statusUpdated"));
    },
    onError: (err) => {
      toastMutationError(err);
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
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.tables");

  return useMutation({
    mutationFn: (reservationId: string) => cancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables.all });
      toastSuccess(t("reservationCancelled"));
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useCreateReservation ─────────────────────────────────────────────────────

export function useCreateReservation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.tables");

  return useMutation({
    mutationFn: (payload: Omit<CreateReservationPayload, "restaurantId">) => {
      const restaurantId = user?.restaurant_id ?? "";
      return createReservation({ restaurantId, ...payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables.all });
      toastSuccess(t("reservationCreated"));
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useCreateTable ───────────────────────────────────────────────────────────

export function useCreateTable() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.tables");

  return useMutation({
    mutationFn: (payload: Omit<CreateTablePayload, "restaurantId">) => {
      const restaurantId = user?.restaurant_id ?? "";
      return createTable({ restaurantId, ...payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables.all });
      toastSuccess(t("tableCreated"));
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useTablesForReservation ──────────────────────────────────────────────────

export function useTablesForReservation() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.tables.options(restaurantId),
    queryFn:  () => getTablesFilterOptions(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 10 * 60 * 1000,
  });
}
