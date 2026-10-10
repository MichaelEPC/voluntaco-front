"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE } from "@/lib/auth/session";
import {
  crearVoluntariadoSchema,
  actualizarVoluntariadoSchema,
  type VoluntariadoFormState,
} from "@/lib/validations/voluntariado";

export async function crearVoluntariado(
  fundacionId: string,
  _prevState: VoluntariadoFormState,
  formData: FormData,
): Promise<VoluntariadoFormState> {
  const attemptedAt = Date.now();

  if (!fundacionId) {
    return {
      attemptedAt,
      message:
        "No se pudo identificar la fundacion. Cierra sesion e intenta de nuevo.",
    };
  }

  // ── 1. Auth ───────────────────────────────────────────────────────────────
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (!token) {
    return { attemptedAt, message: "No autorizado. Inicia sesion nuevamente." };
  }

  // ── 2. Validate ───────────────────────────────────────────────────────────
  const raw = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    modalidad_id: formData.get("modalidad_id"),
    usuario_rol_id: formData.get("usuario_rol_id"),
    habilidades: formData.get("habilidades"),
  };

  const parsed = crearVoluntariadoSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? "Revisa los datos e intenta de nuevo.";
    return { attemptedAt, message: firstError };
  }

  // Parse habilidades JSON string into an array of IDs
  let habilidades_ids: number[] = [];
  if (parsed.data.habilidades) {
    try {
      const parsed_habilidades = JSON.parse(parsed.data.habilidades) as Array<{ id: number }>;
      habilidades_ids = parsed_habilidades.map((h) => h.id);
    } catch {
      // Ignore malformed JSON — treat as empty
    }
  }

  // ── 3. Call API ───────────────────────────────────────────────────────────
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    console.warn("[crearVoluntariado] API_URL no configurada en .env.local");
    return { attemptedAt, message: "El servicio no esta disponible." };
  }

  try {
    const res = await fetch(`${apiUrl}/fundaciones/voluntariados/crear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: parsed.data.nombre,
        descripcion: parsed.data.descripcion,
        modalidad_id: parsed.data.modalidad_id,
        usuario_rol_id: parsed.data.usuario_rol_id,
        habilidades_ids,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const detail =
        typeof (data as Record<string, unknown>).detail === "string"
          ? (data as { detail: string }).detail
          : "No se pudo crear el voluntariado. Intenta de nuevo.";
      return { attemptedAt, message: detail };
    }

    revalidatePath("/voluntariados");
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return {
        attemptedAt,
        message: "El servidor tardó demasiado. Intenta de nuevo.",
      };
    }
    return { attemptedAt, message: "Error de conexion. Intenta de nuevo." };
  }
}

export async function actualizarVoluntariado(
  voluntariadoId: number,
  _prevState: VoluntariadoFormState,
  formData: FormData,
): Promise<VoluntariadoFormState> {
  const attemptedAt = Date.now();

  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (!token) {
    return { attemptedAt, message: "No autorizado. Inicia sesion nuevamente." };
  }

  const raw = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    modalidad_id: formData.get("modalidad_id"),
    usuario_rol_id: formData.get("usuario_rol_id"),
    habilidades: formData.get("habilidades"),
  };

  const parsed = actualizarVoluntariadoSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? "Revisa los datos e intenta de nuevo.";
    return { attemptedAt, message: firstError };
  }

  let habilidades_ids: number[] | undefined;
  if (parsed.data.habilidades !== undefined) {
    try {
      const parsed_habilidades = JSON.parse(parsed.data.habilidades) as Array<{ id: number }>;
      habilidades_ids = parsed_habilidades.map((h) => h.id);
    } catch {
      habilidades_ids = [];
    }
  }

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    console.warn("[actualizarVoluntariado] API_URL no configurada en .env.local");
    return { attemptedAt, message: "El servicio no esta disponible." };
  }

  // Build patch body — only include defined fields
  const body: Record<string, unknown> = {};
  if (parsed.data.nombre !== undefined) body.nombre = parsed.data.nombre;
  if (parsed.data.descripcion !== undefined) body.descripcion = parsed.data.descripcion;
  if (parsed.data.modalidad_id !== undefined) body.modalidad_id = parsed.data.modalidad_id;
  if (parsed.data.usuario_rol_id !== undefined) body.usuario_rol_id = parsed.data.usuario_rol_id;
  if (habilidades_ids !== undefined) body.habilidades_ids = habilidades_ids;

  try {
    const res = await fetch(`${apiUrl}/fundaciones/voluntariados/${voluntariadoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const detail =
        typeof (data as Record<string, unknown>).detail === "string"
          ? (data as { detail: string }).detail
          : "No se pudo actualizar el voluntariado. Intenta de nuevo.";
      return { attemptedAt, message: detail };
    }

    revalidatePath("/voluntariados");
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return { attemptedAt, message: "El servidor tardó demasiado. Intenta de nuevo." };
    }
    return { attemptedAt, message: "Error de conexion. Intenta de nuevo." };
  }
}

export async function eliminarVoluntariado(
  voluntariadoId: number,
): Promise<{ success?: boolean; message?: string }> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (!token) {
    return { message: "No autorizado. Inicia sesión nuevamente." };
  }

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    console.warn("[eliminarVoluntariado] API_URL no configurada en .env.local");
    return { message: "El servicio no está disponible." };
  }

  try {
    const res = await fetch(`${apiUrl}/fundaciones/voluntariados/${voluntariadoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const detail =
        typeof (data as Record<string, unknown>).detail === "string"
          ? (data as { detail: string }).detail
          : "No se pudo eliminar el voluntariado. Intenta de nuevo.";
      return { message: detail };
    }

    revalidatePath("/voluntariados");
    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return { message: "El servidor tardó demasiado. Intenta de nuevo." };
    }
    return { message: "Error de conexión. Intenta de nuevo." };
  }
}
