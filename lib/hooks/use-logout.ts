"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

export function useLogout() {
  const router      = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      // Clear all cached data — the next user must start fresh
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}
