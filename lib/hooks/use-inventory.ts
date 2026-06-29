"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "./use-auth";
import { useAppToast } from "./use-app-toast";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getInventoryItems,
  getInventoryCategories,
  getSuppliers,
  getInventorySummary,
  getLowStockItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  type GetInventoryItemsParams,
  type CreateInventoryItemPayload,
} from "@/services/inventory";
import { createNotification } from "@/services/notifications";

// ─── useInventoryCategories ───────────────────────────────────────────────────

export function useInventoryCategories() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.inventory.categories(restaurantId),
    queryFn:  () => getInventoryCategories(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 10 * 60 * 1000,
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

// ─── useCreateInventoryItem ───────────────────────────────────────────────────

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();

  return useMutation({
    mutationFn: (payload: Omit<CreateInventoryItemPayload, "restaurantId">) => {
      const restaurantId = user?.restaurant_id ?? "";
      return createInventoryItem({ restaurantId, ...payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      toastSuccess("Item added successfully.");

      if (!user?.restaurant_id || !user?.id) return;
      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "inventory",
        title: "Inventory Item Added",
        message: "A new inventory item has been added.",
        data: { key: "inventory.itemAdded", params: {} },
      }).catch(console.error);
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useUpdateInventoryItem ───────────────────────────────────────────────────

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.inventory");

  return useMutation({
    mutationFn: ({ itemId, patch }: {
      itemId: string;
      patch: Parameters<typeof updateInventoryItem>[1];
    }) => updateInventoryItem(itemId, patch),
    onSuccess: (_data, { patch }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      toastSuccess(t("updated"));

      if (!user?.restaurant_id || !user?.id) return;
      const status = (patch as Record<string, unknown>).status as string | undefined;
      const isLow = status === "low_stock";
      const isOut = status === "out_of_stock";
      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "inventory",
        title: isLow ? "Low Stock Alert" : isOut ? "Out of Stock" : "Inventory Item Updated",
        message: isLow
          ? "An inventory item is running low on stock."
          : isOut
          ? "An inventory item is out of stock."
          : "An inventory item has been updated.",
        data: {
          key: isLow ? "inventory.lowStock" : isOut ? "inventory.outOfStock" : "inventory.itemUpdated",
          params: {},
        },
      }).catch(console.error);
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useDeleteInventoryItem ───────────────────────────────────────────────────

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.inventory");

  return useMutation({
    mutationFn: (itemId: string) => deleteInventoryItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      toastSuccess(t("deleted"));

      if (!user?.restaurant_id || !user?.id) return;
      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "inventory",
        title: "Inventory Item Removed",
        message: "An inventory item has been removed.",
        data: { key: "inventory.itemDeleted", params: {} },
      }).catch(console.error);
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}
