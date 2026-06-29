"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/navigation";   // locale-aware router
import { authService } from "@/services/auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { ROUTES } from "@/lib/constants/routes";

export function useLogin() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const queryClient  = useQueryClient();

  return useMutation({
    mutationFn: authService.signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all });

      // Honour the ?redirectTo= param, fall back to Dashboard.
      // next-intl's router.push automatically prefixes the current locale,
      // keeping Arabic users inside /ar/... routes.
      const redirectTo = searchParams.get("redirectTo") ?? ROUTES.DASHBOARD;
      router.push(redirectTo);
      router.refresh();
    },
  });
}
