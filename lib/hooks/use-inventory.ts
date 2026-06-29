"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getInventoryItems,
  getInventoryCategories,
  getSuppliers,
  getInventorySummary,
  getLowStockItems,
  updateInventoryItem,
  deleteInventoryItem,
  type GetInventoryItemsParams,
} from "@/services/inventory";

// ─── useInventoryCategories ───────────────────────────────────────────────────

export function useInventoryCategories() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.inventory.categories(restaurantId),
    queryFn:  () => getInventoryCategories(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 10 * 60 * 1000,  // categories change rarely
  });
}

// ─── useSuppliers ─────────────────────────────────────────────────────────────

export function useSuppliers() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.inventory.suppliers(restaurantId),
    queryFn:  () => getSuppliers(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── useInventoryItems ────────────────────────────────────────────────────────

type UseInventoryItemsParams = Omit<GetInventoryItemsParams, "restaurantId">;

export function useInventoryItems(params: UseInventoryItemsParams = {}) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  const fullParams: GetInventoryItemsParams = { restaurantId, ...params };

  return useQuery({
    queryKey: QUERY_KEYS.inventory.list(fullParams as unknown as Record<string, unknown>),
    queryFn:  () => getInventoryItems(fullParams),
    enabled:  !!restaurantId,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

// ─── useInventorySummary ──────────────────────────────────────────────────────

export function useInventorySummary() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.inventory.summary(restaurantId),
    queryFn:  () => getInventorySummary(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

// ─── useLowStockItems ─────────────────────────────────────────────────────────

export function useLowStockItems(limit = 5) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.inventory.lowStock(restaurantId),
    queryFn:  () => getLowStockItems(restaurantId, limit),
    enabled:  !!restaurantId,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

// ─── useUpdateInventoryItem ───────────────────────────────────────────────────

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, patch }: {
      itemId: string;
      patch: Parameters<typeof updateInventoryItem>[1];
    }) => updateInventoryItem(itemId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      // Also refresh dashboard inventory alerts
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
    },
  });
}

// ─── useDeleteInventoryItem ───────────────────────────────────────────────────

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteInventoryItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
    },
  });
}
