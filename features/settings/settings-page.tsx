"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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

import {
  useRestaurantSettings,
  useUpdateRestaurantSettings,
  useUpdateBusinessHours,
  useIntegrations,
  useUpdateIntegration,
} from "@/lib/hooks/use-settings";
import { useCurrentUser } from "@/lib/hooks/use-auth";
import { useAppToast } from "@/lib/hooks/use-app-toast";
import { useTranslations } from "next-intl";

import type {
  RestaurantSettings,
  SettingsSection,
  DayOfWeek,
  DaySchedule,
  NotificationType,
  Integration,
} from "./types";

// Language changes trigger an immediate locale navigation (see system-settings-form),
// which remounts this component. Stash the in-progress draft so unsaved edits survive.
const DRAFT_STORAGE_KEY = "sofra:settings:draft";

// ─── Section order ─────────────────────────────────────────────────────────────

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
  const { toastSuccess, toastError, toastMutationError } = useAppToast();
  const t  = useTranslations("common.toast.success.settings");
  const ts = useTranslations("settings");
  const ta = useTranslations("common.actions");

  // ── Auth + remote data ───────────────────────────────────────────────────────
  const { user, isLoading: authLoading } = useCurrentUser();
  const { data: remoteSettings, isLoading: settingsLoading, isError } = useRestaurantSettings();
  const { data: remoteIntegrations }        = useIntegrations();

  const isLoading = authLoading || settingsLoading;

  const updateSettings    = useUpdateRestaurantSettings();
  const updateHours       = useUpdateBusinessHours();
  const updateIntegration = useUpdateIntegration();

  // ── Local state (mirrors server state; enables dirty-check) ─────────────────
  const [settings, setSettings]           = useState<RestaurantSettings | null>(null);
  const [savedSettings, setSavedSettings] = useState<RestaurantSettings | null>(null);
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [isSaving, setIsSaving]           = useState(false);
  const [integrations, setIntegrations]   = useState<Integration[]>([]);

  // Seed local state from DB on first successful load.
  // Using a ref guard so the effect only runs once regardless of re-renders.
  const seededRef = useRef(false);
  useEffect(() => {
    if (remoteSettings && !seededRef.current) {
      seededRef.current = true;

      let draft: RestaurantSettings | null = null;
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        try {
          draft = JSON.parse(raw) as RestaurantSettings;
        } catch {
          draft = null;
        }
      }

      setSettings(draft ?? remoteSettings);
      setSavedSettings(remoteSettings);
    }
  }, [remoteSettings]);

  useEffect(() => {
    if (remoteIntegrations) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIntegrations(remoteIntegrations);
    }
  }, [remoteIntegrations]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const isDirty = !!settings && JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // ── Section refs for scrollIntoView ─────────────────────────────────────────
  const sectionRefs = useRef<Partial<Record<SettingsSection, HTMLElement | null>>>({});

  // Suppress the scrollspy while a click-triggered smooth scroll is still in flight,
  // so the observer doesn't fight the section the user just chose.
  const isProgrammaticScroll = useRef(false);

  const handleSectionChange = useCallback((section: SettingsSection) => {
    setActiveSection(section);
    isProgrammaticScroll.current = true;
    sectionRefs.current[section]?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => { isProgrammaticScroll.current = false; }, 600);
  }, []);

  // ── Scrollspy: highlight the sidebar section under the top of the viewport ──
  useEffect(() => {
    if (!settings) return;

    const elements = SECTION_ORDER
      .map((section) => ({ section, el: sectionRefs.current[section] }))
      .filter((entry): entry is { section: SettingsSection; el: HTMLElement } => !!entry.el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        const match = elements.find(({ el }) => el === topMost.target);
        if (match) setActiveSection(match.section);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [settings]);

  // ── Patch helpers ────────────────────────────────────────────────────────────

  function patchGeneral(patch: Partial<RestaurantSettings["general"]>) {
    setSettings((s) => s ? { ...s, general: { ...s.general, ...patch } } : s);
  }

  function patchBusinessHours(day: DayOfWeek, patch: Partial<DaySchedule>) {
    setSettings((s) => s ? ({
      ...s,
      businessHours: {
        ...s.businessHours,
        [day]: { ...s.businessHours[day], ...patch },
      },
    }) : s);
  }

  function patchCurrency(patch: Partial<RestaurantSettings["currency"]>) {
    setSettings((s) => s ? { ...s, currency: { ...s.currency, ...patch } } : s);
  }

  function patchSystem(patch: Partial<RestaurantSettings["system"]>) {
    setSettings((s) => {
      if (!s) return s;
      const next = { ...s, system: { ...s.system, ...patch } };
      // Language changes navigate to a new locale route (remounting this
      // component) before the user can hit Save — persist the draft first.
      if (patch.language) {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }

  function patchNotification(type: NotificationType, enabled: boolean) {
    setSettings((s) => s ? ({
      ...s,
      notifications: { ...s.notifications, [type]: enabled },
    }) : s);
  }

  // ── Save — persists all sections atomically ───────────────────────────────────

  async function handleSave() {
    if (!settings) return;
    setIsSaving(true);
    try {
      await Promise.all([
        updateSettings.mutateAsync(settings),
        updateHours.mutateAsync(settings.businessHours),
      ]);
      setSavedSettings(settings);
      toastSuccess(t("saved"));
    } catch (err) {
      toastMutationError(err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleDiscard() {
    if (savedSettings) setSettings(savedSettings);
  }

  // ── Integration handlers ──────────────────────────────────────────────────────

  async function handleConnect(id: string) {
    try {
      const updated = await updateIntegration.mutateAsync({ id, status: "connected" });
      setIntegrations(updated);
      toastSuccess(t("integrationConnected"));
    } catch (err) {
      toastMutationError(err);
    }
  }

  async function handleDisconnect(id: string) {
    try {
      const updated = await updateIntegration.mutateAsync({ id, status: "disconnected" });
      setIntegrations(updated);
      toastSuccess(t("integrationDisconnected"));
    } catch (err) {
      toastMutationError(err);
    }
  }

  // ── Render: not linked to a restaurant ──────────────────────────────────────

  if (!authLoading && !user?.restaurant_id) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
          <p className="text-lg font-semibold text-foreground">{ts("errors.noRestaurant")}</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {ts("errors.noRestaurantDesc")}
          </p>
        </div>
      </AppShell>
    );
  }

  // ── Render: settings query error ─────────────────────────────────────────────

  if (isError) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
          <p className="text-lg font-semibold text-foreground">{ts("errors.loadFailed")}</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {ts("errors.loadFailedDesc")}
          </p>
        </div>
      </AppShell>
    );
  }

  // ── Render (loading state) ────────────────────────────────────────────────────

  if (isLoading || !settings) {
    return (
      <AppShell>
        <div className="flex flex-col min-h-full animate-pulse">
          <div className="mb-6 h-16 rounded-xl bg-muted" />
          <div className="flex gap-6">
            <div className="hidden lg:block w-64 h-96 rounded-xl bg-muted" />
            <div className="flex-1 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AppShell>
      <div className="flex flex-col min-h-full">

        {/* Page Header */}
        <PageHeader
          title={ts("title")}
          description={ts("description")}
          className="mb-6"
          actions={
            <div className="flex items-center gap-3">
              {isDirty && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleDiscard}
                  disabled={isSaving}
                >
                  <RotateCcw size={14} />
                  {ta("reset")}
                </Button>
              )}
              <Button
                size="sm"
                className="gap-2"
                disabled={!isDirty || isSaving}
                onClick={handleSave}
              >
                <Save size={14} />
                {isSaving ? ts("actionBar.saving") : ts("actionBar.save")}
              </Button>
            </div>
          }
        />

        {/* Main Layout */}
        <div className="flex flex-col flex-1 gap-6 items-start lg:flex-row">

          {/* Sidebar — sticky on desktop */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-0">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </aside>

          {/* Mobile section nav */}
          <div className="lg:hidden w-full overflow-y-auto max-h-56 rounded-xl border border-border bg-card p-2">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
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
                    disabled={isSaving}
                  />
                )}
                {section === "business-hours" && (
                  <BusinessHoursForm
                    businessHours={settings.businessHours}
                    onChange={patchBusinessHours}
                    disabled={isSaving}
                  />
                )}
                {section === "currency-tax" && (
                  <CurrencyTaxForm
                    values={settings.currency}
                    onChange={patchCurrency}
                    disabled={isSaving}
                  />
                )}
                {section === "system" && (
                  <SystemSettingsForm
                    values={settings.system}
                    onChange={patchSystem}
                    disabled={isSaving}
                  />
                )}
                {section === "notifications" && (
                  <NotificationsSettings
                    values={settings.notifications}
                    onChange={patchNotification}
                    disabled={isSaving}
                  />
                )}
                {section === "integrations" && (
                  <IntegrationsSettings
                    integrations={integrations}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    disabled={updateIntegration.isPending}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sticky action bar */}
        <SettingsActionBar
          isDirty={isDirty}
          loading={isSaving}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />

      </div>
    </AppShell>
  );
}
