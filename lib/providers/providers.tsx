"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/providers/theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Future providers go here, wrapping children further inward */}
      {children}
    </ThemeProvider>
  );
}
