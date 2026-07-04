"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

// next-themes injects an inert anti-flash-of-unstyled-content <script> as part
// of its React tree. React 19 logs a console error for any script tag
// encountered outside of true SSR parsing, but this script is intentionally
// inert on the client, so the warning is a known false positive
// (see next-themes#263). No release fixes this yet as of next-themes 0.4.6.
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError(...args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
  );
}
