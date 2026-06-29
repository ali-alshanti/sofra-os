"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEMES = [
  { value: "light",  icon: Sun,     label: "Light mode"   },
  { value: "dark",   icon: Moon,    label: "Dark mode"    },
  { value: "system", icon: Monitor, label: "System theme" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Defer to client to avoid SSR/client mismatch — server never knows the
  // persisted theme, so we render nothing until after first mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function cycleTheme() {
    const index = THEMES.findIndex((t) => t.value === theme);
    const next  = THEMES[(index + 1) % THEMES.length];
    setTheme(next.value);
  }

  if (!mounted) {
    // Render a placeholder with the same dimensions to avoid layout shift
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-hidden>
        <Monitor className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[2];
  const Icon    = current.icon;

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
