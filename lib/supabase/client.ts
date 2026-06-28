import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/config/env";
import type { Database } from "@/types/database.types";

// Singleton — one client instance for the entire browser session.
// Re-creating the client on every render would reset in-flight subscriptions.
let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
    );
  }
  return client;
}
