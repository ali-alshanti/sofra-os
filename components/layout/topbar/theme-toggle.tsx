"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEMES = [
  { value: "light",  icon: Sun,     label: "Light mode"  },
  { value: "dark",   icon: Moon,    label: "Dark mode"   },
  { value: "system", icon: Monitor, label: "System theme" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycleTheme() {
    const index = THEMES.findIndex((t) => t.value === theme);
    const next = THEMES[(index + 1) % THEMES.length];
    setTheme(next.value);
  }

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[2];
  const Icon = current.icon;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={cycleTheme}
      aria-label={current.label}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}
