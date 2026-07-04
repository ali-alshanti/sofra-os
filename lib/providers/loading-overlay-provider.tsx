"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";

interface LoadingOverlayContextValue {
  show: (message?: string) => void;
  hide: () => void;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextValue | null>(null);

export function LoadingOverlayProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const value = useMemo<LoadingOverlayContextValue>(
    () => ({
      show: (msg) => setMessage(msg ?? ""),
      hide: () => setMessage(null),
    }),
    [],
  );

  return (
    <LoadingOverlayContext.Provider value={value}>
      {children}
      {message !== null && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
          <Spinner className="size-8 text-primary" />
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      )}
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  const ctx = useContext(LoadingOverlayContext);
  if (!ctx) {
    throw new Error("useLoadingOverlay must be used within a LoadingOverlayProvider");
  }
  return ctx;
}
