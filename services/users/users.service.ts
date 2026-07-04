import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppUser, AppUserStatus } from "@/features/users/types";
import type { UserRole } from "@/types/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetUsersParams {
  restaurantId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole | "all";
  status?: AppUserStatus | "all";
}

export interface GetUsersResult {
  users: AppUser[];
  total: number;
}

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  last_seen_at: string | null;
  created_at: string;
  user_roles: { roles: { name: string } | null }[] | null;
}

function mapRowToUser(row: UserRow): AppUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    role: (row.user_roles?.[0]?.roles?.name ?? "Waiter") as UserRole,
    status: row.is_active ? "active" : "inactive",
    lastLoginAt: row.last_seen_at,
    createdAt: row.created_at,
  };
}

// ─── getUsers ─────────────────────────────────────────────────────────────────

export async function getUsers({
  restaurantId,
  page = 1,
  pageSize = 10,
  search,
  role,
  status,
}: GetUsersParams): Promise<GetUsersResult> {
  const supabase = getSupabaseBrowserClient();

  let query = supabase
    .from("users")
    .select("id, full_name, email, phone, avatar_url, is_active, last_seen_at, created_at, user_roles(roles(name))")
    .eq("restaurant_id", restaurantId)
    .order("full_name");

  if (status && status !== "all") query = query.eq("is_active", status === "active");
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Role lives on a joined table, so filtering/pagination happens in-memory
  // (restaurant-scale row counts make this fine).
  let users = (data ?? []).map((row) => mapRowToUser(row as unknown as UserRow));
  if (role && role !== "all") users = users.filter((u) => u.role === role);

  const total = users.length;
  const from = (page - 1) * pageSize;
  return { users: users.slice(from, from + pageSize), total };
}

// ─── createUser / updateUser (via server route — needs service role) ──────────

export interface CreateUserPayload {
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
  status: AppUserStatus;
}

export async function createUser(payload: CreateUserPayload): Promise<void> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Failed to create user.");
  }
}

export interface UpdateUserPayload {
  full_name?: string;
  phone?: string;
  role?: UserRole;
  status?: AppUserStatus;
}

export async function updateUser(userId: string, patch: UpdateUserPayload): Promise<void> {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Failed to update user.");
  }
}

// ─── deactivate / reactivate (direct — covered by users_admin_manage RLS) ─────

export async function setUserStatus(userId: string, status: AppUserStatus): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("users")
    .update({ is_active: status === "active" })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}
