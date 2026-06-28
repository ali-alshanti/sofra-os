import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/format-date";
import { ReservationCard } from "@/features/tables/components/reservation-card";
import type { Reservation } from "@/features/tables/components/reservation-card";

// ─── Placeholder data ─────────────────────────────────────────────────────────

export const PLACEHOLDER_RESERVATIONS: Reservation[] = [
  { id: "r1", customerName: "Elena Vance",   reservationTime: "19:00", guests: 4, tableNumber: "T4", status: "upcoming" },
  { id: "r2", customerName: "Arthur Morgan", reservationTime: "19:15", guests: 2, tableNumber: "T12", status: "upcoming" },
  { id: "r3", customerName: "Sarah Chen",    reservationTime: "19:30", guests: 6, tableNumber: "T3", status: "upcoming" },
  { id: "r4", customerName: "Liam Wilson",   reservationTime: "20:00", guests: 2, tableNumber: "B4", status: "upcoming", dimmed: true },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ReservationPanelProps {
  reservations?: Reservation[];
  onBookTable?: () => void;
  onReservationClick?: (id: string) => void;
  onMoreActions?: (id: string) => void;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ReservationPanel({
  reservations = PLACEHOLDER_RESERVATIONS,
  onBookTable,
  onReservationClick,
  onMoreActions,
  className,
}: ReservationPanelProps) {
  const today = formatDate(new Date());

  return (
    <aside
      className={cn(
        "flex w-full flex-col border-border bg-card",
        "md:w-80 md:border-l",
        className,
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border p-6">
        <h3 className="text-[24px] font-medium leading-[1.4] text-foreground tracking-tight">
          Upcoming
        </h3>
        <p className="typography-small text-muted-foreground mt-1">{today}</p>
      </div>

      {/* Scrollable reservation list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {reservations.length === 0 ? (
          <p className="typography-small text-muted-foreground text-center py-8">
            No reservations for today.
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

      {/* Sticky footer — Book a Table */}
      <div className="shrink-0 border-t border-border bg-card p-4">
        <Button
          variant="outline"
          className="w-full gap-2 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 py-3 h-auto"
          onClick={onBookTable}
        >
          <CalendarDays size={18} />
          Book a Table
        </Button>
      </div>
    </aside>
  );
}
