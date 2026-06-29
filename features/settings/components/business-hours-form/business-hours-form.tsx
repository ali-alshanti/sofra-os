import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSectionCard } from "@/features/settings/components/settings-section-card";
import type { BusinessHours, DayOfWeek, DaySchedule } from "@/features/settings/types";
import { cn } from "@/lib/utils";

// ─── Day keys (order preserved) ───────────────────────────────────────────────

const DAY_KEYS: DayOfWeek[] = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

// ─── Time options — 30-minute intervals, 00:00 – 23:30 ───────────────────────

const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BusinessHoursFormProps {
  businessHours: BusinessHours;
  onChange:      (day: DayOfWeek, patch: Partial<DaySchedule>) => void;
  disabled?:     boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BusinessHoursForm({
  businessHours,
  onChange,
  disabled = false,
}: BusinessHoursFormProps) {
  const t = useTranslations("settings.businessHours");

  return (
    <SettingsSectionCard
      title={t("title")}
      description={t("description")}
    >
      <div className="space-y-3">
        {DAY_KEYS.map((key, i) => {
          const schedule = businessHours[key];
          const label    = t(`days.${key}`);

          return (
            <div key={key}>
              {/* Day row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Open / Closed toggle */}
                <div className="flex items-center gap-2.5 w-40 shrink-0">
                  <Switch
                    id={`switch-${key}`}
                    checked={schedule.open}
                    onCheckedChange={(checked) => onChange(key, { open: checked })}
                    disabled={disabled}
                    aria-label={`${label} ${t("open")}`}
                  />
                  <label
                    htmlFor={`switch-${key}`}
                    className={cn(
                      "text-sm font-medium cursor-pointer select-none",
                      schedule.open ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </label>
                </div>

                {/* Time selects */}
                {schedule.open ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Select
                      value={schedule.openTime}
                      onValueChange={(v) => onChange(key, { openTime: v })}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-9 w-32 text-sm">
                        <SelectValue placeholder={t("openTime")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {TIME_OPTIONS.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="typography-small text-muted-foreground">{t("to")}</span>

                    <Select
                      value={schedule.closeTime}
                      onValueChange={(v) => onChange(key, { closeTime: v })}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-9 w-32 text-sm">
                        <SelectValue placeholder={t("closeTime")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {TIME_OPTIONS.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <span className="typography-small text-muted-foreground italic">
                    {t("closed")}
                  </span>
                )}
              </div>

              {/* Divider — skip after last row */}
              {i < DAY_KEYS.length - 1 && (
                <div className="mt-3 h-px bg-border/40" />
              )}
            </div>
          );
        })}
      </div>
    </SettingsSectionCard>
  );
}
