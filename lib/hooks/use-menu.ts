"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "./use-auth";
import { useAppToast } from "./use-app-toast";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getCategories,
  getMenuItems,
  updateMenuItemAvailability,
  deleteMenuItem,
} from "@/services/menu";

// ─── useMenuCategories ────────────────────────────────────────────────────────

export function useMenuCategories() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.menu.categories(restaurantId),
    queryFn:  () => getCategories(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── useMenuItems ─────────────────────────────────────────────────────────────

export function useMenuItems(categoryId?: string, search?: string) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.menu.items(restaurantId, categoryId, search),
    queryFn:  () => getMenuItems({ restaurantId, categoryId, search }),
    enabled:  !!restaurantId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── useUpdateMenuItemAvailability ────────────────────────────────────────────

export function useUpdateMenuItemAvailability() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.menu");

  return useMutation({
    mutationFn: ({ itemId, available }: { itemId: string; available: boolean }) =>
      updateMenuItemAvailability(itemId, available),
    onMutate: async ({ itemId, available }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.menu.all });
      const snap = queryClient.getQueriesData({ queryKey: QUERY_KEYS.menu.all });

      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.menu.all },
        (old: unknown) => {
          if (!Array.isArray(old)) return old;
          return old.map((item: { id: string; available: boolean }) =>
            item.id === itemId ? { ...item, available } : item,
          );
        },
      );
      return { snap };
    },
    onError: (err, _vars, ctx) => {
      for (const [key, data] of ctx?.snap ?? []) {
        queryClient.setQueryData(key, data);
      }
      toastMutationError(err);
    },
    onSuccess: (_data, { available }) => {
      toastSuccess(available ? t("markedAvailable") : t("markedUnavailable"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menu.all });
    },
  });
}

// ─── useDeleteMenuItem ────────────────────────────────────────────────────────

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.menu");

  return useMutation({
    mutationFn: (itemId: string) => deleteMenuItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menu.all });
      toastSuccess(t("deleted"));
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}
