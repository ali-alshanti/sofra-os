import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddMenuCardProps {
  onClick?: () => void;
  className?: string;
}

export function AddMenuCard({ onClick, className }: AddMenuCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full rounded-2xl border-2 border-dashed border-border",
        "flex flex-col items-center justify-center p-8",
        "min-h-[308px] cursor-pointer transition-all",
        "hover:border-primary hover:bg-primary/5",
        className,
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-full",
          "bg-muted text-muted-foreground transition-all",
          "group-hover:bg-primary group-hover:text-primary-foreground",
        )}
      >
        <Plus size={28} />
      </div>

      {/* Title */}
      <span
        className={cn(
          "font-bold text-foreground transition-colors",
          "group-hover:text-primary",
        )}
      >
        Add New Menu Item
      </span>

      {/* Description */}
      <span className="mt-1 text-sm text-muted-foreground">
        Populate your menu list
      </span>
    </button>
  );
}
