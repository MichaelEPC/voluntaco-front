import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/session";
import type { Voluntariado, Modalidad, VoluntarioRol, Habilidad } from "@/types";

/**
 * Fetches all voluntariados published by a given foundation.
 * Returns an empty array on any error so the page can render gracefully.
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
 * Fetches the list of skills (habilidades) from /util/habilidades-voluntariados.
 * Returns an empty array on any error so the page can render gracefully.
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
 * Fetches the list of modalidades from /util/modalidades-voluntariados.
 * Returns an empty array on any error so the page can render gracefully.
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
 * Fetches the list of volunteer roles from /util/roles-voluntarios.
 * Returns an empty array on any error so the page can render gracefully.
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
      // Roles are stable reference data — revalidate once per day
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
