"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { authService } from "@/services/auth";
import { useAppToast } from "./use-app-toast";
import { useLoadingOverlay } from "@/lib/providers/loading-overlay-provider";

export function useLogout() {
  const router      = useRouter();
  const queryClient = useQueryClient();
  const { toastSuccess, toastMutationError } = useAppToast();
  const t  = useTranslations("common.toast.success.auth");
  const to = useTranslations("common.loadingOverlay");
  const overlay = useLoadingOverlay();
  const [isNavigating, startTransition] = useTransition();

  // Keep the overlay up until the login page has actually rendered.
  useEffect(() => {
    if (!isNavigating) overlay.hide();
  }, [isNavigating, overlay]);

  return useMutation({
    mutationFn: authService.signOut,
    onMutate: () => {
      overlay.show(to("signingOut"));
    },
    onSuccess: () => {
      queryClient.clear();
      toastSuccess(t("loggedOut"));

      startTransition(() => {
        router.push("/login");
        router.refresh();
      });
    },
    onError: (err) => {
      overlay.hide();
      toastMutationError(err);
    },
  });
}
