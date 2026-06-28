import { Utensils, CheckCircle, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  KitchenTicketProps,
  KitchenOrder,
  TicketStatus,
  TicketPriority,
  OrderItem,
} from "./kitchen-ticket.types";

// ─── Priority badge config ────────────────────────────────────────────────────

const PRIORITY_STYLE: Record<TicketPriority, { bg: string; color: string }> = {
  urgent: { bg: "oklch(0.577 0.245 27.325 / 0.1)", color: "oklch(0.577 0.245 27.325)" },
  high:   { bg: "#ffb95f66",                        color: "#653e00" },
  normal: { bg: "oklch(0.929 0.013 255.508)",       color: "oklch(0.554 0.046 257.417)" },
};

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  urgent: "Urgent",
  high:   "High",
  normal: "Normal",
};

// ─── Time color per state/priority ────────────────────────────────────────────

function timeColor(status: TicketStatus, priority: TicketPriority): string {
  if (priority === "urgent") return "oklch(0.577 0.245 27.325)";  /* error red */
  if (status === "preparing") return "#f69f0d";                   /* amber */
  return "#2b6954";                                               /* surface-tint / primary */
}

// ─── Card container styles per status ────────────────────────────────────────

function cardClassName(status: TicketStatus, priority: TicketPriority): string {
  if (status === "completed") {
    return "bg-muted/40 border border-border/30 rounded-xl p-6 flex flex-col gap-4 opacity-50 grayscale";
  }
  if (status === "ready") {
    return "bg-primary/5 border border-[#b0f0d6] rounded-xl shadow-sm p-6 flex flex-col gap-4";
  }
  if (status === "preparing") {
    const borderColor = priority === "high" ? "border-[#ffb95f]" : "border-border/30";
    return `bg-card ${borderColor} border rounded-xl shadow-sm p-6 flex flex-col gap-4`;
  }
  // pending
  if (priority === "urgent") {
    return "bg-card border-2 border-destructive ticket-pulse-urgent rounded-xl shadow-md p-6 flex flex-col gap-4";
  }
  return "bg-card border border-border/30 rounded-xl shadow-sm p-6 flex flex-col gap-4";
}

// ─── Items list ───────────────────────────────────────────────────────────────

function ItemsList({ items, status }: { items: OrderItem[]; status: TicketStatus }) {
  const isReady = status === "ready";
  const isPreparing = status === "preparing";

  return (
    <div className="space-y-2 py-2 border-y border-border/10">
      {items.map((item, i) => (
        <div key={i} className={cn("flex justify-between items-start", isReady && "opacity-60")}>
          <div className="flex items-center gap-2">
            {/* Status dot / check for preparing and ready */}
            {isPreparing && (
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: item.done ? "oklch(0.929 0.013 255.508)" : "#2b6954" }}
              />
            )}
            {isReady && <CheckCheck size={14} className="shrink-0 text-primary" />}
            <span className="font-bold text-sm text-foreground">
              {item.quantity}x {item.name}
            </span>
          </div>
          {item.modifier && (
            <span className="typography-caption text-muted-foreground">{item.modifier}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Action button per status ─────────────────────────────────────────────────

function ActionButton({
  status,
  orderId,
  onAction,
}: {
  status: TicketStatus;
  orderId: string;
  onAction?: (id: string, status: TicketStatus) => void;
}) {
  if (status === "completed") return null;

  const config = {
    pending:   { label: "Start",  className: "bg-primary text-primary-foreground hover:brightness-110" },
    preparing: { label: "Ready",  className: "bg-[#2b6954] text-white hover:brightness-110" },
    ready:     { label: "Clear",  className: "border border-primary text-primary hover:bg-primary hover:text-primary-foreground" },
  } as const;

  const c = config[status as "pending" | "preparing" | "ready"];

  return (
    <button
      type="button"
      onClick={onAction ? () => onAction(orderId, status) : undefined}
      className={cn(
        "px-4 py-2 rounded-lg text-[13px] font-bold transition-all active:scale-95",
        c.className,
      )}
    >
      {c.label}
    </button>
  );
}

// ─── KitchenTicket ────────────────────────────────────────────────────────────

export function KitchenTicket({ order, onAction, className }: KitchenTicketProps) {
  const isCompleted = order.status === "completed";
  const isReady     = order.status === "ready";

  return (
    <div className={cn(cardClassName(order.status, order.priority), className)}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start">
        <div>
          <h5 className="text-primary font-bold text-sm">{order.orderNumber}</h5>
          <p className="typography-caption text-muted-foreground mt-0.5">
            Table: {order.tableNumber} · {order.orderType === "dine-in" ? "Dine In" : order.orderType === "takeaway" ? "Takeaway" : "Delivery"}
          </p>
        </div>

        {isCompleted ? (
          <span className="typography-caption text-muted-foreground">
            {order.clearedAt ? `Cleared ${order.clearedAt}` : "Done"}
          </span>
        ) : isReady ? (
          <div className="flex flex-col items-end gap-0.5">
            <CheckCircle size={20} className="text-primary" />
            <span className="text-[10px] font-bold uppercase text-primary">Ready</span>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <span
              className="text-[13px] font-bold font-mono"
              style={{ color: timeColor(order.status, order.priority) }}
            >
              {order.elapsedTime}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                background: PRIORITY_STYLE[order.priority].bg,
                color: PRIORITY_STYLE[order.priority].color,
              }}
            >
              {PRIORITY_LABEL[order.priority]}
            </span>
          </div>
        )}
      </div>

      {/* ── Items ───────────────────────────────────────────────────── */}
      {!isCompleted && (
        <>
          <ItemsList items={order.items} status={order.status} />

          {/* Note */}
          {order.note && (
            <div
              className="px-2 py-1.5 rounded border-l-2 text-xs"
              style={{
                background: "oklch(0.362 0.072 165.670 / 0.05)",
                borderColor: "#442800",
                color: "#442800",
              }}
            >
              <span className="font-bold">NOTE: </span>{order.note}
            </div>
          )}
        </>
      )}

      {/* ── Footer ──────────────────────────────────────────────────── */}
      {!isCompleted && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            {isReady ? (
              <span className="text-xs text-muted-foreground">Ready to Serve</span>
            ) : (
              <>
                <Utensils size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {order.station} · {order.items.length} Items
                </span>
              </>
            )}
          </div>
          <ActionButton status={order.status} orderId={order.id} onAction={onAction} />
        </div>
      )}

    </div>
  );
}
