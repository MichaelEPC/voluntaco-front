import { z } from "zod";

// ── Schema ────────────────────────────────────────────────────────────────────

export const REGISTRO_LIMITS = {
  documento: { min: 7, max: 10 },
  nombreCompleto: { min: 14, max: 100 },
  email: { min: 6, max: 120 },
  telefono: { exact: 10 },
  password: { min: 7, max: 64 },
} as const;

export const defaultRegistroVoluntarioValues = {
  documento_identidad: "",
  nombre_completo: "",
  email: "",
  password: "",
  telefono: "",
} as const;

export type RegistroVoluntarioValues = {
  documento_identidad: string;
  nombre_completo: string;
  email: string;
  password: string;
  telefono: string;
};

export const registroVoluntarioSchema = z.object({
  documento_identidad: z
    .string()
    .trim()
    .min(
      REGISTRO_LIMITS.documento.min,
      `Minimo ${REGISTRO_LIMITS.documento.min} digitos`,
    )
    .max(
      REGISTRO_LIMITS.documento.max,
      `Maximo ${REGISTRO_LIMITS.documento.max} digitos`,
    )
    .regex(/^\d+$/, "Solo digitos numericos"),

  nombre_completo: z
    .string()
    .trim()
    .min(
      REGISTRO_LIMITS.nombreCompleto.min,
      `Minimo ${REGISTRO_LIMITS.nombreCompleto.min} caracteres`,
    )
    .max(
      REGISTRO_LIMITS.nombreCompleto.max,
      `Maximo ${REGISTRO_LIMITS.nombreCompleto.max} caracteres`,
    ),

  email: z
    .string()
    .trim()
    .min(
      REGISTRO_LIMITS.email.min,
      `Minimo ${REGISTRO_LIMITS.email.min} caracteres`,
    )
    .max(
      REGISTRO_LIMITS.email.max,
      `Maximo ${REGISTRO_LIMITS.email.max} caracteres`,
    )
    .email("Ingresa un correo valido")
    .toLowerCase(),

  password: z
    .string()
    .min(
      REGISTRO_LIMITS.password.min,
      `Minimo ${REGISTRO_LIMITS.password.min} caracteres`,
    )
    .max(
      REGISTRO_LIMITS.password.max,
      `Maximo ${REGISTRO_LIMITS.password.max} caracteres`,
    )
    .regex(/[0-9]/, "Debe contener al menos un numero")
    .regex(/[A-Z]/, "Debe contener al menos una mayuscula")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un caracter especial"),

  telefono: z
    .string()
    .trim()
    .length(
      REGISTRO_LIMITS.telefono.exact,
      `Debe tener exactamente ${REGISTRO_LIMITS.telefono.exact} digitos`,
    )
    .regex(/^\d+$/, "Solo digitos numericos"),

  rol_id: z.number().int(),
});

export type RegistroVoluntarioInput = z.infer<typeof registroVoluntarioSchema>;

// ── Form state (returned by the Server Action) ────────────────────────────────

type FieldName = keyof Omit<RegistroVoluntarioInput, "rol_id">;

export type FormState = {
  errors?: Partial<Record<FieldName, string[]>>;
  message?: string;
  success?: boolean;
  values?: RegistroVoluntarioValues;
  attemptedAt?: number;
};

// ── Fundacion ─────────────────────────────────────────────────────────────────

export const REGISTRO_FUNDACION_LIMITS = {
  nombreLegal: { min: 5, max: 150 },
  nit: { min: 9, max: 10 },
} as const;

export const defaultRegistroFundacionValues = {
  nombre_legal: "",
  nit: "",
  email: "",
  password: "",
} as const;

export type RegistroFundacionValues = {
  nombre_legal: string;
  nit: string;
  email: string;
  password: string;
};

export const registroFundacionSchema = z.object({
  nombre_legal: z
    .string()
    .trim()
    .min(
      REGISTRO_FUNDACION_LIMITS.nombreLegal.min,
      `Minimo ${REGISTRO_FUNDACION_LIMITS.nombreLegal.min} caracteres`,
    )
    .max(
      REGISTRO_FUNDACION_LIMITS.nombreLegal.max,
      `Maximo ${REGISTRO_FUNDACION_LIMITS.nombreLegal.max} caracteres`,
    ),

  nit: z
    .string()
    .trim()
    .min(
      REGISTRO_FUNDACION_LIMITS.nit.min,
      `Minimo ${REGISTRO_FUNDACION_LIMITS.nit.min} digitos`,
    )
    .max(
      REGISTRO_FUNDACION_LIMITS.nit.max,
      `Maximo ${REGISTRO_FUNDACION_LIMITS.nit.max} digitos`,
    )
    .regex(/^\d+$/, "Solo digitos numericos"),

  email: z
    .string()
    .trim()
    .min(
      REGISTRO_LIMITS.email.min,
      `Minimo ${REGISTRO_LIMITS.email.min} caracteres`,
    )
    .max(
      REGISTRO_LIMITS.email.max,
      `Maximo ${REGISTRO_LIMITS.email.max} caracteres`,
    )
    .email("Ingresa un correo valido")
    .toLowerCase(),

  password: z
    .string()
    .min(
      REGISTRO_LIMITS.password.min,
      `Minimo ${REGISTRO_LIMITS.password.min} caracteres`,
    )
    .max(
      REGISTRO_LIMITS.password.max,
      `Maximo ${REGISTRO_LIMITS.password.max} caracteres`,
    )
    .regex(/[0-9]/, "Debe contener al menos un numero")
    .regex(/[A-Z]/, "Debe contener al menos una mayuscula")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un caracter especial"),

  rol_id: z.number().int(),
});

export type RegistroFundacionInput = z.infer<typeof registroFundacionSchema>;

type FundacionFieldName = keyof Omit<RegistroFundacionInput, "rol_id">;

export type FormStateFundacion = {
  errors?: Partial<Record<FundacionFieldName, string[]>>;
  message?: string;
  success?: boolean;
  values?: RegistroFundacionValues;
  attemptedAt?: number;
};
