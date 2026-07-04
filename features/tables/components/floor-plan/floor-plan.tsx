import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCard } from "@/features/tables/components/table-card";
import type { RestaurantTable } from "@/features/tables/components/table-card";

// ─── Placeholder Tables (matching Stitch design layout) ───────────────────────

export const PLACEHOLDER_TABLES: (RestaurantTable & { colSpan?: number })[] = [
  // Row 1 — large booths
  {
    id: "t1", number: "T1", capacity: 8, status: "occupied", shape: "square", colSpan: 2,
    occupancy: { guestName: "Giacomo Rossi Party", duration: "1h 12m", partySize: 6 },
  },
  {
    id: "t2", number: "T2", capacity: 6, status: "available", shape: "square", colSpan: 2,
  },
  {
    id: "t3", number: "T3", capacity: 4, status: "reserved", shape: "square", colSpan: 2,
    reservation: { guestName: "H. Sterling", time: "19:30", partySize: 3 },
  },
  // Row 2 — standard tables (col-span: 1 each)
  { id: "t4", number: "T4", capacity: 2, status: "available", shape: "square" },
  { id: "t5", number: "T5", capacity: 4, status: "occupied",  shape: "square",
    occupancy: { guestName: "Martinez", duration: "0h 35m", partySize: 3 } },
  { id: "t6", number: "T6", capacity: 2, status: "available", shape: "square" },
  { id: "t7", number: "T7", capacity: 4, status: "reserved",  shape: "square",
    reservation: { guestName: "E. Vance", time: "19:00", partySize: 4 } },
  { id: "t8", number: "T8", capacity: 4, status: "occupied",  shape: "square",
    occupancy: { guestName: "Park Group", duration: "0h 50m", partySize: 4 } },
  { id: "t9", number: "T9", capacity: 2, status: "cleaning",  shape: "square" },
];

export const PLACEHOLDER_BAR_SEATS: RestaurantTable[] = [
  { id: "b1", number: "B1", capacity: 1, status: "available", shape: "round" },
  { id: "b2", number: "B2", capacity: 1, status: "occupied",  shape: "round",
    occupancy: { guestName: "Guest", duration: "0h 20m", partySize: 1 } },
  { id: "b3", number: "B3", capacity: 1, status: "occupied",  shape: "round",
    occupancy: { guestName: "Guest", duration: "0h 45m", partySize: 1 } },
  { id: "b4", number: "B4", capacity: 1, status: "available", shape: "round" },
  { id: "b5", number: "B5", capacity: 1, status: "available", shape: "round" },
  { id: "b6", number: "B6", capacity: 1, status: "available", shape: "round" },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

type TableWithSpan = RestaurantTable & { colSpan?: number };

interface FloorPlanProps {
  tables?: TableWithSpan[];
  barSeats?: RestaurantTable[];
  loading?: boolean;
  selectedTableId?: string;
  onTableSelect?: (id: string) => void;
  className?: string;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function FloorPlanSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-auto", className)}>
      <div className="p-8 min-w-225">
        <Skeleton className="mb-4 h-4 w-32" />
        <div className="grid grid-cols-6 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn(i < 3 ? "col-span-2 min-h-48" : "col-span-1 min-h-32", "rounded-2xl")}
            />
          ))}
        </div>
        <div className="my-8 border-b-2 border-dashed border-border" />
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="flex flex-wrap gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FloorPlan ─────────────────────────────────────────────────────────────────

export function FloorPlan({
  tables = PLACEHOLDER_TABLES,
  barSeats = PLACEHOLDER_BAR_SEATS,
  loading = false,
  selectedTableId,
  onTableSelect,
  className,
}: FloorPlanProps) {
  const t = useTranslations("tables.floorPlan");

  if (loading) return <FloorPlanSkeleton className={className} />;

  return (
    <div
      className={cn("relative overflow-auto", className)}
      style={{
        backgroundImage: "radial-gradient(oklch(0.704 0.040 256.788) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="p-8 min-w-225">

        {/* ── Main Dining Area ─────────────────────────────────────── */}
        <h3 className="text-[15px] font-semibold text-foreground/80 mb-4">
          {t("squares")}
        </h3>
        <div className="grid grid-cols-6 gap-8">
          {tables.map((table) => {
            const isLarge = table.colSpan === 2;
            return (
              <div
                key={table.id}
                className={cn(
                  isLarge ? "col-span-2 min-h-48" : "col-span-1 min-h-32",
                )}
              >
                <TableCard
                  table={table}
                  onClick={onTableSelect}
                  className={cn(
                    "h-full w-full",
                    isLarge ? "p-6 rounded-2xl" : "p-4 rounded-xl",
                    selectedTableId === table.id && "ring-2 ring-offset-2 ring-primary",
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* ── Section divider ──────────────────────────────────────── */}
        <div className="my-8 border-b-2 border-dashed border-border" />

        {/* ── Bar Seats (round) ────────────────────────────────────── */}
        <h3 className="text-[15px] font-semibold text-foreground/80 mb-4">
          {t("bar")}
        </h3>
        <div className="flex flex-wrap gap-8">
          {barSeats.map((seat) => (
            <TableCard
              key={seat.id}
              table={seat}
              onClick={onTableSelect}
              className={cn(
                selectedTableId === seat.id && "ring-2 ring-offset-2 ring-primary",
              )}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
