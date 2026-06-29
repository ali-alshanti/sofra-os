"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ReactQueryProvider } from "@/lib/providers/react-query-provider";
import { ToastProvider } from "@/lib/providers/toast-provider";

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
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
