"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "./use-auth";
import { useAppToast } from "./use-app-toast";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getOrders,
  getOrdersSummary,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  type GetOrdersParams,
  type CreateOrderPayload,
} from "@/services/orders";
import { getTablesFilterOptions } from "@/services/tables";
import { getWaitersFilterOptions } from "@/services/employees";
import type { OrderStatusValue } from "@/features/orders/types";

// ─── useOrders ────────────────────────────────────────────────────────────────

type UseOrdersParams = Omit<GetOrdersParams, "restaurantId">;

export function useOrders(params: UseOrdersParams = {}) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  const fullParams: GetOrdersParams = { restaurantId, ...params };

  return useQuery({
    queryKey: QUERY_KEYS.orders.list(fullParams as unknown as Record<string, unknown>),
    queryFn:  () => getOrders(fullParams),
    enabled:  !!restaurantId,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

// ─── useOrdersSummary ─────────────────────────────────────────────────────────

export function useOrdersSummary() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.orders.summary(restaurantId),
    queryFn:  () => getOrdersSummary(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// ─── useTablesForFilter ───────────────────────────────────────────────────────

export function useTablesForFilter() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.orders.tableOptions(restaurantId),
    queryFn:  () => getTablesFilterOptions(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── useWaitersForFilter ──────────────────────────────────────────────────────

export function useWaitersForFilter() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.orders.waiterOptions(restaurantId),
    queryFn:  () => getWaitersFilterOptions(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── useCreateOrder ───────────────────────────────────────────────────────────

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();

  return useMutation({
    mutationFn: (payload: Omit<CreateOrderPayload, "restaurantId">) => {
      const restaurantId = user?.restaurant_id ?? "";
      return createOrder({ restaurantId, ...payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      toastSuccess("Order created successfully.");
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useUpdateOrderStatus ─────────────────────────────────────────────────────

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.orders");

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatusValue }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      toastSuccess(t("statusUpdated"));
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useDeleteOrder ───────────────────────────────────────────────────────────

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.orders");

  return useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      toastSuccess(t("deleted"));
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}
