"use client";

import { Pencil, Copy, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { MenuCardProps } from "./menu-card.types";
import Image from "next/image";
// ─── Action Overlay ────────────────────────────────────────────────────────────

interface ActionOverlayProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

function ActionOverlay({ onEdit, onDuplicate, onDelete }: ActionOverlayProps) {
  return (
    <div
      className="action-overlay absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300"
      style={{
        background: "oklch(0.262 0.051 172.552 / 0.20)",
        backdropFilter: "blur(4px)",
      }}
    >
      <button
        aria-label="Edit item"
        onClick={onEdit}
        className="p-2 rounded-full bg-white text-primary hover:bg-primary/10 transition-colors"
      >
        <Pencil size={18} />
      </button>
      <button
        aria-label="Duplicate item"
        onClick={onDuplicate}
        className="p-2 rounded-full bg-white text-primary hover:bg-primary/10 transition-colors"
      >
        <Copy size={18} />
      </button>
      <button
        aria-label="Delete item"
        onClick={onDelete}
        className="p-2 rounded-full bg-white text-destructive hover:bg-destructive/10 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

// ─── MenuCard ─────────────────────────────────────────────────────────────────

export function MenuCard({
  item,
  onAvailabilityChange,
  onEdit,
  onDuplicate,
  onDelete,
  className,
}: MenuCardProps) {
  const unavailable = !item.available;

  return (
    <div
      className={cn(
        "product-card group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300",
        "bg-card hover:shadow-xl hover:-translate-y-1",
        "border-border/30",
        className,
      )}
    >
      {/* ── Image section ────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative h-48 overflow-hidden",
          unavailable && "opacity-60 grayscale-[40%]",
        )}
      >
        {item.imageSrc ? (
          <Image
            width={256}
            height={192}
            src={item.imageSrc}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="typography-caption text-muted-foreground">
              No image
            </span>
          </div>
        )}

        {/* Action overlay */}
        <ActionOverlay
          onEdit={onEdit ? () => onEdit(item.id) : undefined}
          onDuplicate={onDuplicate ? () => onDuplicate(item.id) : undefined}
          onDelete={onDelete ? () => onDelete(item.id) : undefined}
        />

        {/* Best Seller / custom badge */}
        {item.badge && item.available && (
          <div className="absolute top-3 start-3 z-10">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
              style={{ background: "#442800", color: "#ffffff" }}
            >
              {item.badge}
            </span>
          </div>
        )}

        {/* Sold Out overlay */}
        {unavailable && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span
              className="font-bold text-xs px-3 py-1 rounded-full uppercase tracking-tight text-white"
              style={{
                background: "oklch(0.577 0.245 27.325 / 0.85)",
                backdropFilter: "blur(4px)",
              }}
            >
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Content section ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name + Price */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h4
            className={cn(
              "font-bold text-lg leading-tight",
              unavailable ? "text-foreground/60" : "text-foreground",
            )}
          >
            {item.name}
          </h4>
          <span
            className={cn(
              "text-[14px] font-bold shrink-0 text-primary",
              unavailable ? "opacity-60" : "",
            )}
          >
            {formatCurrency(item.price)}
          </span>
        </div>

        {/* Description — fixed 2 lines to keep cards aligned */}
        <p
          className={cn(
            "text-sm line-clamp-2 mb-4",
            unavailable ? "text-muted-foreground/60" : "text-muted-foreground",
          )}
          style={{ minHeight: "2.5rem" }}
        >
          {item.description}
        </p>

        {/* Availability toggle — pushed to bottom via mt-auto */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/20">
          <span className="typography-caption text-muted-foreground">
            Availability
          </span>
          <Switch
            checked={item.available}
            onCheckedChange={(checked) =>
              onAvailabilityChange?.(item.id, checked)
            }
            aria-label={`Toggle availability for ${item.name}`}
          />
        </div>
      </div>
    </div>
  );
}
