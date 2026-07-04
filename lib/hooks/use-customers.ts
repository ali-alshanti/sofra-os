"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "./use-auth";
import { useAppToast } from "./use-app-toast";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getCustomers,
  getCustomerSummary,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type GetCustomersParams,
  type CreateCustomerPayload,
} from "@/services/customers";
import { createNotification } from "@/services/notifications";

// ─── useCustomers ─────────────────────────────────────────────────────────────

type UseCustomersParams = Omit<GetCustomersParams, "restaurantId">;

export function useCustomers(params: UseCustomersParams = {}) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  const fullParams: GetCustomersParams = { restaurantId, ...params };

  return useQuery({
    queryKey: QUERY_KEYS.customers.list(fullParams as unknown as Record<string, unknown>),
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

// ─── useCreateCustomer ────────────────────────────────────────────────────────

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.customers");

  return useMutation({
    mutationFn: (payload: Omit<CreateCustomerPayload, "restaurantId">) => {
      const restaurantId = user?.restaurant_id ?? "";
      return createCustomer({ restaurantId, ...payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      toastSuccess(t("created"));

      if (!user?.restaurant_id || !user?.id) return;
      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "system",
        title: "New Customer",
        message: "A new customer has been added.",
        data: { key: "customer.registered", params: {} },
      }).catch(console.error);
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useUpdateCustomer ────────────────────────────────────────────────────────

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.customers");

  return useMutation({
    mutationFn: ({ customerId, patch }: {
      customerId: string;
      patch: Parameters<typeof updateCustomer>[1];
    }) => updateCustomer(customerId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      toastSuccess(t("updated"));

      if (!user?.restaurant_id || !user?.id) return;
      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "system",
        title: "Customer Updated",
        message: "A customer profile has been updated.",
        data: { key: "customer.updated", params: {} },
      }).catch(console.error);
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useDeleteCustomer ────────────────────────────────────────────────────────

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.customers");

  return useMutation({
    mutationFn: (customerId: string) => deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers.all });
      toastSuccess(t("deleted"));
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}
