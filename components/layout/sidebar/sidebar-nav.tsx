"use client";

import { usePathname } from "next/navigation";
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
  // Exact match for root-level routes prevents false positives.
  // e.g., /orders should NOT match /orders-history if it existed.
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
