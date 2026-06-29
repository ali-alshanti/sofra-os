"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { useToast } from "@/lib/providers/toast-provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getOrders,
  getOrdersSummary,
  updateOrderStatus,
  deleteOrder,
  type GetOrdersParams,
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

// ─── useUpdateOrderStatus ─────────────────────────────────────────────────────

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatusValue }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      toastSuccess("Order status updated.");
    },
    onError: (err) => {
      toastError(err instanceof Error ? err.message : "Failed to update order status.");
    },
  });
}

// ─── useDeleteOrder ───────────────────────────────────────────────────────────

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      toastSuccess("Order deleted successfully.");
    },
    onError: (err) => {
      toastError(err instanceof Error ? err.message : "Failed to delete order.");
    },
  });
}
