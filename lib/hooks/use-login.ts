"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
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
      // Invalidate auth cache so useAuth() re-fetches the profile
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all });

      // Honour the ?redirectTo= param, fall back to Dashboard
      const redirectTo = searchParams.get("redirectTo") ?? ROUTES.DASHBOARD;
      router.push(redirectTo);
      router.refresh(); // flush Server Component cache
    },
  });
}
