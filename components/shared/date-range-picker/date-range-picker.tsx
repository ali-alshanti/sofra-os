"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "@/lib/utils/date";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DateRangePreset = "Today" | "Last 7d" | "Last 30d";

export interface DateRangePickerProps {
  /** Currently active preset. Pass null when "Custom" is active. */
  activePreset:       DateRangePreset | null;
  onPresetChange:     (preset: DateRangePreset) => void;
  /** Currently selected custom range, if any — shown as the button label. */
  customRange?:       DateRange | null;
  /** Called with the picked range once the user applies it in the calendar popover. */
  onCustomRangeChange: (range: DateRange) => void;
  className?:         string;
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: DateRangePreset[] = ["Today", "Last 7d", "Last 30d"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toInputDate(iso: string): string {
  return iso.slice(0, 10);
}

function formatShort(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DateRangePicker({
  activePreset,
  onPresetChange,
  customRange,
  onCustomRangeChange,
  className,
}: DateRangePickerProps) {
  const t = useTranslations("common.dateRange");
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(customRange ? toInputDate(customRange.from) : "");
  const [draftTo, setDraftTo] = useState(customRange ? toInputDate(customRange.to) : "");

  const presetLabel: Record<DateRangePreset, string> = {
    "Today":    t("today"),
    "Last 7d":  t("last7d"),
    "Last 30d": t("last30d"),
  };

  const customButtonLabel =
    activePreset === null && customRange
      ? `${formatShort(customRange.from)} → ${formatShort(customRange.to)}`
      : t("custom");

  function handleOpenChange(next: boolean) {
    if (next) {
      setDraftFrom(customRange ? toInputDate(customRange.from) : toInputDate(new Date().toISOString()));
      setDraftTo(customRange ? toInputDate(customRange.to) : toInputDate(new Date().toISOString()));
    }
    setOpen(next);
  }

  function handleApply() {
    if (!draftFrom || !draftTo) return;
    const from = new Date(`${draftFrom}T00:00:00.000Z`).toISOString();
    const to   = new Date(`${draftTo}T23:59:59.999Z`).toISOString();
    onCustomRangeChange({ from, to });
    setOpen(false);
  }

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

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
              activePreset === null
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <CalendarDays size={16} />
            {customButtonLabel}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="date-range-from">{t("from")}</Label>
            <input
              id="date-range-from"
              type="date"
              value={draftFrom}
              max={draftTo || undefined}
              onChange={(e) => setDraftFrom(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date-range-to">{t("to")}</Label>
            <input
              id="date-range-to"
              type="date"
              value={draftTo}
              min={draftFrom || undefined}
              onChange={(e) => setDraftTo(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="w-full"
            disabled={!draftFrom || !draftTo}
            onClick={handleApply}
          >
            {t("apply")}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
