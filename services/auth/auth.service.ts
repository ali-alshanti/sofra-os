import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthUser, LoginCredentials } from "@/types/auth";

// ─── Error normalizer ─────────────────────────────────────────────────────────

function normalizeError(message: string): string {
  if (/invalid login credentials/i.test(message)) return "Invalid email or password.";
  if (/email not confirmed/i.test(message))       return "Please confirm your email before signing in.";
  if (/too many requests/i.test(message))          return "Too many attempts. Please wait a moment and try again.";
  if (/network/i.test(message))                    return "Network error. Check your connection and try again.";
  return "An unexpected error occurred. Please try again.";
}

// ─── Sign in ──────────────────────────────────────────────────────────────────

async function signIn({ email, password }: LoginCredentials) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(normalizeError(error.message));
  return data;
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

async function signOut() {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// ─── Session ──────────────────────────────────────────────────────────────────

async function getSession() {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

// ─── User profile ─────────────────────────────────────────────────────────────

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  restaurant_id: string | null;
  user_roles: { roles: { name: string } | null }[] | null;
}

async function getProfile(userId: string): Promise<AuthUser | null> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, restaurant_id, user_roles(roles(name))")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  const row = data as unknown as ProfileRow;
  const role = row.user_roles?.[0]?.roles?.name;
  if (!role) return null;

  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    restaurant_id: row.restaurant_id,
    role: role as AuthUser["role"],
  };
}

// ─── Current user (session + profile) ────────────────────────────────────────

async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session?.user) return null;
  return getProfile(session.user.id);
}

// ─── Forgot password ──────────────────────────────────────────────────────────

async function sendPasswordResetEmail(email: string) {
  const supabase = getSupabaseBrowserClient();
  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(normalizeError(error.message));
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const authService = {
  signIn,
  signOut,
  getSession,
  getCurrentUser,
  getProfile,
  sendPasswordResetEmail,
};
