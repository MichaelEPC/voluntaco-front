"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, type LoginFormState } from "@/lib/validations/login";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";

function getStringValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export async function login(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const attemptedAt = Date.now();

  // ── 1. Validate inputs ────────────────────────────────────────────────────
  const raw = {
    email: getStringValue(formData.get("email")),
    password: getStringValue(formData.get("password")),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ??
      "Revisa los datos e intenta nuevamente.";
    return { attemptedAt, message: firstError, values: raw };
  }

  // ── 2. Call the backend ───────────────────────────────────────────────────
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    console.warn("[login] API_URL no configurada en .env.local");
    return {
      attemptedAt,
      message: "El servicio no esta disponible en este momento.",
      values: raw,
    };
  }

  let accessToken: string;

  try {
    const res = await fetch(`${apiUrl}/auth/iniciar-sesion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (res.status === 401 || res.status === 403) {
      return {
        attemptedAt,
        message: "Correo o contrasena incorrectos.",
        values: raw,
      };
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const detail =
        typeof (data as Record<string, unknown>).detail === "string"
          ? (data as { detail: string }).detail
          : "No pudimos iniciar sesion. Intenta de nuevo.";
      return { attemptedAt, message: detail, values: raw };
    }

    const data = (await res.json()) as {
      access_token: string;
      token_type: string;
      user: { name: string; role: string | number };
    };

    if (!data.access_token) {
      return {
        attemptedAt,
        message: "Respuesta inesperada del servidor. Intenta de nuevo.",
        values: raw,
      };
    }

    accessToken = data.access_token;
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return {
        attemptedAt,
        message: "El servidor tardo demasiado en responder.",
        values: raw,
      };
    }
    return {
      attemptedAt,
      message: "No se pudo conectar con el servidor. Verifica tu conexion.",
      values: raw,
    };
  }

  // ── 3. Persist session in httpOnly cookie ─────────────────────────────────
  const jar = await cookies();
  jar.set(SESSION_COOKIE, accessToken, SESSION_COOKIE_OPTIONS);

  // ── 4. Redirect to the app (outside try/catch — redirect throws) ──────────
  redirect("/");
}

/** Clears the session cookie. Call from a Server Action bound to a logout button. */
export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}

