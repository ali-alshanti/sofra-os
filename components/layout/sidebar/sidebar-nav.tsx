import type { LucideIcon } from "lucide-react";
import { SidebarNavItem } from "@/components/layout/sidebar/sidebar-nav-item";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
}

interface SidebarNavProps {
  items: NavItem[];
  activeHref?: string;
}

export function SidebarNav({ items, activeHref }: SidebarNavProps) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {items.map((item) => (
        <SidebarNavItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          active={activeHref === item.href}
          disabled={item.disabled}
        />
      ))}
    </nav>
  );
}
