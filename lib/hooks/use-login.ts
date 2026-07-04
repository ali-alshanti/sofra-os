"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { authService } from "@/services/auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { ROUTES } from "@/lib/constants/routes";
import { getErrorKey } from "@/lib/utils/error-map";
import { useLoadingOverlay } from "@/lib/providers/loading-overlay-provider";

export function useLogin() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const queryClient  = useQueryClient();
  const overlay       = useLoadingOverlay();
  const [isNavigating, startTransition] = useTransition();
  const t = useTranslations("common.loadingOverlay");

  // Keep the overlay up until the redirect target has actually rendered.
  useEffect(() => {
    if (!isNavigating) overlay.hide();
  }, [isNavigating, overlay]);

  return useMutation({
    mutationFn: authService.signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all });

      overlay.show(t("signingIn"));
      const redirectTo = searchParams.get("redirectTo") ?? ROUTES.DASHBOARD;

      startTransition(() => {
        router.push(redirectTo);
        router.refresh();
      });
    },
    // Error is surfaced in the form via mutation.error — getErrorKey maps it to a translation key
    // so the form component can call t(getErrorKey(login.error)) for a localized message.
    meta: { getErrorKey },
  });
}
