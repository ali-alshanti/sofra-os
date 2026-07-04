"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, Check, CheckCheck, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDismissNotification,
} from "@/lib/hooks/use-notifications";
import type { Notification } from "@/services/notifications";

// ─── Relative time helper ─────────────────────────────────────────────────────

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function useRelativeTime(t: ReturnType<typeof useTranslations>) {
  return function relativeTime(dateStr: string): string {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 1) return t("justNow");
    if (minutes < 60) return t("minutesAgo", { minutes });
    if (hours < 24) return t("hoursAgo", { hours });
    if (days === 1) return t("yesterday");
    return t("daysAgo", { days });
  };
}

// ─── Notification item ────────────────────────────────────────────────────────

function NotificationItem({
  notification,
  getRelativeTime,
  onRead,
  onDismiss,
}: {
  notification: Notification;
  getRelativeTime: (d: string) => string;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const t = useTranslations("common.notifications");
  const isUnread = notification.status === "unread";
  const data = isJsonObject(notification.data) ? notification.data : undefined;

  const key = typeof data?.key === "string" ? data.key : undefined;
  const params = isJsonObject(data?.params)
    ? (data.params as Record<string, string | number>)
    : {};

  let title = notification.title;
  let message = notification.message;
  if (key) {
    try {
      title = t(`${key}.title`, params);
      message = t(`${key}.message`, params);
    } catch {
      // Translation template expects params we don't have (e.g. legacy rows) — fall back to stored text.
    }
  }

  return (
    <div
      className={`group flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${
        isUnread ? "bg-primary/5" : ""
      }`}
    >
      {/* Unread dot */}
      <div className="mt-1.5 shrink-0 h-2 w-2">
        {isUnread && <span className="block h-2 w-2 rounded-full bg-primary" />}
      </div>

      {/* Content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => isUnread && onRead(notification.id)}
      >
        <p className="text-sm font-medium leading-tight truncate">{title}</p>
        {message && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {message}
          </p>
        )}
        <p className="text-xs text-muted-foreground/70 mt-1">
          {getRelativeTime(notification.created_at)}
        </p>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isUnread && (
          <button
            title={t("markAllRead")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onRead(notification.id);
            }}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          title={t("dismiss")}
          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── NotificationsButton ──────────────────────────────────────────────────────

export function NotificationsButton() {
  const t = useTranslations("common.notifications");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const dismiss = useDismissNotification();

  const getRelativeTime = useRelativeTime(t);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Sort: unread first, then by date desc
  const sorted = [...notifications].sort((a, b) => {
    if (a.status === "unread" && b.status !== "unread") return -1;
    if (a.status !== "unread" && b.status === "unread") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("button")}
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full p-0 px-0.5 text-[10px]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute inset-e-0 top-11 z-50 w-80 rounded-lg border bg-popover shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-semibold">{t("button")}</span>
            {unreadCount > 0 && (
              <button
                className="flex items-center gap-1 text-xs text-primary hover:underline"
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                {t("markAllRead")}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {tCommon("status.loading")}
              </div>
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <BellOff className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium">{t("noNotifications")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("noNotificationsDesc")}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {sorted.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    getRelativeTime={getRelativeTime}
                    onRead={(id) => markRead.mutate(id)}
                    onDismiss={(id) => dismiss.mutate(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
