"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

/**
 * Fetches and caches the currently authenticated user + their profile.
 * Returns null when no session exists.
 */
export function useAuth() {
  return useQuery({
    queryKey: QUERY_KEYS.auth.session(),
    queryFn:  authService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // treat profile as fresh for 5 min
    retry: false,              // do not retry — 401 is not a transient error
  });
}

/** Convenience wrapper exposing the most-used auth state. */
export function useCurrentUser() {
  const { data, isLoading, isError } = useAuth();
  return {
    user:            data ?? null,
    isLoading,
    isAuthenticated: !!data,
    isError,
  };
}
