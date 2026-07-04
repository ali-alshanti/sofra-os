"use client";

import { useEffect, useState } from "react";
import { Users, Clock, CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTableStatus } from "@/lib/hooks/use-tables";
import type { RestaurantTable, TableStatus } from "@/features/tables/components/table-card";

const STATUSES: TableStatus[] = ["available", "occupied", "reserved", "cleaning", "out_of_service"];

// ─── Props ────────────────────────────────────────────────────────────────────

interface TableDetailsDialogProps {
  table:        RestaurantTable | undefined;
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TableDetailsDialog({ table, open, onOpenChange }: TableDetailsDialogProps) {
  const t  = useTranslations("tables");
  const ts = useTranslations("tables.status");
  const ta = useTranslations("common.actions");

  const [status, setStatus] = useState<TableStatus | undefined>(table?.status);
  const updateStatus = useUpdateTableStatus();

  useEffect(() => {
    setStatus(table?.status);
  }, [table?.id, table?.status]);

  if (!table) return null;

  function handleSave() {
    if (!table || !status || status === table.status) return;
    updateStatus.mutate({ tableId: table.id, status });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("table.number", { number: table.number })}</DialogTitle>
          <DialogDescription>{ts(table.status)}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            {t("table.seats", { capacity: table.capacity })}
          </div>

          {table.occupancy && (
            <div className="rounded-xl border border-border p-3 grid gap-1.5">
              <p className="text-[16px] font-semibold text-foreground">
                {table.occupancy.guestName}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                {t.rich("table.duration", {
                  duration: table.occupancy.duration,
                  iso: (chunks) => <bdi dir="ltr">{chunks}</bdi>,
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={14} />
                {t("reservation.guests", { count: table.occupancy.partySize })}
              </div>
            </div>
          )}

          {table.reservation && !table.occupancy && (
            <div className="rounded-xl border border-border p-3 grid gap-1.5">
              <p className="text-[16px] font-semibold text-foreground">
                {table.reservation.guestName}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock size={14} />
                {t.rich("table.reservedFor", {
                  time: table.reservation.time,
                  iso: (chunks) => <bdi dir="ltr">{chunks}</bdi>,
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={14} />
                {t("reservation.guests", { count: table.reservation.partySize })}
              </div>
            </div>
          )}

          <div className="grid gap-1.5 pt-1">
            <Label htmlFor="table-status-select">{t("details.changeStatusLabel")}</Label>
            <div className="flex gap-2">
              <Select value={status} onValueChange={(v) => setStatus(v as TableStatus)}>
                <SelectTrigger id="table-status-select" className="h-9 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{ts(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!status || status === table.status || updateStatus.isPending}
              >
                {t("details.saveStatus")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
