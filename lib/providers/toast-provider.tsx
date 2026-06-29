"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id:      string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast:        (message: string, variant?: ToastVariant) => void;
  toastSuccess: (message: string) => void;
  toastError:   (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    timers.current.set(id, setTimeout(() => dismiss(id), DISMISS_MS));
  }, [dismiss]);

  const toastSuccess = useCallback((msg: string) => toast(msg, "success"), [toast]);
  const toastError   = useCallback((msg: string) => toast(msg, "error"),   [toast]);

  return (
    <ToastContext.Provider value={{ toast, toastSuccess, toastError }}>
      {children}
      {/* Viewport */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Toast Item ───────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<ToastVariant, {
  icon:       React.ElementType;
  iconClass:  string;
  barClass:   string;
}> = {
  success: {
    icon:      CheckCircle,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    barClass:  "bg-emerald-500",
  },
  error: {
    icon:      AlertCircle,
    iconClass: "text-red-600 dark:text-red-400",
    barClass:  "bg-red-500",
  },
  info: {
    icon:      Info,
    iconClass: "text-blue-600 dark:text-blue-400",
    barClass:  "bg-blue-500",
  },
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { icon: Icon, iconClass, barClass } = VARIANT_CONFIG[t.variant];

  return (
    <div
      role="status"
      className={cn(
        "relative flex items-start gap-3 overflow-hidden",
        "rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-elevated px-4 py-3",
        "animate-in slide-in-from-bottom-2 fade-in duration-200",
      )}
    >
      {/* Color bar */}
      <span className={cn("absolute left-0 top-0 h-full w-1 rounded-l-xl", barClass)} />

      {/* Icon */}
      <Icon size={18} className={cn("mt-0.5 shrink-0", iconClass)} />

      {/* Message */}
      <p className="flex-1 text-sm text-foreground leading-snug">{t.message}</p>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(t.id)}
        aria-label="Dismiss notification"
        className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
