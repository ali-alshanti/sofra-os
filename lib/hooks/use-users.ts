"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "./use-auth";
import { useAppToast } from "./use-app-toast";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import {
  getUsers,
  createUser,
  updateUser,
  setUserStatus,
  type GetUsersParams,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/services/users";
import type { AppUserStatus } from "@/features/users/types";

// ─── useUsers ─────────────────────────────────────────────────────────────────

type UseUsersParams = Omit<GetUsersParams, "restaurantId">;

export function useUsers(params: UseUsersParams = {}) {
  const { user } = useCurrentUser();
  const restaurantId = user?.restaurant_id ?? "";

  const fullParams: GetUsersParams = { restaurantId, ...params };

  return useQuery({
    queryKey: QUERY_KEYS.users.list(fullParams as unknown as Record<string, unknown>),
    queryFn: () => getUsers(fullParams),
    enabled: !!restaurantId,
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

// ─── useCreateUser ────────────────────────────────────────────────────────────

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.users");

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toastSuccess(t("created"));
    },
    onError: (err) => toastMutationError(err),
  });
}

// ─── useUpdateUser ────────────────────────────────────────────────────────────

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.users");

  return useMutation({
    mutationFn: ({ userId, patch }: { userId: string; patch: UpdateUserPayload }) =>
      updateUser(userId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toastSuccess(t("updated"));
    },
    onError: (err) => toastMutationError(err),
  });
}

// ─── useSetUserStatus ─────────────────────────────────────────────────────────

export function useSetUserStatus() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.users");

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: AppUserStatus }) =>
      setUserStatus(userId, status),
    onSuccess: (_data, { status }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toastSuccess(t(status === "active" ? "reactivated" : "deactivated"));
    },
    onError: (err) => toastMutationError(err),
  });
}
