import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { hasAccess } from "@/lib/permissions";
import type { UserRole } from "@/types/auth";

// ─── Locale middleware (handles language routing + Accept-Language detection) ──
const intlMiddleware = createMiddleware(routing);

// ─── Routes that do NOT require authentication ────────────────────────────────
const PUBLIC_SEGMENTS = ["/login", "/forgot-password", "/reset-password"];

function isPublicPath(pathname: string): boolean {
  // Strip locale prefix if present (e.g. /ar/login → /login)
  const stripped = pathname.replace(/^\/(en|ar)/, "") || "/";
  if (stripped === "/" || stripped === "") return true;
  return PUBLIC_SEGMENTS.some((p) => stripped === p || stripped.startsWith(p + "/"));
}

function isRootPath(pathname: string): boolean {
  const stripped = pathname.replace(/^\/(en|ar)$/, "") || "/";
  return stripped === "/" || stripped === "";
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
  const isRoot = isRootPath(pathname);

  // Root "/" or "/{locale}" always renders the marketing landing page,
  // for both authenticated and unauthenticated visitors.
  if (isRoot) {
    return response;
  }

  // Authenticated user visiting public page (e.g. /login) → send to dashboard
  if (user && pub) {
    return NextResponse.redirect(getLocalePath(request.nextUrl, "/dashboard"));
  }

  // Unauthenticated user visiting protected page → send to login
  if (!user && !pub) {
    const loginUrl = getLocalePath(request.nextUrl, "/login");
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user visiting a page their role doesn't grant access to
  if (user && !pub) {
    const stripped = pathname.replace(/^\/(en|ar)/, "") || "/";
    if (stripped !== "/403") {
      const { data: roleName } = await supabase.rpc("current_user_role");
      if (!hasAccess(roleName as UserRole | undefined, stripped)) {
        return NextResponse.redirect(getLocalePath(request.nextUrl, "/403"));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf)).*)",
  ],
};
