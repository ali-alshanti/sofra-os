"use client";

import { RefreshCw, Download, CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DateRangePicker, type DateRangePreset } from "@/components/shared/date-range-picker";
import type { DateRange } from "@/lib/utils/date";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportHeaderProps {
  activePreset:        DateRangePreset | null;
  onPresetChange:      (preset: DateRangePreset) => void;
  customRange?:        DateRange | null;
  onCustomRangeChange: (range: DateRange) => void;
  onExport?:           () => void;
  onRefresh?:          () => void;
  onSchedule?:         () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportHeader({
  activePreset,
  onPresetChange,
  customRange,
  onCustomRangeChange,
  onExport,
  onRefresh,
  onSchedule,
}: ReportHeaderProps) {
  const t  = useTranslations("reports");
  const ta = useTranslations("common.actions");

  return (
    <PageHeader
      title={t("title")}
      description={t("description")}
      actions={
        <div className="flex items-center gap-3 flex-wrap">
          <DateRangePicker
            activePreset={activePreset}
            onPresetChange={onPresetChange}
            customRange={customRange}
            onCustomRangeChange={onCustomRangeChange}
          />

          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw size={15} />
            {ta("refresh")}
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={onSchedule}>
            <CalendarClock size={15} />
            {t("header.schedule")}
          </Button>

          <Button size="sm" className="gap-2" onClick={onExport}>
            <Download size={15} />
            {ta("export")}
          </Button>
        </div>
      }
    />
  );
}
