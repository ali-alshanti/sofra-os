import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TableCardProps, TableStatus } from "./table-card.types";

// ─── Status configuration ──────────────────────────────────────────────────────
// Colors mapped from Stitch design tokens to OKLCH equivalents

const STATUS_CONFIG: Record<
  TableStatus,
  {
    bg: string;
    text: string;
    border?: string;
    badge: string;
    badgeText: string;
    label: string;
  }
> = {
  available: {
    bg: "#d5e3fc",                         /* secondary-container */
    text: "#57657a",                       /* on-secondary-container */
    border: "1px solid oklch(0.929 0.013 255.508 / 0.3)",
    badge: "rgba(247,249,251,0.5)",        /* surface/50 */
    badgeText: "#57657a",
    label: "Available",
  },
  occupied: {
    bg: "#2b6954",                         /* surface-tint / primary emerald */
    text: "#ffffff",                       /* on-primary */
    badge: "rgba(255,255,255,0.2)",
    badgeText: "#ffffff",
    label: "Occupied",
  },
  reserved: {
    bg: "#ffb95f",                         /* tertiary-fixed-dim / amber */
    text: "#2a1700",                       /* on-tertiary-fixed */
    badge: "rgba(255,255,255,0.3)",
    badgeText: "#2a1700",
    label: "Reserved",
  },
  cleaning: {
    bg: "oklch(0.968 0.007 247.896)",      /* slate-100 */
    text: "oklch(0.554 0.046 257.417)",    /* slate-500 */
    border: "1px solid oklch(0.929 0.013 255.508 / 0.4)",
    badge: "oklch(0.929 0.013 255.508)",
    badgeText: "oklch(0.554 0.046 257.417)",
    label: "Cleaning",
  },
  out_of_service: {
    bg: "oklch(0.577 0.245 27.325 / 0.12)", /* red-600/12 */
    text: "oklch(0.577 0.245 27.325)",       /* red-600 */
    border: "1px solid oklch(0.577 0.245 27.325 / 0.3)",
    badge: "oklch(0.577 0.245 27.325 / 0.15)",
    badgeText: "oklch(0.577 0.245 27.325)",
    label: "Out of Service",
  },
};

// ─── Round Table ───────────────────────────────────────────────────────────────

function RoundTable({
  table,
  config,
  onClick,
  className,
}: Omit<TableCardProps, "table"> & {
  table: TableCardProps["table"];
  config: (typeof STATUS_CONFIG)[TableStatus];
}) {
  return (
    <button
      type="button"
      onClick={onClick ? () => onClick(table.id) : undefined}
      aria-label={`Table ${table.number} — ${config.label}`}
      className={cn(
        "table-obj flex flex-col items-center justify-center",
        "w-24 h-24 rounded-full cursor-pointer",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
      style={{
        background: config.bg,
        color: config.text,
        border: config.border,
      }}
    >
      <span className="text-[24px] font-semibold leading-none">{table.number}</span>
      <span className="text-[11px] mt-1 opacity-80">{table.capacity}p</span>
    </button>
  );
}

// ─── Square Table ──────────────────────────────────────────────────────────────

function SquareTable({
  table,
  config,
  onClick,
  className,
}: Omit<TableCardProps, "table"> & {
  table: TableCardProps["table"];
  config: (typeof STATUS_CONFIG)[TableStatus];
}) {
  const hasDetail = table.occupancy || table.reservation;

  return (
    <button
      type="button"
      onClick={onClick ? () => onClick(table.id) : undefined}
      aria-label={`Table ${table.number} — ${config.label}`}
      className={cn(
        "table-obj relative w-full rounded-2xl p-5 text-left",
        "flex flex-col justify-between overflow-hidden",
        "min-h-32 cursor-pointer",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
      style={{
        background: config.bg,
        color: config.text,
        border: config.border,
      }}
    >
      {/* Top row — number + capacity badge */}
      <div className="flex justify-between items-start">
        <span className="text-[24px] font-medium leading-none">{table.number}</span>
        <span
          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
          style={{ background: config.badge, color: config.badgeText }}
        >
          {table.capacity} Seats
        </span>
      </div>

      {/* Bottom — status detail */}
      {hasDetail ? (
        <div className="mt-3">
          {table.occupancy && (
            <>
              <p className="text-[13px] opacity-80">
                {config.label} · {table.occupancy.duration}
              </p>
              <p className="text-[16px] font-semibold mt-0.5">
                {table.occupancy.guestName}
              </p>
            </>
          )}
          {table.reservation && !table.occupancy && (
            <>
              <p className="text-[13px] opacity-80">
                Reserved for {table.reservation.time}
              </p>
              <p className="text-[16px] font-semibold mt-0.5">
                {table.reservation.guestName}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-1.5">
          <Users size={14} className="opacity-70" />
          <p className="text-[13px] opacity-80">{config.label}</p>
        </div>
      )}
    </button>
  );
}

// ─── TableCard ────────────────────────────────────────────────────────────────

export function TableCard({ table, onClick, className }: TableCardProps) {
  const config = STATUS_CONFIG[table.status];

  if (table.shape === "round") {
    return (
      <RoundTable
        table={table}
        config={config}
        onClick={onClick}
        className={className}
      />
    );
  }

  return (
    <SquareTable
      table={table}
      config={config}
      onClick={onClick}
      className={className}
    />
  );
}
