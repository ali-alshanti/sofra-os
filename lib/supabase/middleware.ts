import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import type { Database } from "@/types/database.types";

// Called from middleware.ts on every matched request.
// Reads the session from request cookies, refreshes it if expired,
// and writes the updated tokens back to the response cookies.
// Without this, JWTs expire and the user is silently treated as logged out.
export async function updateSession(
  request:  NextRequest,
  response: NextResponse,
): Promise<NextResponse> {
  const supabase = createServerClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session — do not remove this call.
  await supabase.auth.getUser();

  return response;
}
