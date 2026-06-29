"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppShell }   from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button }     from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FloorPlan }        from "./components/floor-plan";
import { ReservationPanel } from "./components/reservation-panel";
import { StatusLegend }     from "./components/status-legend";
import { useTables, useReservations, useCancelReservation } from "@/lib/hooks/use-tables";

export function TablesFeature() {
  const t  = useTranslations("tables");
  const ta = useTranslations("common.actions");

  const [selectedTableId, setSelectedTableId]         = useState<string | undefined>();
  const [pendingCancelId, setPendingCancelId]          = useState<string | null>(null);

  const { data: tablesData, isLoading: tablesLoading } = useTables();
  const { data: reservations = [] }                    = useReservations();
  const cancelReservation                              = useCancelReservation();

  return (
    <AppShell>
      <div className="flex h-full -m-6 overflow-hidden">

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="shrink-0 px-6 pt-5 pb-4">
            <PageHeader
              title={t("title")}
              description={t("description")}
              actions={
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  {ta("create")}
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

        <ReservationPanel
          reservations={reservations}
          onMoreActions={(id) => setPendingCancelId(id)}
          className="hidden md:flex shrink-0"
        />

        <ConfirmDialog
          open={!!pendingCancelId}
          onOpenChange={(open) => { if (!open) setPendingCancelId(null); }}
          title={t("confirm.cancelTitle")}
          description={t("confirm.cancelDescription")}
          confirmLabel={t("confirm.cancelConfirm")}
          loading={cancelReservation.isPending}
          onConfirm={() => {
            if (!pendingCancelId) return;
            cancelReservation.mutate(pendingCancelId, {
              onSettled: () => setPendingCancelId(null),
            });
          }}
        />
      </div>
    </AppShell>
  );
}
