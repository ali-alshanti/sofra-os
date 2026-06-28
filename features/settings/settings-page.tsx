"use client";

import { useState, useRef, useCallback } from "react";
import { Save, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

import { SettingsSidebar } from "./components/settings-sidebar";
import { SettingsActionBar } from "./components/settings-action-bar";
import { GeneralSettingsForm } from "./components/general-settings-form";
import { BusinessHoursForm } from "./components/business-hours-form";
import { CurrencyTaxForm } from "./components/currency-tax-form";
import { SystemSettingsForm } from "./components/system-settings-form";
import { NotificationsSettings } from "./components/notifications-settings";
import { IntegrationsSettings } from "./components/integrations-settings";

import type {
  RestaurantSettings,
  SettingsSection,
  DayOfWeek,
  DaySchedule,
  NotificationType,
} from "./types";

// ─── Placeholder defaults ─────────────────────────────────────────────────────

const DEFAULT_SETTINGS: RestaurantSettings = {
  general: {
    restaurantName: "Sofra Kitchen",
    address:        "123 Main Street, Dubai, UAE",
    phone:          "+971 50 000 0000",
    email:          "hello@sofrakitchen.ae",
  },
  businessHours: {
    monday:    { open: true,  openTime: "08:00", closeTime: "22:00" },
    tuesday:   { open: true,  openTime: "08:00", closeTime: "22:00" },
    wednesday: { open: true,  openTime: "08:00", closeTime: "22:00" },
    thursday:  { open: true,  openTime: "08:00", closeTime: "23:00" },
    friday:    { open: true,  openTime: "08:00", closeTime: "23:30" },
    saturday:  { open: true,  openTime: "10:00", closeTime: "23:30" },
    sunday:    { open: false, openTime: "10:00", closeTime: "22:00" },
  },
  currency: {
    currency: "AED",
    taxRate:  5,
    taxLabel: "VAT",
  },
  system: {
    theme:      "system",
    language:   "en",
    timezone:   "Asia/Dubai",
    dateFormat: "DD/MM/YYYY",
  },
  notifications: {
    newOrder:       true,
    orderReady:     true,
    lowStock:       true,
    newReservation: false,
    staffAlert:     false,
    dailySummary:   true,
  },
  integrations: [
    {
      id:          "pos-square",
      name:        "Square POS",
      description: "Sync orders and payments with Square point-of-sale.",
      status:      "connected",
    },
    {
      id:          "delivery-talabat",
      name:        "Talabat",
      description: "Accept delivery orders directly from the Talabat platform.",
      status:      "disconnected",
    },
    {
      id:          "accounting-xero",
      name:        "Xero",
      description: "Export daily revenue and expense data to Xero accounting.",
      status:      "disconnected",
    },
  ],
};

// ─── Section order — must match SettingsSidebar SECTIONS array ─────────────────

const SECTION_ORDER: SettingsSection[] = [
  "general",
  "business-hours",
  "currency-tax",
  "system",
  "notifications",
  "integrations",
];

// ─── Settings Feature ─────────────────────────────────────────────────────────

export function SettingsFeature() {
  const [settings, setSettings]         = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // ─── Section refs for scrollIntoView ────────────────────────────────────────
  const sectionRefs = useRef<Partial<Record<SettingsSection, HTMLElement | null>>>({});

  const handleSectionChange = useCallback((section: SettingsSection) => {
    setActiveSection(section);
    sectionRefs.current[section]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // ─── Patch helpers ────────────────────────────────────────────────────────────

  function patchGeneral(patch: Partial<RestaurantSettings["general"]>) {
    setSettings((s) => ({ ...s, general: { ...s.general, ...patch } }));
  }

  function patchBusinessHours(day: DayOfWeek, patch: Partial<DaySchedule>) {
    setSettings((s) => ({
      ...s,
      businessHours: {
        ...s.businessHours,
        [day]: { ...s.businessHours[day], ...patch },
      },
    }));
  }

  function patchCurrency(patch: Partial<RestaurantSettings["currency"]>) {
    setSettings((s) => ({ ...s, currency: { ...s.currency, ...patch } }));
  }

  function patchSystem(patch: Partial<RestaurantSettings["system"]>) {
    setSettings((s) => ({ ...s, system: { ...s.system, ...patch } }));
  }

  function patchNotification(type: NotificationType, enabled: boolean) {
    setSettings((s) => ({
      ...s,
      notifications: { ...s.notifications, [type]: enabled },
    }));
  }

  function handleSave() {
    setSavedSettings(settings);
  }

  function handleDiscard() {
    setSettings(savedSettings);
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <AppShell>
      <div className="flex flex-col min-h-full">

        {/* Page Header */}
        <PageHeader
          title="Settings"
          description="Manage your restaurant's configuration, preferences, and integrations."
          className="mb-6"
          actions={
            <div className="flex items-center gap-3">
              {isDirty && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleDiscard}
                >
                  <RotateCcw size={14} />
                  Reset
                </Button>
              )}
              <Button
                size="sm"
                className="gap-2"
                disabled={!isDirty}
                onClick={handleSave}
              >
                <Save size={14} />
                Save Changes
              </Button>
            </div>
          }
        />

        {/* Main Layout */}
        <div className="flex flex-1 gap-6 items-start">

          {/* Sidebar — sticky on desktop */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-0">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </aside>

          {/* Mobile tab strip */}
          <div className="lg:hidden w-full overflow-x-auto pb-2">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              className="flex-row flex-nowrap"
            />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-w-0 space-y-6 pb-24">
            {SECTION_ORDER.map((section) => (
              <div
                key={section}
                ref={(el) => { sectionRefs.current[section] = el; }}
                id={`settings-panel-${section}`}
                role="tabpanel"
                aria-labelledby={`settings-tab-${section}`}
              >
                {section === "general" && (
                  <GeneralSettingsForm
                    values={settings.general}
                    onChange={patchGeneral}
                  />
                )}
                {section === "business-hours" && (
                  <BusinessHoursForm
                    businessHours={settings.businessHours}
                    onChange={patchBusinessHours}
                  />
                )}
                {section === "currency-tax" && (
                  <CurrencyTaxForm
                    values={settings.currency}
                    onChange={patchCurrency}
                  />
                )}
                {section === "system" && (
                  <SystemSettingsForm
                    values={settings.system}
                    onChange={patchSystem}
                  />
                )}
                {section === "notifications" && (
                  <NotificationsSettings
                    values={settings.notifications}
                    onChange={patchNotification}
                  />
                )}
                {section === "integrations" && (
                  <IntegrationsSettings
                    integrations={settings.integrations}
                    onConnect={(_id) => undefined}
                    onDisconnect={(_id) => undefined}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sticky action bar */}
        <SettingsActionBar
          isDirty={isDirty}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />

      </div>
    </AppShell>
  );
}
