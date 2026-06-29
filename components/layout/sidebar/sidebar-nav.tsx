"use client";

import { usePathname } from "@/lib/navigation";
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
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {items.map((item) => (
        <SidebarNavItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          active={isActive(pathname, item.href)}
          disabled={item.disabled}
        />
      ))}
    </nav>
  );
}
