import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// ─── Locale middleware (handles language routing + Accept-Language detection) ──
const intlMiddleware = createMiddleware(routing);

// ─── Routes that do NOT require authentication ────────────────────────────────
const PUBLIC_SEGMENTS = ["/login", "/forgot-password", "/reset-password"];

function isPublicPath(pathname: string): boolean {
  // Strip locale prefix if present (e.g. /ar/login → /login)
  const stripped = pathname.replace(/^\/(en|ar)/, "") || "/";
  return PUBLIC_SEGMENTS.some((p) => stripped === p || stripped.startsWith(p + "/"));
}

function getLocalePath(url: URL, path: string): URL {
  // Preserve current locale prefix when redirecting
  const locale = url.pathname.match(/^\/(en|ar)\//)?.[1];
  const prefix = locale ? `/${locale}` : "";
  return new URL(`${prefix}${path}`, url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Next.js internals and static assets through immediately
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next({ request });
  }

  // ── Step 1: Run next-intl middleware first (locale detection + routing) ─────
  const intlResponse = intlMiddleware(request);

  // If intl issued a redirect (e.g. to add locale prefix), honour it immediately
  if (intlResponse.status !== 200) return intlResponse;

  // ── Step 2: Supabase auth check ───────────────────────────────────────────────
  let response = intlResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pub = isPublicPath(pathname);

  // Authenticated user visiting public page → send to dashboard
  if (user && pub) {
    return NextResponse.redirect(getLocalePath(request.nextUrl, "/dashboard"));
  }

  // Unauthenticated user visiting protected page → send to login
  if (!user && !pub) {
    const stripped = pathname.replace(/^\/(en|ar)/, "") || "/";
    if (stripped !== "/" && stripped !== "") {
      const loginUrl = getLocalePath(request.nextUrl, "/login");
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Root "/" or "/{locale}" → redirect based on auth state
  const stripped = pathname.replace(/^\/(en|ar)$/, "") ?? pathname;
  if (stripped === "" || stripped === "/") {
    const dest = user ? "/dashboard" : "/login";
    return NextResponse.redirect(getLocalePath(request.nextUrl, dest));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf)).*)",
  ],
};
