import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

/**
 * Service-role client — bypasses RLS. Only import this from server-only
 * code (Route Handlers). Never expose to client components or bundles.
 */
export function getSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return createClient<Database>(env.SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Verifies the requesting session belongs to an Owner/Manager of a
 * restaurant, returning that restaurant's id. Route Handlers call this
 * before performing any admin (service-role) user management action.
 */
export async function requireUserAdmin(): Promise<
  { ok: true; restaurantId: string } | { ok: false; status: number; message: string }
> {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, message: "Not authenticated." };

  const { data: profile } = await supabase
    .from("users")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();
  if (!profile?.restaurant_id) return { ok: false, status: 403, message: "No restaurant." };

  const { data: roleName } = await supabase.rpc("current_user_role");
  if (roleName !== "Owner" && roleName !== "Manager") {
    return { ok: false, status: 403, message: "Insufficient permissions." };
  }

  return { ok: true, restaurantId: profile.restaurant_id };
}
