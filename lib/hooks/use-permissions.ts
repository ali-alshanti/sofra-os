"use client";

import { useCurrentUser } from "@/lib/hooks/use-auth";
import { getAllowedRoutes, hasAccess } from "@/lib/permissions";

/** Exposes the current user's role-based module access. */
export function usePermissions() {
  const { user } = useCurrentUser();

  return {
    role: user?.role,
    allowedRoutes: getAllowedRoutes(user?.role),
    canAccess: (pathname: string) => hasAccess(user?.role, pathname),
  };
}
