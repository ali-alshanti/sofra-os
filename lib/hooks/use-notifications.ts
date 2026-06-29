"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from "@/services/notifications";

// ─── useNotifications ─────────────────────────────────────────────────────────

export function useNotifications() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";
  const userId = user?.id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(restaurantId, userId),
    queryFn:  () => getNotifications(restaurantId, userId),
    enabled:  !!restaurantId && !!userId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

// ─── useUnreadCount ───────────────────────────────────────────────────────────

export function useUnreadCount() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";
  const userId = user?.id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.notifications.unread(restaurantId, userId),
    queryFn:  () => getUnreadCount(restaurantId, userId),
    enabled:  !!restaurantId && !!userId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

// ─── useMarkNotificationRead ──────────────────────────────────────────────────

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";
  const userId = user?.id ?? "";

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
    meta: { restaurantId, userId },
  });
}

// ─── useMarkAllNotificationsRead ──────────────────────────────────────────────

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";
  const userId = user?.id ?? "";

  return useMutation({
    mutationFn: () => markAllNotificationsRead(restaurantId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
}

// ─── useDismissNotification ───────────────────────────────────────────────────

export function useDismissNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => dismissNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
}
