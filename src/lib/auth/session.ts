import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session" as const;

/** Forma del payload del JWT enviado por el backend. */
export interface SessionPayload {
  name: string;
  role: string | number;
  /**
   * Subject (sub) del JWT — contiene el usuario_id (clave primaria del usuario).
   * Se usa para identificar al usuario al hacer llamadas autenticadas a la API.
   */
  sub?: string;
  /** Expiracion estandar del JWT (segundos desde epoch). */
  exp?: number;
}

/**
 * Lee y decodifica la cookie de sesion **sin** verificar la firma
 * (la verificacion de la firma es responsabilidad del backend en cada llamada a la API).
 * Retorna `null` cuando la cookie no existe o el token expiro.
 */
export function decodeSession(token: string): SessionPayload | null {
  try {
    const payload = decodeJwt(token) as SessionPayload & { exp?: number };

    // Trata un token expirado igual que si no hubiera sesion.
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return { name: payload.name, role: payload.role, sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}

/**
 * Retorna el token de acceso crudo desde la cookie de sesion.
 * Usa esto cuando necesites el string del JWT para encabezados de Authorization.
 */
export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * Retorna la sesion actual desde el almacen de cookies de la peticion (solo
 * Server Components y Server Actions). Retorna `null` cuando no hay sesion.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

/** Opciones de cookie usadas al establecer la sesion. */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60, // 1 hora — refleja la vida util del token del backend
} as const;
