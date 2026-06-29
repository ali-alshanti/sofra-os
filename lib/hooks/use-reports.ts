"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getDashboardReports,
  getRevenueReport,
  getCategorySalesReport,
  getCustomerAnalytics,
  getGeneratedReports,
} from "@/services/reports";
import type { ReportsFiltersValue } from "@/features/reports/types";

const STALE_5MIN = 5  * 60 * 1000;
const STALE_1MIN = 1  * 60 * 1000;

type DateFilters = Pick<ReportsFiltersValue, "period" | "dateFrom" | "dateTo">;

// ─── useDashboardReports ──────────────────────────────────────────────────────

export function useDashboardReports(filters: DateFilters) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.reports.dashboard(restaurantId, filters as Record<string, unknown>),
    queryFn:  () => getDashboardReports(restaurantId, filters),
    enabled:  !!restaurantId,
    staleTime: STALE_5MIN,
    placeholderData: (prev) => prev,
  });
}

// ─── useRevenueReport ─────────────────────────────────────────────────────────

export function useRevenueReport(filters: DateFilters) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.reports.revenue(restaurantId, filters as Record<string, unknown>),
    queryFn:  () => getRevenueReport(restaurantId, filters),
    enabled:  !!restaurantId,
    staleTime: STALE_1MIN,
    placeholderData: (prev) => prev,
  });
}

// ─── useCategorySalesReport ───────────────────────────────────────────────────

export function useCategorySalesReport(filters: DateFilters) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.reports.categorySales(restaurantId, filters as Record<string, unknown>),
    queryFn:  () => getCategorySalesReport(restaurantId, filters),
    enabled:  !!restaurantId,
    staleTime: STALE_5MIN,
    placeholderData: (prev) => prev,
  });
}

// ─── useCustomerAnalytics ─────────────────────────────────────────────────────

export function useCustomerAnalytics() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.reports.customerAnalytics(restaurantId),
    queryFn:  () => getCustomerAnalytics(restaurantId),
    enabled:  !!restaurantId,
    staleTime: STALE_5MIN,
  });
}

// ─── useGeneratedReports ──────────────────────────────────────────────────────

export function useGeneratedReports(
  filters: Pick<ReportsFiltersValue, "reportType" | "search">,
  page     = 1,
  pageSize = 10,
) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";
  const queryParams  = { ...filters, page, pageSize };

  return useQuery({
    queryKey: QUERY_KEYS.reports.generated(restaurantId, queryParams as Record<string, unknown>),
    queryFn:  () => getGeneratedReports(restaurantId, filters, page, pageSize),
    enabled:  !!restaurantId,
    staleTime: STALE_1MIN,
    placeholderData: (prev) => prev,
  });
}

// ─── useRefreshReports ────────────────────────────────────────────────────────

export function useRefreshReports() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
}
