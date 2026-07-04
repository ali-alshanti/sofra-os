"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/format-date";
import { ReservationCard } from "@/features/tables/components/reservation-card";
import type { Reservation } from "@/features/tables/components/reservation-card";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ReservationPanelProps {
  reservations?:       Reservation[];
  loading?:            boolean;
  onBookTable?:        () => void;
  onReservationClick?: (id: string) => void;
  onMoreActions?:      (id: string) => void;
  className?:          string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ReservationPanel({
  reservations = [],
  loading = false,
  onBookTable,
  onReservationClick,
  onMoreActions,
  className,
}: ReservationPanelProps) {
  const t = useTranslations("tables.panel");

  // Deferred to client to avoid SSR/client date mismatch hydration errors
  const [today, setToday] = useState<string>("");
  useEffect(() => { setToday(formatDate(new Date())); }, []);

  return (
    <aside
      className={cn(
        "flex w-full flex-col border-border bg-card",
        "md:w-[320px] md:border-s",
        className,
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border p-6">
        <h3 className="text-[24px] font-medium leading-[1.4] text-foreground tracking-tight">
          {t("upcoming")}
        </h3>
        <p className="typography-small text-muted-foreground mt-1">{today}</p>
      </div>

      {/* Scrollable reservation list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : reservations.length === 0 ? (
          <p className="typography-small text-muted-foreground text-center py-8">
            {t("noReservations")}
          </p>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              onClick={onReservationClick ? () => onReservationClick(reservation.id) : undefined}
            >
              <ReservationCard
                reservation={reservation}
                onMoreActions={onMoreActions}
              />
            </div>
          ))
        )}
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 border-t border-border bg-card p-4">
        <Button
          variant="outline"
          className="w-full gap-2 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 py-3 h-auto"
          onClick={onBookTable}
        >
          <CalendarDays size={18} />
          {t("bookTable")}
        </Button>
      </div>
    </aside>
  );
}
