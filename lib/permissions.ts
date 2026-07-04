import { ROUTES, type AppRoute } from "@/lib/constants/routes";
import type { UserRole } from "@/types/auth";

// ─── Role → allowed module routes ──────────────────────────────────────────────

const ALL_ROUTES: AppRoute[] = Object.values(ROUTES).filter(
  (route) => route !== ROUTES.LOGIN && route !== ROUTES.UNAUTHORIZED,
);

export const MODULE_ACCESS: Record<UserRole, AppRoute[]> = {
  Owner: ALL_ROUTES,
  Manager: [
    ROUTES.DASHBOARD,
    ROUTES.ORDERS,
    ROUTES.MENU,
    ROUTES.TABLES,
    ROUTES.KITCHEN,
    ROUTES.INVENTORY,
    ROUTES.CUSTOMERS,
    ROUTES.EMPLOYEES,
    ROUTES.USERS,
    ROUTES.REPORTS,
    ROUTES.SETTINGS,
  ],
  // Settings holds restaurant-wide configuration (business hours, tax,
  // integrations, etc.) — restricted to Owner/Manager, not day-to-day staff.
  Cashier: [ROUTES.DASHBOARD, ROUTES.ORDERS, ROUTES.CUSTOMERS, ROUTES.TABLES],
  Waiter: [ROUTES.DASHBOARD, ROUTES.ORDERS, ROUTES.TABLES],
  "Kitchen Staff": [ROUTES.DASHBOARD, ROUTES.KITCHEN],
  "Inventory Manager": [ROUTES.DASHBOARD, ROUTES.INVENTORY],
};

/** Routes with no explicit module (e.g. root/login) are always reachable once authenticated. */
export function hasAccess(role: UserRole | undefined, pathname: string): boolean {
  if (!role) return false;
  const allowed = MODULE_ACCESS[role] ?? [];
  return allowed.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export function getAllowedRoutes(role: UserRole | undefined): AppRoute[] {
  if (!role) return [];
  return MODULE_ACCESS[role] ?? [];
}
