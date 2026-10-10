"use server";

import {
  defaultRegistroFundacionValues,
  defaultRegistroVoluntarioValues,
  registroFundacionSchema,
  registroVoluntarioSchema,
  type FormState,
  type FormStateFundacion,
  type RegistroFundacionValues,
  type RegistroVoluntarioValues,
} from "@/lib/validations/registro";

const ROL_VOLUNTARIO = 1;

const fieldLabels: Record<keyof RegistroVoluntarioValues, string> = {
  documento_identidad: "numero de documento",
  nombre_completo: "nombre y apellidos",
  email: "correo electronico",
  password: "contrasena",
  telefono: "numero de telefono",
};

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function buildRejectedMessage(
  errors: FormState["errors"],
  fallback = "No pudimos crear la cuenta. Revisa la informacion e intenta nuevamente.",
) {
  if (!errors) {
    return fallback;
  }

  for (const [fieldName, fieldErrors] of Object.entries(errors) as Array<
    [keyof RegistroVoluntarioValues, string[] | undefined]
  >) {
    const firstError = fieldErrors?.[0];

    if (firstError) {
      return `No pudimos crear la cuenta: revisa ${fieldLabels[fieldName]} (${firstError.toLowerCase()}).`;
    }
  }

  return fallback;
}

export async function registrarVoluntario(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const attemptedAt = Date.now();

  const values: RegistroVoluntarioValues = {
    documento_identidad: getStringValue(formData.get("documento_identidad")),
    nombre_completo: getStringValue(formData.get("nombre_completo")),
    email: getStringValue(formData.get("email")),
    password: getStringValue(formData.get("password")),
    telefono: getStringValue(formData.get("telefono")),
  };

  const raw = {
    ...values,
    rol_id: ROL_VOLUNTARIO,
  };

  const parsed = registroVoluntarioSchema.safeParse(raw);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors as FormState["errors"];

    return {
      attemptedAt,
      errors,
      message: buildRejectedMessage(errors),
      values,
    };
  }

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    console.warn("[registro] API_URL no configurada en .env.local");
    return {
      attemptedAt,
      message:
        "El servicio no esta disponible en este momento. Intenta mas tarde.",
      values,
    };
  }

  try {
    const res = await fetch(`${apiUrl}/auth/registro-voluntario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (res.status === 409) {
      return {
        attemptedAt,
        errors: { email: ["Este correo ya esta registrado."] },
        message:
          "No pudimos crear la cuenta: el correo electronico ya esta registrado.",
        values,
      };
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const detail =
        typeof (data as Record<string, unknown>).detail === "string"
          ? (data as { detail: string }).detail
          : "Error al crear la cuenta. Intenta de nuevo.";
      return { attemptedAt, message: detail, values };
    }

    return {
      attemptedAt,
      success: true,
      message: "Cuenta creada exitosamente.",
      values: defaultRegistroVoluntarioValues,
    };
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return {
        attemptedAt,
        message: "El servidor tardo demasiado en responder.",
        values,
      };
    }
    return {
      attemptedAt,
      message: "No se pudo conectar con el servidor. Verifica tu conexion.",
      values,
    };
  }
}

// ── Fundacion ─────────────────────────────────────────────────────────────────

const ROL_FUNDACION = 3;

const fundacionFieldLabels: Record<keyof RegistroFundacionValues, string> = {
  nombre_legal: "nombre legal",
  nit: "NIT",
  email: "correo electronico",
  password: "contrasena",
};

function buildRejectedMessageFundacion(
  errors: FormStateFundacion["errors"],
  fallback = "No pudimos crear la cuenta. Revisa la informacion e intenta nuevamente.",
) {
  if (!errors) {
    return fallback;
  }

  for (const [fieldName, fieldErrors] of Object.entries(errors) as Array<
    [keyof RegistroFundacionValues, string[] | undefined]
  >) {
    const firstError = fieldErrors?.[0];

    if (firstError) {
      return `No pudimos crear la cuenta: revisa ${fundacionFieldLabels[fieldName]} (${firstError.toLowerCase()}).`;
    }
  }

  return fallback;
}

export async function registrarFundacion(
  _prevState: FormStateFundacion,
  formData: FormData,
): Promise<FormStateFundacion> {
  const attemptedAt = Date.now();

  const values: RegistroFundacionValues = {
    nombre_legal: getStringValue(formData.get("nombre_legal")),
    nit: getStringValue(formData.get("nit")),
    email: getStringValue(formData.get("email")),
    password: getStringValue(formData.get("password")),
  };

  const raw = {
    ...values,
    rol_id: ROL_FUNDACION,
  };

  const parsed = registroFundacionSchema.safeParse(raw);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors as FormStateFundacion["errors"];

    return {
      attemptedAt,
      errors,
      message: buildRejectedMessageFundacion(errors),
      values,
    };
  }

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    console.warn("[registro] API_URL no configurada en .env.local");
    return {
      attemptedAt,
      message:
        "El servicio no esta disponible en este momento. Intenta mas tarde.",
      values,
    };
  }

  try {
    const res = await fetch(`${apiUrl}/auth/registro-fundacion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (res.status === 409) {
      const data = await res.json().catch(() => ({}));
      const isNitConflict =
        typeof (data as Record<string, unknown>).field === "string" &&
        (data as { field: string }).field === "nit";

      if (isNitConflict) {
        return {
          attemptedAt,
          errors: { nit: ["Este NIT ya esta registrado."] },
          message: "No pudimos crear la cuenta: el NIT ya esta registrado.",
          values,
        };
      }

      return {
        attemptedAt,
        errors: { email: ["Este correo ya esta registrado."] },
        message:
          "No pudimos crear la cuenta: el correo electronico ya esta registrado.",
        values,
      };
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const detail =
        typeof (data as Record<string, unknown>).detail === "string"
          ? (data as { detail: string }).detail
          : "Error al crear la cuenta. Intenta de nuevo.";
      return { attemptedAt, message: detail, values };
    }

    return {
      attemptedAt,
      success: true,
      message: "Cuenta creada exitosamente.",
      values: defaultRegistroFundacionValues,
    };
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return {
        attemptedAt,
        message: "El servidor tardo demasiado en responder.",
        values,
      };
    }
    return {
      attemptedAt,
      message: "No se pudo conectar con el servidor. Verifica tu conexion.",
      values,
    };
  }
}
