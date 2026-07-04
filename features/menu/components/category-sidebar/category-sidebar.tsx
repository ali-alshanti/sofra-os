import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryItem, type CategoryItemData } from "./category-item";

interface CategorySidebarProps {
  categories: CategoryItemData[];
  selectedId: string;
  onCategoryChange: (id: string) => void;
  onNewCategory?: () => void;
  onDeleteCategory?: (id: string) => void;
  className?: string;
}

export function CategorySidebar({
  categories,
  selectedId,
  onCategoryChange,
  onNewCategory,
  onDeleteCategory,
  className,
}: CategorySidebarProps) {
  return (
    <aside
      className={cn(
        "bg-card rounded-2xl p-6 border border-border/30 shadow-sm",
        className,
      )}
    >
      <p className="typography-caption uppercase tracking-widest text-muted-foreground mb-6 px-2">
        Categories
      </p>

      <ul className="space-y-1">
        {categories.map((cat) => (
          <li key={cat.id}>
            <CategoryItem
              {...cat}
              active={cat.id === selectedId}
              onClick={() => onCategoryChange(cat.id)}
              onDelete={onDeleteCategory ? () => onDeleteCategory(cat.id) : undefined}
            />
          </li>
        ))}
      </ul>

      {/* New Category trigger */}
      <button
        type="button"
        onClick={onNewCategory}
        className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
      >
        <Plus size={18} />
        <span className="typography-small font-medium">New Category</span>
      </button>
    </aside>
  );
}
