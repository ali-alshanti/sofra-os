import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type NotificationType = Database["public"]["Enums"]["notification_type"];
type NotificationStatus = Database["public"]["Enums"]["notification_status"];

export interface Notification {
  id: string;
  title: string;
  message: string | null;
  type: NotificationType;
  status: NotificationStatus;
  read_at: string | null;
  restaurant_id: string;
  user_id: string;
  created_at: string;
  data: Record<string, unknown>;
}

export interface CreateNotificationParams {
  restaurantId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

// ─── createNotification ───────────────────────────────────────────────────────

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("notifications").insert({
    restaurant_id: params.restaurantId,
    user_id: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    status: "unread",
    data: params.data ?? {},
  });
  if (error) throw error;
}

// ─── getNotifications ─────────────────────────────────────────────────────────

export async function getNotifications(
  restaurantId: string,
  userId: string,
  limit = 50,
): Promise<Notification[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("user_id", userId)
    .neq("status", "dismissed")
    .order("status", { ascending: true })   // unread first (u < r alphabetically)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Notification[];
}

// ─── getUnreadCount ───────────────────────────────────────────────────────────

export async function getUnreadCount(restaurantId: string, userId: string): Promise<number> {
  const supabase = getSupabaseBrowserClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId)
    .eq("user_id", userId)
    .eq("status", "unread");

  if (error) throw error;
  return count ?? 0;
}

// ─── markNotificationRead ─────────────────────────────────────────────────────

export async function markNotificationRead(notificationId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("id", notificationId);
  if (error) throw error;
}

// ─── markAllNotificationsRead ─────────────────────────────────────────────────

export async function markAllNotificationsRead(
  restaurantId: string,
  userId: string,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("notifications")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("restaurant_id", restaurantId)
    .eq("user_id", userId)
    .eq("status", "unread");
  if (error) throw error;
}

// ─── dismissNotification ──────────────────────────────────────────────────────

export async function dismissNotification(notificationId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("notifications")
    .update({ status: "dismissed" })
    .eq("id", notificationId);
  if (error) throw error;
}
