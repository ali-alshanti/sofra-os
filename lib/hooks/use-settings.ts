"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getRestaurantSettings,
  updateRestaurantSettings,
  getBusinessHours,
  updateBusinessHours,
  getNotificationSettings,
  updateNotificationSettings,
  getIntegrations,
  updateIntegrationStatus,
} from "@/services/settings";
import type {
  RestaurantSettings,
  BusinessHours,
  NotificationSettings,
  IntegrationStatus,
} from "@/features/settings/types";

const STALE_5MIN = 5 * 60 * 1000;

// ─── useRestaurantSettings ────────────────────────────────────────────────────

export function useRestaurantSettings() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.settings.restaurant(restaurantId),
    queryFn:  () => getRestaurantSettings(restaurantId),
    enabled:  !!restaurantId,
    staleTime: STALE_5MIN,
  });
}

// ─── useUpdateRestaurantSettings ──────────────────────────────────────────────

export function useUpdateRestaurantSettings() {
  const queryClient  = useQueryClient();
  const { user }     = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useMutation({
    mutationFn: (settings: RestaurantSettings) =>
      updateRestaurantSettings(restaurantId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.restaurant(restaurantId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.notifications(restaurantId) });
    },
  });
}

// ─── useBusinessHours ─────────────────────────────────────────────────────────

export function useBusinessHours() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.settings.businessHours(restaurantId),
    queryFn:  () => getBusinessHours(restaurantId),
    enabled:  !!restaurantId,
    staleTime: STALE_5MIN,
  });
}

// ─── useUpdateBusinessHours ───────────────────────────────────────────────────

export function useUpdateBusinessHours() {
  const queryClient  = useQueryClient();
  const { user }     = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useMutation({
    mutationFn: (hours: BusinessHours) =>
      updateBusinessHours(restaurantId, hours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.businessHours(restaurantId) });
    },
  });
}

// ─── useNotificationSettings ──────────────────────────────────────────────────

export function useNotificationSettings() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.settings.notifications(restaurantId),
    queryFn:  () => getNotificationSettings(restaurantId),
    enabled:  !!restaurantId,
    staleTime: STALE_5MIN,
  });
}

// ─── useUpdateNotificationSettings ───────────────────────────────────────────

export function useUpdateNotificationSettings() {
  const queryClient  = useQueryClient();
  const { user }     = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useMutation({
    mutationFn: (notifications: NotificationSettings) =>
      updateNotificationSettings(restaurantId, notifications),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.notifications(restaurantId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings.restaurant(restaurantId) });
    },
  });
}

// ─── useIntegrations ──────────────────────────────────────────────────────────

export function useIntegrations() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.settings.integrations(restaurantId),
    queryFn:  () => getIntegrations(restaurantId),
    enabled:  !!restaurantId,
    staleTime: STALE_5MIN,
  });
}

// ─── useUpdateIntegration ─────────────────────────────────────────────────────

export function useUpdateIntegration() {
  const queryClient  = useQueryClient();
  const { user }     = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: IntegrationStatus }) =>
      updateIntegrationStatus(id, status),
    onSuccess: (updatedList) => {
      // Optimistically update the cache with the returned list
      queryClient.setQueryData(
        QUERY_KEYS.settings.integrations(restaurantId),
        updatedList,
      );
    },
  });
}
