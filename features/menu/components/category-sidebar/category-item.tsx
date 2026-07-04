import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryItemData {
  id: string;
  name: string;
  count: number;
}

interface CategoryItemProps extends CategoryItemData {
  active: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export function CategoryItem({
  name,
  count,
  active,
  onClick,
  onDelete,
}: CategoryItemProps) {
  return (
    <div
      className={cn(
        "group/cat w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex-1 text-start"
      >
        <span className={cn("font-medium text-sm", active && "font-bold")}>
          {name}
        </span>
      </button>

      <span className="relative grid size-5 shrink-0 place-items-center">
        <span
          className={cn(
            "absolute inset-0 grid place-items-center rounded text-[11px] font-bold transition-opacity",
            active
              ? "bg-white/20 text-primary-foreground"
              : "bg-muted text-muted-foreground",
            onDelete && "group-hover/cat:opacity-0",
          )}
        >
          {String(count).padStart(2, "0")}
        </span>

        {onDelete && (
          <button
            type="button"
            aria-label={`Delete ${name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={cn(
              "absolute inset-0 grid place-items-center opacity-0 group-hover/cat:opacity-100 transition-opacity rounded",
              active
                ? "text-primary-foreground hover:bg-white/20"
                : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            )}
          >
            <X size={14} />
          </button>
        )}
      </span>
    </div>
  );
}
