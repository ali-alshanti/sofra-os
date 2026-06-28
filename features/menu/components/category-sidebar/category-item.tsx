import { cn } from "@/lib/utils";

export interface CategoryItemData {
  id: string;
  name: string;
  count: number;
}

interface CategoryItemProps extends CategoryItemData {
  active: boolean;
  onClick: () => void;
}

export function CategoryItem({
  name,
  count,
  active,
  onClick,
}: CategoryItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      <span className={cn("font-medium text-sm", active && "font-bold")}>
        {name}
      </span>
      <span
        className={cn(
          "px-2 py-0.5 rounded text-[11px] font-bold",
          active
            ? "bg-white/20 text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}
