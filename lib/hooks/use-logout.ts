"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/lib/navigation";   // locale-aware router
import { authService } from "@/services/auth";

export function useLogout() {
  const router      = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      // Clear all cached data — the next user must start fresh
      queryClient.clear();
      // next-intl's router.push preserves the current locale prefix,
      // so Arabic users land on /ar/login, English users on /login.
      router.push("/login");
      router.refresh();
    },
  });
}
