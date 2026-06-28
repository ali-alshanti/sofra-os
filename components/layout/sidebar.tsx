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
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import { APP_NAME } from "@/lib/constants/app";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

// ─── Navigation Config ───────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: "Orders", icon: ShoppingBag, href: ROUTES.ORDERS },
  { label: "Menu", icon: UtensilsCrossed, href: ROUTES.MENU },
  { label: "Tables", icon: LayoutGrid, href: ROUTES.TABLES },
  { label: "Kitchen", icon: ChefHat, href: ROUTES.KITCHEN },
  { label: "Inventory", icon: Package, href: ROUTES.INVENTORY },
  { label: "Customers", icon: Users, href: ROUTES.CUSTOMERS },
  { label: "Employees", icon: UserCog, href: ROUTES.EMPLOYEES },
  { label: "Reports", icon: BarChart2, href: ROUTES.REPORTS },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: "Settings", icon: Settings, href: ROUTES.SETTINGS },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

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

interface SidebarNavItemProps {
  item: NavItem;
  active?: boolean;
}

function SidebarNavItem({ item, active = false }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active
            ? "text-primary"
            : "text-sidebar-foreground group-hover:text-primary",
        )}
      />
      {item.label}
    </a>
  );
}

function SidebarNav() {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {NAV_ITEMS.map((item) => (
        <SidebarNavItem key={item.href} item={item} />
      ))}
    </nav>
  );
}

function SidebarBottom() {
  return (
    <div className="shrink-0 border-t border-sidebar-border px-3 py-4">
      <div className="flex flex-col gap-1">
        {BOTTOM_ITEMS.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </div>

      {/* User profile placeholder */}
      <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
          U
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-sidebar-foreground">
            User Name
          </span>
          <span className="typography-caption text-muted-foreground">
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
      <SidebarNav />
      <SidebarBottom />
    </aside>
  );
}
