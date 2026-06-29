"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getEmployees,
  getEmployeeSummary,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  type GetEmployeesParams,
} from "@/services/employees";
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
    staleTime: 60 * 1000,          // 1 min — status changes frequently
    refetchInterval: 60 * 1000,    // auto-refresh shift status
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

// ─── useUpdateEmployee ────────────────────────────────────────────────────────

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, patch }: {
      employeeId: string;
      patch: Parameters<typeof updateEmployee>[1];
    }) => updateEmployee(employeeId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
    },
  });
}

// ─── useUpdateEmployeeStatus ──────────────────────────────────────────────────

export function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, status }: { employeeId: string; status: EmployeeStatus }) =>
      updateEmployeeStatus(employeeId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
    },
  });
}

// ─── useDeleteEmployee ────────────────────────────────────────────────────────

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => deleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees.all });
    },
  });
}
