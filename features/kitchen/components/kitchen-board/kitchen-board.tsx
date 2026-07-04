"use client";

import { useTranslations } from "next-intl";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { KitchenColumn } from "@/features/kitchen/components/kitchen-column";
import type { KitchenOrder, TicketStatus } from "@/features/kitchen/components/kitchen-ticket";

// ─── Column definition (no hardcoded titles — derived from translations) ──────

const COLUMN_STATUSES: TicketStatus[] = ["pending", "preparing", "ready", "completed"];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ColumnData {
  status: TicketStatus;
  orders: KitchenOrder[];
}

interface KitchenBoardProps {
  columns?: ColumnData[];
  loading?: boolean;
  onAction?: (id: string, status: TicketStatus) => void;
  onMove?: (id: string, from: TicketStatus, to: TicketStatus) => void;
  className?: string;
}

// ─── KitchenBoard ─────────────────────────────────────────────────────────────

export function KitchenBoard({
  columns = [],
  loading = false,
  onAction,
  onMove,
  className,
}: KitchenBoardProps) {
  const t = useTranslations("kitchen.columns");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const COLUMN_TITLES: Record<TicketStatus, string> = {
    pending:   t("pending"),
    preparing: t("preparing"),
    ready:     t("ready"),
    completed: t("completed"),
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const from = active.data.current?.status as TicketStatus | undefined;
    const to = over.id as TicketStatus;

    if (!from || from === to) return;
    onMove?.(String(active.id), from, to);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4",
          className,
        )}
      >
        {COLUMN_STATUSES.map((status) => {
          const col = columns.find((c) => c.status === status);
          return (
            <KitchenColumn
              key={status}
              title={COLUMN_TITLES[status]}
              status={status}
              orders={col?.orders ?? []}
              loading={loading}
              onAction={onAction}
            />
          );
        })}
      </div>
    </DndContext>
  );
}
