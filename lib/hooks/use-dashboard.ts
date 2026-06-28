"use client";

import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getDashboardSummary,
  getRevenueAnalytics,
  getTopSellingItems,
  getInventoryAlerts,
} from "@/services/dashboard";

// ─── useDashboardSummary ──────────────────────────────────────────────────────

export function useDashboardSummary() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.dashboard.summary(restaurantId),
    queryFn:  () => getDashboardSummary(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 60 * 1000,          // 1 minute — near real-time KPIs
    refetchInterval: 60 * 1000,    // auto-refresh every minute
  });
}

// ─── useRevenueAnalytics ──────────────────────────────────────────────────────

export function useRevenueAnalytics() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.dashboard.revenue(restaurantId),
    queryFn:  () => getRevenueAnalytics(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 5 * 60 * 1000,     // 5 minutes
  });
}

// ─── useTopSellingItems ───────────────────────────────────────────────────────

export function useTopSellingItems() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.dashboard.topItems(restaurantId),
    queryFn:  () => getTopSellingItems(restaurantId, 4),
    enabled:  !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── useInventoryAlerts ───────────────────────────────────────────────────────

export function useInventoryAlerts() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.dashboard.inventoryAlerts(restaurantId),
    queryFn:  () => getInventoryAlerts(restaurantId, 3),
    enabled:  !!restaurantId,
    staleTime: 2 * 60 * 1000,     // 2 minutes
  });
}
