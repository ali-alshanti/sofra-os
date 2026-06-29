"use client";

import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  LayoutGrid,
  ChefHat,
  Package,
  Users,
  UserCog,
  BarChart2,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/lib/navigation";
import { Link } from "@/lib/navigation";
import { APP_NAME } from "@/lib/constants/app";
import { ROUTES } from "@/lib/constants/routes";
import { SidebarNav } from "@/components/layout/sidebar/sidebar-nav";
import { SidebarNavItem } from "@/components/layout/sidebar/sidebar-nav-item";
import { useCurrentUser } from "@/lib/hooks/use-auth";
import { initials } from "@/lib/utils/string";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function SidebarLogo() {
  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
        <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="text-sm font-semibold text-sidebar-foreground">
        {APP_NAME}
      </span>
    </div>
  );
}

// ─── Bottom ───────────────────────────────────────────────────────────────────

function SidebarBottom() {
  const t        = useTranslations("common.nav");
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const settingsActive =
    pathname === ROUTES.SETTINGS || pathname.startsWith(ROUTES.SETTINGS + "/");

  const displayName = user?.full_name ?? "User";
  const displayRole = user?.role      ?? "Staff";

  return (
    <div className="shrink-0 border-t border-sidebar-border px-3 py-4">
      <SidebarNavItem
        icon={Settings}
        label={t("settings")}
        href={ROUTES.SETTINGS}
        active={settingsActive}
      />

      {/* User profile */}
      <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials(displayName)}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-sidebar-foreground">
            {displayName}
          </span>
          <span className="typography-caption truncate text-muted-foreground capitalize">
            {displayRole}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function Sidebar() {
  const t = useTranslations("common.nav");

  const NAV_ITEMS = [
    { label: t("dashboard"),  icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    { label: t("orders"),     icon: ShoppingBag,    href: ROUTES.ORDERS },
    { label: t("menu"),       icon: UtensilsCrossed, href: ROUTES.MENU },
    { label: t("tables"),     icon: LayoutGrid,     href: ROUTES.TABLES },
    { label: t("kitchen"),    icon: ChefHat,        href: ROUTES.KITCHEN },
    { label: t("inventory"),  icon: Package,        href: ROUTES.INVENTORY },
    { label: t("customers"),  icon: Users,          href: ROUTES.CUSTOMERS },
    { label: t("employees"),  icon: UserCog,        href: ROUTES.EMPLOYEES },
    { label: t("reports"),    icon: BarChart2,      href: ROUTES.REPORTS },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-e border-sidebar-border bg-sidebar">
      <SidebarLogo />
      <SidebarNav items={NAV_ITEMS} />
      <SidebarBottom />
    </aside>
  );
}
