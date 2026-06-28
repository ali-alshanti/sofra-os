"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
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
    staleTime: 5 * 60 * 1000,  // categories change rarely
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
  const { user }    = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useMutation({
    mutationFn: ({ itemId, available }: { itemId: string; available: boolean }) =>
      updateMenuItemAvailability(itemId, available),
    // Optimistic update — flip locally before server confirms
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
    onError: (_err, _vars, ctx) => {
      // Rollback on error
      for (const [key, data] of ctx?.snap ?? []) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menu.all });
    },
  });
}

// ─── useDeleteMenuItem ────────────────────────────────────────────────────────

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteMenuItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menu.all });
    },
  });
}
