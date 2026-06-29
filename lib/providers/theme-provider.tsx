"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      // Suppress the React 19 warning about the inline <script> next-themes
      // injects to prevent flash-of-unstyled-content before hydration.
      // The script runs server-side only and is intentionally inert on the client.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scriptProps={{ suppressHydrationWarning: true } as any}
    >
      {children}
    </NextThemesProvider>
  );
}
