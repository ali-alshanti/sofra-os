"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { Direction } from "radix-ui";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ReactQueryProvider } from "@/lib/providers/react-query-provider";
import { Toaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Direction.DirectionProvider dir={dir}>
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
    </Direction.DirectionProvider>
  );
}
