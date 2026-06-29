"use client";

import {
  Store, Clock, CircleDollarSign, Monitor, Bell, Plug,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { SettingsSection } from "@/features/settings/types";

// ─── Section config — icons only; labels come from translations ──────────────

interface SectionConfig {
  section: SettingsSection;
  icon:    LucideIcon;
  labelKey: string;
  descKey:  string;
}

const SECTIONS: SectionConfig[] = [
  { section: "general",        icon: Store,           labelKey: "general",       descKey: "generalDesc"       },
  { section: "business-hours", icon: Clock,           labelKey: "businessHours", descKey: "businessHoursDesc" },
  { section: "currency-tax",   icon: CircleDollarSign,labelKey: "currencyTax",   descKey: "currencyTaxDesc"   },
  { section: "system",         icon: Monitor,         labelKey: "system",        descKey: "systemDesc"        },
  { section: "notifications",  icon: Bell,            labelKey: "notifications", descKey: "notificationsDesc" },
  { section: "integrations",   icon: Plug,            labelKey: "integrations",  descKey: "integrationsDesc"  },
];

export interface SettingsSidebarProps {
  activeSection:    SettingsSection;
  onSectionChange?: (section: SettingsSection) => void;
  className?:       string;
}

export function SettingsSidebar({ activeSection, onSectionChange, className }: SettingsSidebarProps) {
  const t = useTranslations("settings.sidebar");

  return (
    <nav
      role="tablist"
      aria-label="Settings navigation"
      aria-orientation="vertical"
      className={cn("flex flex-col gap-1", className)}
    >
      {SECTIONS.map(({ section, labelKey, descKey, icon: Icon }) => {
        const isActive = section === activeSection;

        return (
          <button
            key={section}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`settings-panel-${section}`}
            onClick={() => onSectionChange?.(section)}
            className={cn(
              "group w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
              )}
            >
              <Icon size={16} />
            </div>

            <div className="min-w-0 flex flex-col">
              <span className={cn("text-sm leading-snug truncate transition-colors", isActive ? "font-semibold" : "font-medium")}>
                {t(labelKey)}
              </span>
              <span className="typography-caption text-muted-foreground truncate">
                {t(descKey)}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
