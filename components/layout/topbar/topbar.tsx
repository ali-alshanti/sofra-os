"use client";

import { usePathname } from "next/navigation";
import { SearchInput } from "@/components/layout/topbar/search-input";
import { NotificationsButton } from "@/components/layout/topbar/notifications-button";
import { ThemeToggle } from "@/components/layout/topbar/theme-toggle";
import { UserMenu } from "@/components/layout/topbar/user-menu";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/orders":     "Orders",
  "/menu":       "Menu",
  "/tables":     "Tables",
  "/kitchen":    "Kitchen",
  "/inventory":  "Inventory",
  "/customers":  "Customers",
  "/employees":  "Employees",
  "/reports":    "Reports",
  "/settings":   "Settings",
};

function usePageTitle(): string {
  const pathname = usePathname();
  const segment = "/" + (pathname.split("/")[1] ?? "");
  return ROUTE_TITLES[segment] ?? "Sofra OS";
}

export function Topbar() {
  const title = usePageTitle();
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Left — title + search */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        <SearchInput />
      </div>

      {/* Right — actions + user */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationsButton />
        <div className="mx-2 h-5 w-px bg-border" />
        <UserMenu />
      </div>
    </header>
  );
}
