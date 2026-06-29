"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getOrders,
  getOrdersSummary,
  updateOrderStatus,
  deleteOrder,
  type GetOrdersParams,
} from "@/services/orders";
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
    staleTime: 30 * 1000,         // 30 seconds — orders change frequently
    placeholderData: (prev) => prev, // keep previous page visible during refetch
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

// ─── useUpdateOrderStatus ─────────────────────────────────────────────────────

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatusValue }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      // Invalidate orders list and summary so both re-fetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
    },
  });
}

// ─── useDeleteOrder ───────────────────────────────────────────────────────────

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
    },
  });
}
