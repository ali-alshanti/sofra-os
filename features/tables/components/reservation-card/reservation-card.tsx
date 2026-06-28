import { MoreVertical, Users, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReservationCardProps } from "./reservation-card.types";

export function ReservationCard({
  reservation,
  onMoreActions,
  className,
}: ReservationCardProps) {
  return (
    <div
      className={cn(
        "group p-4 bg-card rounded-xl border border-border/20 cursor-pointer",
        "hover:border-primary/30 transition-colors",
        reservation.dimmed && "opacity-70",
        className,
      )}
    >
      {/* Top row — time badge + more actions */}
      <div className="flex justify-between items-start mb-2">
        {/* Time badge — amber from Stitch tertiary-fixed */}
        <span
          className="text-[10px] font-medium px-2 py-1 rounded-md"
          style={{ background: "#ffddb8", color: "#2a1700" }}
        >
          {reservation.reservationTime}
        </span>

        <button
          type="button"
          aria-label="More actions"
          onClick={onMoreActions ? (e) => { e.stopPropagation(); onMoreActions(reservation.id); } : undefined}
          className="text-muted-foreground transition-colors group-hover:text-primary p-0.5 rounded"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Customer name */}
      <p className="text-[16px] font-bold text-foreground leading-snug">
        {reservation.customerName}
      </p>

      {/* Meta row — guests + table */}
      <div className="flex items-center gap-4 mt-2 text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users size={15} />
          <span className="text-[13px]">{reservation.guests}</span>
        </div>
        <div className="flex items-center gap-1">
          <Grid3x3 size={15} />
          <span className="text-[13px]">{reservation.tableNumber}</span>
        </div>
      </div>
    </div>
  );
}
