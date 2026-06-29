"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/lib/navigation";
import { SearchInput } from "@/components/layout/topbar/search-input";
import { NotificationsButton } from "@/components/layout/topbar/notifications-button";
import { ThemeToggle } from "@/components/layout/topbar/theme-toggle";
import { UserMenu } from "@/components/layout/topbar/user-menu";
import { LanguageSwitcher } from "@/components/layout/topbar/language-switcher";

// Maps URL segment to translation key in common.nav
const ROUTE_NAV_KEY: Record<string, string> = {
  "/dashboard":  "dashboard",
  "/orders":     "orders",
  "/menu":       "menu",
  "/tables":     "tables",
  "/kitchen":    "kitchen",
  "/inventory":  "inventory",
  "/customers":  "customers",
  "/employees":  "employees",
  "/reports":    "reports",
  "/settings":   "settings",
};

export function Topbar() {
  const t        = useTranslations("common");
  const pathname = usePathname();

  const segment  = "/" + (pathname.split("/")[1] ?? "");
  const navKey   = ROUTE_NAV_KEY[segment];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const title    = navKey ? t(`nav.${navKey}` as any) : t("appName");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Left — title + search */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        <SearchInput />
      </div>

      {/* Right — language + theme + notifications + user */}
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationsButton />
        <div className="mx-2 h-5 w-px bg-border" />
        <UserMenu />
      </div>
    </header>
  );
}
