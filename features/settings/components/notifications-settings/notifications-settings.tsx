import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import type { NotificationSettings, NotificationType } from "@/features/settings/types";

// ─── Notification type keys ───────────────────────────────────────────────────

const NOTIFICATION_TYPES: NotificationType[] = [
  "newOrder",
  "orderReady",
  "lowStock",
  "newReservation",
  "staffAlert",
  "dailySummary",
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NotificationsSettingsProps {
  values:    NotificationSettings;
  onChange:  (type: NotificationType, enabled: boolean) => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationsSettings({
  values,
  onChange,
  disabled = false,
}: NotificationsSettingsProps) {
  const t = useTranslations("settings.notifications");

  return (
    <SettingsSectionCard
      title={t("title")}
      description={t("description")}
    >
      <div className="space-y-0">
        {NOTIFICATION_TYPES.map((type, i) => (
          <div key={type}>
            <div className="flex items-center justify-between gap-4 py-3.5">
              {/* Text */}
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-medium text-foreground">{t(type)}</p>
                <p className="typography-small text-muted-foreground">{t(`${type}Desc`)}</p>
              </div>

              {/* Toggle */}
              <Switch
                id={`notif-${type}`}
                checked={values[type]}
                onCheckedChange={(checked) => onChange(type, checked)}
                disabled={disabled}
                aria-label={t(type)}
              />
            </div>

            {/* Divider — skip after last row */}
            {i < NOTIFICATION_TYPES.length - 1 && (
              <div className="h-px bg-border/40" />
            )}
          </div>
        ))}
      </div>
    </SettingsSectionCard>
  );
}
