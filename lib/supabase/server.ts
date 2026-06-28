import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/config/env";
import type { Database } from "@/types/database.types";

// New instance per call — server clients must not be shared across requests.
// cookies() returns a ReadonlyRequestCookies in Next.js App Router;
// @supabase/ssr handles both get and set through the adapter below.
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot set cookies — the middleware handles refresh.
            // Errors here are expected and safe to swallow.
          }
        },
      },
    },
  );
}
