"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell }   from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button }     from "@/components/ui/button";
import { FloorPlan }         from "./components/floor-plan";
import { ReservationPanel }  from "./components/reservation-panel";
import { StatusLegend }      from "./components/status-legend";
import { useTables, useReservations } from "@/lib/hooks/use-tables";

export function TablesFeature() {
  const [selectedTableId, setSelectedTableId] = useState<string | undefined>();

  const { data: tablesData, isLoading: tablesLoading } = useTables();
  const { data: reservations = [], isLoading: reservationsLoading } = useReservations();

  return (
    <AppShell>
      <div className="flex h-full -m-6 overflow-hidden">

        {/* ── Left: Floor Area ─────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          <div className="shrink-0 px-6 pt-5 pb-4">
            <PageHeader
              title="Floor Plan & Reservations"
              description="Manage table layout and track guest seating."
              actions={
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  New Reservation
                </Button>
              }
            />
            <StatusLegend className="mt-3" />
          </div>

          <FloorPlan
            tables={tablesLoading ? undefined : tablesData?.squareTables}
            barSeats={tablesLoading ? undefined : tablesData?.barSeats}
            selectedTableId={selectedTableId}
            onTableSelect={setSelectedTableId}
            className="flex-1"
          />
        </div>

        {/* ── Right: Reservation Panel ──────────────────────────────────────── */}
        <ReservationPanel
          reservations={reservations}
          className="hidden md:flex shrink-0"
        />

      </div>
    </AppShell>
  );
}
