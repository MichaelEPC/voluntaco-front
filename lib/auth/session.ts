import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session" as const;

/** Shape of the JWT payload sent by the backend. */
export interface SessionPayload {
  name: string;
  role: string | number;
  /**
   * JWT subject — contains the usuario_id (user's primary key).
   * Used to identify the user when making authenticated API calls.
   */
  sub?: string;
  /** Standard JWT expiry (seconds since epoch). */
  exp?: number;
}

/**
 * Reads and decodes the session cookie **without** verifying the signature
 * (signature verification is the backend's responsibility on every API call).
 * Returns `null` when the cookie is absent or the token is expired.
 */
export function decodeSession(token: string): SessionPayload | null {
  try {
    const payload = decodeJwt(token) as SessionPayload & { exp?: number };

    // Treat an expired token the same as no session.
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return { name: payload.name, role: payload.role, sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}

/**
 * Returns the raw access token from the session cookie.
 * Use this when you need the JWT string for Authorization headers.
 */
export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * Returns the current session from the request cookie store (Server Components
 * and Server Actions only). Returns `null` when unauthenticated.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

/** Cookie options used when setting the session. */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60, // 1 hour — mirrors the backend token lifetime
} as const;
