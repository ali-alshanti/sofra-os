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
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants/app";
import { ROUTES } from "@/lib/constants/routes";
import { SidebarNav, type NavItem } from "@/components/layout/sidebar/sidebar-nav";
import { SidebarNavItem } from "@/components/layout/sidebar/sidebar-nav-item";

// ─── Navigation Config ───────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: "Orders",    icon: ShoppingBag,    href: ROUTES.ORDERS },
  { label: "Menu",      icon: UtensilsCrossed, href: ROUTES.MENU },
  { label: "Tables",    icon: LayoutGrid,     href: ROUTES.TABLES },
  { label: "Kitchen",   icon: ChefHat,        href: ROUTES.KITCHEN },
  { label: "Inventory", icon: Package,        href: ROUTES.INVENTORY },
  { label: "Customers", icon: Users,          href: ROUTES.CUSTOMERS },
  { label: "Employees", icon: UserCog,        href: ROUTES.EMPLOYEES },
  { label: "Reports",   icon: BarChart2,      href: ROUTES.REPORTS },
];

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
  const pathname = usePathname();
  const settingsActive = pathname === ROUTES.SETTINGS || pathname.startsWith(ROUTES.SETTINGS + "/");

  return (
    <div className="shrink-0 border-t border-sidebar-border px-3 py-4">
      <SidebarNavItem
        icon={Settings}
        label="Settings"
        href={ROUTES.SETTINGS}
        active={settingsActive}
      />

      {/* User profile placeholder */}
      <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
          U
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-sidebar-foreground">
            User Name
          </span>
          <span className="typography-caption truncate text-muted-foreground">
            user@sofra.os
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <SidebarLogo />
      <SidebarNav items={NAV_ITEMS} />
      <SidebarBottom />
    </aside>
  );
}
