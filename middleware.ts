import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { SESSION_COOKIE } from "@/lib/auth/session";

// ── Route classification ──────────────────────────────────────────────────────

/**
 * Paths that are always accessible — no session required.
 * Everything else is considered protected.
 */
const PUBLIC_PATHS = [
  "/login",
  "/registro/voluntario",
  "/registro/fundacion",
] as const;

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

// ── Session helpers (Edge-compatible) ────────────────────────────────────────

function isValidToken(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    if (typeof payload.exp === "number") {
      return payload.exp * 1000 > Date.now();
    }
    // No exp claim — accept the token (backend controls validity)
    return true;
  } catch {
    return false;
  }
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
//
// NOTE: This in-memory store works correctly only in single-instance deployments
// (local dev, single-server). For distributed/edge deployments, replace with
// Upstash Redis + @upstash/ratelimit.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const LIMIT = 10;              // max requests per window
const WINDOW_MS = 60_000;     // 1 minute

/** Returns `true` if the IP has exceeded the rate limit. */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= LIMIT) return true;
  entry.count += 1;
  return false;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ── Middleware ────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = token ? isValidToken(token) : false;

  // ── Route protection ──────────────────────────────────────────────────────
  if (!isPublicPath(pathname)) {
    // Protected route — redirect unauthenticated users to login
    if (!authenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      // Preserve the intended destination so we can redirect back after login
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } else if (pathname === "/login" && authenticated) {
    // Already logged in — send away from the login page
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  // ── Rate limiting (auth Server Actions only) ──────────────────────────────
  const isServerAction = request.headers.has("next-action");
  const isAuthPath =
    pathname.startsWith("/registro") || pathname.startsWith("/login");

  if (request.method === "POST" && isServerAction && isAuthPath) {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({
          message: "Demasiados intentos. Espera un momento e intenta de nuevo.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(WINDOW_MS / 1000),
          },
        },
      );
    }
  }

  const response = NextResponse.next();

  // ── Security headers (applied to every response) ──────────────────────────
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

