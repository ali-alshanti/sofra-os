"use client";

import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { presetToDateRange, type DateRange } from "@/lib/utils/date";
import {
  getDashboardSummary,
  getRevenueAnalytics,
  getTopSellingItems,
  getInventoryAlerts,
} from "@/services/dashboard";

const DEFAULT_RANGE = presetToDateRange("Today");

// ─── useDashboardSummary ──────────────────────────────────────────────────────

export function useDashboardSummary(dateRange: DateRange = DEFAULT_RANGE) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: [...QUERY_KEYS.dashboard.summary(restaurantId), dateRange.from, dateRange.to],
    queryFn:  () => getDashboardSummary(restaurantId, dateRange),
    enabled:  !!restaurantId,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// ─── useRevenueAnalytics ──────────────────────────────────────────────────────

export function useRevenueAnalytics(dateRange: DateRange = DEFAULT_RANGE) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: [...QUERY_KEYS.dashboard.revenue(restaurantId), dateRange.from, dateRange.to],
    queryFn:  () => getRevenueAnalytics(restaurantId, dateRange),
    enabled:  !!restaurantId,
    staleTime: 5 * 60 * 1000,
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
