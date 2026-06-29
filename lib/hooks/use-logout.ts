"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { authService } from "@/services/auth";
import { useAppToast } from "./use-app-toast";

export function useLogout() {
  const router      = useRouter();
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t = useTranslations("common.toast.success.auth");

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.clear();
      toastSuccess(t("loggedOut"));
      router.push("/login");
      router.refresh();
    },
    onError: (err) => {
      toastMutationError(err);
    },
  });
}
