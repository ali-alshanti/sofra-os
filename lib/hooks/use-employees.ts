"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "./use-auth";
import { useAppToast } from "./use-app-toast";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getEmployees,
  getEmployeeSummary,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  type GetEmployeesParams,
  type CreateEmployeePayload,
} from "@/services/employees";
import { createNotification } from "@/services/notifications";
import type { EmployeeStatus } from "@/features/employees/types";

// ─── useEmployees ─────────────────────────────────────────────────────────────

type UseEmployeesParams = Omit<GetEmployeesParams, "restaurantId">;

export function useEmployees(params: UseEmployeesParams = {}) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  const fullParams: GetEmployeesParams = { restaurantId, ...params };

  return useQuery({
    queryKey: QUERY_KEYS.employees.list(fullParams as unknown as Record<string, unknown>),
    queryFn:  () => getEmployees(fullParams),
    enabled:  !!restaurantId,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

// ─── useEmployeeSummary ───────────────────────────────────────────────────────

export function useEmployeeSummary() {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.employees.summary(restaurantId),
    queryFn:  () => getEmployeeSummary(restaurantId),
    enabled:  !!restaurantId,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// ─── useCreateEmployee ────────────────────────────────────────────────────────

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.employees");

  return useMutation({
    mutationFn: (payload: Omit<CreateEmployeePayload, "restaurantId">) => {
      const restaurantId = user?.restaurant_id ?? "";
      return createEmployee({ restaurantId, ...payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      toastSuccess(t("created"));

      if (!user?.restaurant_id || !user?.id) return;
      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "system",
        title: "Employee Added",
        message: "A new employee has been added.",
        data: { key: "employee.added", params: {} },
      }).catch(console.error);
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useUpdateEmployee ────────────────────────────────────────────────────────

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.employees");

  return useMutation({
    mutationFn: ({ employeeId, patch }: {
      employeeId: string;
      patch: Parameters<typeof updateEmployee>[1];
    }) => updateEmployee(employeeId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      toastSuccess(t("updated"));

      if (!user?.restaurant_id || !user?.id) return;
      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "system",
        title: "Employee Updated",
        message: "An employee profile has been updated.",
        data: { key: "employee.updated", params: {} },
      }).catch(console.error);
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useUpdateEmployeeStatus ──────────────────────────────────────────────────

export function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.employees");

  return useMutation({
    mutationFn: ({ employeeId, status }: { employeeId: string; status: EmployeeStatus }) =>
      updateEmployeeStatus(employeeId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      toastSuccess(t("statusUpdated"));
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}

// ─── useDeleteEmployee ────────────────────────────────────────────────────────

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.employees");

  return useMutation({
    mutationFn: (employeeId: string) => deleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      toastSuccess(t("deleted"));

      if (!user?.restaurant_id || !user?.id) return;
      createNotification({
        restaurantId: user.restaurant_id,
        userId: user.id,
        type: "system",
        title: "Employee Removed",
        message: "An employee has been removed.",
        data: { key: "employee.removed", params: {} },
      }).catch(console.error);
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}
