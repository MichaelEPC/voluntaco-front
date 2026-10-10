import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { SESSION_COOKIE } from "@/lib/auth/session";

// ── Clasificacion de rutas ───────────────────────────────────────────────────

/**
 * Rutas siempre accesibles — no requieren sesion.
 * Todo lo demas se considera protegido.
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

// ── Funciones auxiliares de sesion (compatibles con Edge) ────────────────────

function isValidToken(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    if (typeof payload.exp === "number") {
      return payload.exp * 1000 > Date.now();
    }
    // Sin claim exp — se acepta el token (el backend controla su validez)
    return true;
  } catch {
    return false;
  }
}

// ── Limitacion de tasa (rate limiting) ───────────────────────────────────────
//
// NOTA: Este almacen en memoria funciona correctamente solo en despliegues de una
// sola instancia (desarrollo local, servidor unico). Para despliegues distribuidos
// o en edge, reemplazar con Upstash Redis + @upstash/ratelimit.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const LIMIT = 10;              // maximo de peticiones por ventana
const WINDOW_MS = 60_000;     // 1 minuto

/** Retorna `true` si la IP supero el limite de tasa. */
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

// ── Proxy ─────────────────────────────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = token ? isValidToken(token) : false;

  // ── Proteccion de rutas ──────────────────────────────────────────────────────
  if (!isPublicPath(pathname)) {
    // Ruta protegida — redirige a los usuarios no autenticados al login
    if (!authenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      // Preserva el destino original para redirigir de vuelta tras iniciar sesion
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } else if (pathname === "/login" && authenticated) {
    // Ya tiene sesion iniciada — lo saca de la pagina de login
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  // ── Limitacion de tasa (solo Server Actions de autenticacion) ────────────────
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

  // ── Encabezados de seguridad (aplicados a cada respuesta) ────────────────────
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
    // Se aplica a todas las rutas excepto los internos de Next.js y los activos estaticos
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

