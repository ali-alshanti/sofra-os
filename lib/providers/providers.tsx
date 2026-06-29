"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ReactQueryProvider } from "@/lib/providers/react-query-provider";
import { Toaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
