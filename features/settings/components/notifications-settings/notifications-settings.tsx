import { Switch } from "@/components/ui/switch";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import type { NotificationSettings, NotificationType } from "@/features/settings/types";

// ─── Notification config ───────────────────────────────────────────────────────
// Maps every NotificationType to display metadata.
// Adding a new NotificationType: extend this array — no component code changes.

const NOTIFICATION_CONFIG: {
  type:        NotificationType;
  label:       string;
  description: string;
}[] = [
  {
    type:        "newOrder",
    label:       "New Order",
    description: "Alert when a new order is placed from any table or channel.",
  },
  {
    type:        "orderReady",
    label:       "Order Ready",
    description: "Alert when the kitchen marks an order as ready for service.",
  },
  {
    type:        "lowStock",
    label:       "Low Stock",
    description: "Alert when an inventory item falls below its reorder point.",
  },
  {
    type:        "newReservation",
    label:       "New Reservation",
    description: "Alert when a table reservation is created or modified.",
  },
  {
    type:        "staffAlert",
    label:       "Staff Alert",
    description: "Alert on shift changes, absences, or staff-related events.",
  },
  {
    type:        "dailySummary",
    label:       "Daily Summary",
    description: "Receive an end-of-day summary report of all operations.",
  },
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
  return (
    <SettingsSectionCard
      title="Notifications"
      description="Choose which events trigger alerts in the application."
    >
      <div className="space-y-0">
        {NOTIFICATION_CONFIG.map(({ type, label, description }, i) => (
          <div key={type}>
            <div className="flex items-center justify-between gap-4 py-3.5">
              {/* Text */}
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="typography-small text-muted-foreground">{description}</p>
              </div>

              {/* Toggle */}
              <Switch
                id={`notif-${type}`}
                checked={values[type]}
                onCheckedChange={(checked) => onChange(type, checked)}
                disabled={disabled}
                aria-label={`Enable ${label} notifications`}
              />
            </div>

            {/* Divider — skip after last row */}
            {i < NOTIFICATION_CONFIG.length - 1 && (
              <div className="h-px bg-border/40" />
            )}
          </div>
        ))}
      </div>
    </SettingsSectionCard>
  );
}
