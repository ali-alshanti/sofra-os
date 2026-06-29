"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { KitchenTicket } from "@/features/kitchen/components/kitchen-ticket";
import type { KitchenOrder, TicketStatus } from "@/features/kitchen/components/kitchen-ticket";

// ─── Column header visual config per status ───────────────────────────────────

const COLUMN_CONFIG: Record<
  TicketStatus,
  { borderColor: string; badgeBg: string; badgeColor: string }
> = {
  pending:   { borderColor: "#d5e3fc", badgeBg: "#d5e3fc",                             badgeColor: "#57657a"                           },
  preparing: { borderColor: "#ffb95f", badgeBg: "#ffddb8",                             badgeColor: "#2a1700"                           },
  ready:     { borderColor: "#b0f0d6", badgeBg: "#b0f0d6",                             badgeColor: "#002117"                           },
  completed: { borderColor: "oklch(0.929 0.013 255.508)", badgeBg: "oklch(0.929 0.013 255.508)", badgeColor: "oklch(0.554 0.046 257.417)" },
};

// ─── Loading skeletons ────────────────────────────────────────────────────────

function TicketSkeleton() {
  return (
    <div className="bg-card border border-border/30 rounded-xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-32 rounded bg-muted/60" />
        </div>
        <div className="space-y-1.5 items-end flex flex-col">
          <div className="h-4 w-10 rounded bg-muted" />
          <div className="h-3 w-14 rounded bg-muted/60" />
        </div>
      </div>
      <div className="space-y-2 py-2 border-y border-border/10">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-4 w-32 rounded bg-muted" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-20 rounded bg-muted/60" />
        <div className="h-8 w-16 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface KitchenColumnProps {
  title:    string;
  status:   TicketStatus;
  orders:   KitchenOrder[];
  loading?: boolean;
  onAction?: (id: string, status: TicketStatus) => void;
  className?: string;
}

// ─── KitchenColumn ────────────────────────────────────────────────────────────

export function KitchenColumn({
  title,
  status,
  orders,
  loading = false,
  onAction,
  className,
}: KitchenColumnProps) {
  const t   = useTranslations("kitchen.empty");
  const cfg = COLUMN_CONFIG[status];

  return (
    <div className={cn("flex min-w-0 flex-col gap-4", className)}>

      {/* Column header — theme-aware glass effect */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl px-6 py-4 border-b-2 bg-card/95 backdrop-blur-sm"
        style={{ borderBottomColor: cfg.borderColor }}
      >
        <h4 className="flex items-center gap-2 font-bold text-foreground text-sm">
          {title}
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: cfg.badgeBg, color: cfg.badgeColor }}
          >
            {loading ? "—" : orders.length}
          </span>
        </h4>
      </div>

      {/* Ticket list — scrollable */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {loading ? (
          <>
            <TicketSkeleton />
            <TicketSkeleton />
          </>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="typography-small text-muted-foreground">
              {t(status)}
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <KitchenTicket
              key={order.id}
              order={order}
              onAction={onAction}
            />
          ))
        )}
      </div>

    </div>
  );
}
