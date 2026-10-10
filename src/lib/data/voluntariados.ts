import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/session";
import type { Voluntariado, Modalidad, VoluntarioRol, Habilidad } from "@/types";

/**
 * Obtiene todos los voluntariados publicados por una fundacion dada.
 * Retorna un arreglo vacio ante cualquier error para que la pagina se renderice sin fallas.
 */
export async function getVoluntariadosFundacion(
  fundacionId: string,
): Promise<Voluntariado[]> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl || !fundacionId) return [];

  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return [];

  try {
    const res = await fetch(
      `${apiUrl}/fundaciones/obtener-voluntariados-por-fundacion`,
      {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ fundacionId }),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    );

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? (data as Voluntariado[]) : [];
  } catch {
    return [];
  }
}

/**
 * Obtiene la lista de habilidades desde /util/habilidades-voluntariados.
 * Retorna un arreglo vacio ante cualquier error para que la pagina se renderice sin fallas.
 */
export async function getHabilidades(): Promise<Habilidad[]> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return [];

  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return [];

  try {
    const res = await fetch(`${apiUrl}/util/habilidades-voluntariados`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? (data as Habilidad[]) : [];
  } catch {
    return [];
  }
}

/**
 * Obtiene la lista de modalidades desde /util/modalidades-voluntariados.
 * Retorna un arreglo vacio ante cualquier error para que la pagina se renderice sin fallas.
 */
export async function getModalidades(): Promise<Modalidad[]> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return [];

  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return [];

  try {
    const res = await fetch(`${apiUrl}/util/modalidades-voluntariados`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? (data as Modalidad[]) : [];
  } catch {
    return [];
  }
}

/**
 * Obtiene la lista de roles de voluntario desde /util/roles-voluntarios.
 * Retorna un arreglo vacio ante cualquier error para que la pagina se renderice sin fallas.
 */
export async function getVoluntariosRoles(): Promise<VoluntarioRol[]> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return [];

  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return [];

  try {
    const res = await fetch(`${apiUrl}/util/roles-voluntarios`, {
      headers: { Authorization: `Bearer ${token}` },
      // Los roles son datos de referencia estables — revalidar una vez al dia
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? (data as VoluntarioRol[]) : [];
  } catch {
    return [];
  }
}
