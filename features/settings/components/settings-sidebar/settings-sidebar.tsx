import {
  Store,
  Clock,
  CircleDollarSign,
  Monitor,
  Bell,
  Plug,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SettingsSection } from "@/features/settings/types";

// ─── Section config ────────────────────────────────────────────────────────────

interface SectionConfig {
  section:     SettingsSection;
  label:       string;
  description: string;
  icon:        LucideIcon;
}

const SECTIONS: SectionConfig[] = [
  {
    section:     "general",
    label:       "General",
    description: "Restaurant name, address, contact",
    icon:        Store,
  },
  {
    section:     "business-hours",
    label:       "Business Hours",
    description: "Weekly schedule and open/close times",
    icon:        Clock,
  },
  {
    section:     "currency-tax",
    label:       "Currency & Tax",
    description: "Currency, tax rate, and tax label",
    icon:        CircleDollarSign,
  },
  {
    section:     "system",
    label:       "System",
    description: "Theme, language, timezone, date format",
    icon:        Monitor,
  },
  {
    section:     "notifications",
    label:       "Notifications",
    description: "Alert preferences and event subscriptions",
    icon:        Bell,
  },
  {
    section:     "integrations",
    label:       "Integrations",
    description: "Third-party services and connections",
    icon:        Plug,
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SettingsSidebarProps {
  activeSection:    SettingsSection;
  onSectionChange?: (section: SettingsSection) => void;
  className?:       string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SettingsSidebar({
  activeSection,
  onSectionChange,
  className,
}: SettingsSidebarProps) {
  return (
    <nav
      role="tablist"
      aria-label="Settings navigation"
      aria-orientation="vertical"
      className={cn(
        "flex flex-col gap-1",
        className,
      )}
    >
      {SECTIONS.map(({ section, label, description, icon: Icon }) => {
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
              "group w-full flex items-center gap-3 rounded-xl px-4 py-3",
              "text-left transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            {/* Icon */}
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

            {/* Text */}
            <div className="min-w-0 flex flex-col">
              <span
                className={cn(
                  "text-sm leading-snug truncate transition-colors",
                  isActive ? "font-semibold" : "font-medium",
                )}
              >
                {label}
              </span>
              <span className="typography-caption text-muted-foreground truncate">
                {description}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
