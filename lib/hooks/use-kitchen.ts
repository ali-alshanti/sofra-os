"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { useAppToast } from "./use-app-toast";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getKitchenOrders,
  advanceKitchenOrderStatus,
  getKitchenStats,
} from "@/services/kitchen";
import { createNotification } from "@/services/notifications";
import type { TicketStatus } from "@/features/kitchen/components/kitchen-ticket";

// ─── useKitchenOrders ─────────────────────────────────────────────────────────

export function useKitchenOrders() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.kitchen.orders(restaurantId),
    queryFn:  () => getKitchenOrders(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 15 * 1000,
    refetchInterval: 15 * 1000,
  });
}

// ─── useKitchenStats ──────────────────────────────────────────────────────────

export function useKitchenStats() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.kitchen.stats(restaurantId),
    queryFn:  () => getKitchenStats(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

// ─── useAdvanceKitchenOrderStatus ─────────────────────────────────────────────

export function useAdvanceKitchenOrderStatus() {
  const queryClient  = useQueryClient();
  const { user }     = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";
  const { toastMutationError } = useAppToast();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: TicketStatus }) =>
      advanceKitchenOrderStatus(orderId, status),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.kitchen.orders(restaurantId) });

      const snap = queryClient.getQueryData(QUERY_KEYS.kitchen.orders(restaurantId));

      const nextStatus: Record<TicketStatus, TicketStatus | null> = {
        pending:   "preparing",
        preparing: "ready",
        ready:     "completed",
        completed: null,
      };
      const next = nextStatus[status];

      queryClient.setQueryData(
        QUERY_KEYS.kitchen.orders(restaurantId),
        (old: unknown) => {
          if (!Array.isArray(old) || !next) return old;
          return old.map((o: { id: string; status: TicketStatus }) =>
            o.id === orderId ? { ...o, status: next } : o,
          );
        },
      );

      return { snap };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.snap !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.kitchen.orders(restaurantId), ctx.snap);
      }
      toastMutationError(err);
    },
    onSuccess: (_data, { status }) => {
      const nextStatus: Record<TicketStatus, TicketStatus | null> = {
        pending:   "preparing",
        preparing: "ready",
        ready:     "completed",
        completed: null,
      };
      const next = nextStatus[status];
      if (!next || !user?.restaurant_id || !user?.id) return;

      const keyMap: Partial<Record<TicketStatus, { key: string; title: string; message: string }>> = {
        preparing: { key: "kitchen.preparing", title: "Order Preparing",  message: "An order is now being prepared." },
        ready:     { key: "kitchen.ready",     title: "Order Ready",      message: "An order is ready for service." },
        completed: { key: "kitchen.delivered", title: "Order Delivered",  message: "An order has been delivered." },
      };
      const meta = keyMap[next];
      if (!meta) return;

      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "kitchen",
        title: meta.title,
        message: meta.message,
        data: { key: meta.key, params: {} },
      }).catch(console.error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kitchen.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
}
