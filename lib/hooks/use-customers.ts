"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getCustomers,
  getCustomerSummary,
  updateCustomer,
  deleteCustomer,
  type GetCustomersParams,
} from "@/services/customers";

// ─── useCustomers ─────────────────────────────────────────────────────────────

type UseCustomersParams = Omit<GetCustomersParams, "restaurantId">;

export function useCustomers(params: UseCustomersParams = {}) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  const fullParams: GetCustomersParams = { restaurantId, ...params };

  return useQuery({
    queryKey: QUERY_KEYS.customers.list(fullParams as Record<string, unknown>),
    queryFn:  () => getCustomers(fullParams),
    enabled:  !!restaurantId,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

// ─── useCustomerSummary ───────────────────────────────────────────────────────

export function useCustomerSummary() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.customers.summary(restaurantId),
    queryFn:  () => getCustomerSummary(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

// ─── useUpdateCustomer ────────────────────────────────────────────────────────

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, patch }: {
      customerId: string;
      patch: Parameters<typeof updateCustomer>[1];
    }) => updateCustomer(customerId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
    },
  });
}

// ─── useDeleteCustomer ────────────────────────────────────────────────────────

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
    },
  });
}
