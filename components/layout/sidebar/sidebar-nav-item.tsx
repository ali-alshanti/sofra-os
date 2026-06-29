import { Link } from "@/lib/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
}

export function SidebarNavItem({
  icon: Icon,
  label,
  href,
  active = false,
  disabled = false,
}: SidebarNavItemProps) {
  const Comp = disabled ? "span" : Link;

  return (
    <Comp
      href={disabled ? (undefined as never) : href}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : !disabled
            ? "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            : "cursor-not-allowed opacity-40 text-sidebar-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active
            ? "text-primary"
            : !disabled
              ? "text-sidebar-foreground group-hover:text-primary"
              : "text-sidebar-foreground",
        )}
      />
      {label}
    </Comp>
  );
}
