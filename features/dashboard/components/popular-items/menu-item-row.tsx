import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface MenuItemRowData {
  name: string;
  category: string;
  price: string;
  orders: string;
  trend: string;
  trendUp: boolean;
  imageSrc?: string;
}

interface MenuItemRowProps {
  item: MenuItemRowData;
}

export function MenuItemRow({ item }: MenuItemRowProps) {
  const TrendIcon = item.trendUp ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors",
        "hover:bg-muted/40",
      )}
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
        {item.imageSrc && (
          <Image
            width={64}
            height={64}
            src={item.imageSrc}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Name + Category / Price */}
      <div className="flex-1 min-w-0">
        <p className="typography-small font-bold text-foreground truncate">
          {item.name}
        </p>
        <p className="typography-caption text-muted-foreground mt-0.5">
          {item.category} · {item.price}
        </p>
      </div>

      {/* Orders + Trend */}
      <div className="text-right shrink-0">
        <p className="text-[14px] leading-[1.5] font-bold text-primary">
          {item.orders}
        </p>
        <div
          className="flex items-center justify-end gap-0.5 mt-0.5"
          style={{
            color: item.trendUp
              ? "oklch(0.508 0.118 165.612)" /* emerald-700 */
              : "oklch(0.577 0.245 27.325)" /* red-600 */,
          }}
        >
          <TrendIcon size={12} />
          <span className="typography-caption">{item.trend}</span>
        </div>
      </div>
    </div>
  );
}
