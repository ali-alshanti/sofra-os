"use client";

import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DateRangePreset = "Today" | "Last 7d" | "Last 30d";

export interface DateRangePickerProps {
  /** Currently active preset. Pass null when "Custom" is active. */
  activePreset:    DateRangePreset | null;
  onPresetChange:  (preset: DateRangePreset) => void;
  /** Called when the user clicks the Custom button */
  onCustomClick:   () => void;
  /** Optional label shown inside the Custom button — e.g. "Jun 1 → Jun 28" */
  customLabel?:    string;
  className?:      string;
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: DateRangePreset[] = ["Today", "Last 7d", "Last 30d"];

// ─── Component ────────────────────────────────────────────────────────────────

export function DateRangePicker({
  activePreset,
  onPresetChange,
  onCustomClick,
  customLabel,
  className,
}: DateRangePickerProps) {
  const t = useTranslations("common.dateRange");

  const presetLabel: Record<DateRangePreset, string> = {
    "Today":    t("today"),
    "Last 7d":  t("last7d"),
    "Last 30d": t("last30d"),
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-lg p-1 bg-card border border-border shadow-card",
        className,
      )}
    >
      {PRESETS.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => onPresetChange(preset)}
          className={cn(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
            activePreset === preset
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          {presetLabel[preset]}
        </button>
      ))}

      <div className="w-px h-4 bg-border mx-2" />

      <button
        type="button"
        onClick={onCustomClick}
        className={cn(
          "px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
          activePreset === null
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted",
        )}
      >
        <CalendarDays size={16} />
        {customLabel ?? t("custom")}
      </button>
    </div>
  );
}
