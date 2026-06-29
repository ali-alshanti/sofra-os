"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_VALUES = ["light", "dark", "system"] as const;
type ThemeValue = (typeof THEME_VALUES)[number];

const THEME_ICONS: Record<ThemeValue, typeof Sun> = {
  light:  Sun,
  dark:   Moon,
  system: Monitor,
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common.theme");

  // Defer to client to avoid SSR/client mismatch — server never knows the
  // persisted theme, so we render nothing until after first mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function cycleTheme() {
    const index = THEME_VALUES.findIndex((v) => v === theme);
    const next  = THEME_VALUES[(index + 1) % THEME_VALUES.length];
    setTheme(next);
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-hidden>
        <Monitor className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  const current = (theme as ThemeValue) ?? "system";
  const Icon    = THEME_ICONS[current] ?? Monitor;
  const label   = t(current);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={cycleTheme}
      aria-label={label}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}
