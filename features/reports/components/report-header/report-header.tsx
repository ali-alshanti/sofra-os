"use client";

import { useState } from "react";
import { RefreshCw, Download, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DateRangePicker, type DateRangePreset } from "@/components/shared/date-range-picker";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportHeaderProps {
  onExport?:   () => void;
  onRefresh?:  () => void;
  onSchedule?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportHeader({ onExport, onRefresh, onSchedule }: ReportHeaderProps) {
  const [activePreset, setActivePreset] = useState<DateRangePreset | null>("Last 30d");

  return (
    <PageHeader
      title="Reports & Analytics"
      description="Generate, review, and export detailed performance reports."
      actions={
        <div className="flex items-center gap-3 flex-wrap">
          <DateRangePicker
            activePreset={activePreset}
            onPresetChange={setActivePreset}
            onCustomClick={() => setActivePreset(null)}
          />

          <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
            <RefreshCw size={15} />
            Refresh
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={onSchedule}>
            <CalendarClock size={15} />
            Schedule Report
          </Button>

          <Button size="sm" className="gap-2" onClick={onExport}>
            <Download size={15} />
            Export Report
          </Button>
        </div>
      }
    />
  );
}
