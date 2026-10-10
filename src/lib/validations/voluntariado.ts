import { z } from "zod";

/** Convierte un valor string de formulario a un entero positivo requerido. */
const requiredId = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number({ message: "Selecciona una opcion valida" }).int().positive("Selecciona una opcion valida"),
);

export const crearVoluntariadoSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  descripcion: z
    .string()
    .min(1, "La descripcion es obligatoria")
    .max(2000, "La descripcion no puede superar los 2000 caracteres"),

  modalidad_id: requiredId,

  usuario_rol_id: requiredId,

  /**
   * Arreglo serializado en JSON de los objetos habilidad seleccionados: [{id, nombre}, ...]
   * Opcional — se envia un arreglo vacio cuando no se selecciono nada.
   */
  habilidades: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().optional(),
  ),
});

export type CrearVoluntariadoInput = z.infer<typeof crearVoluntariadoSchema>;

/** Esquema para PATCH — todos los campos opcionales, pero validados si se proveen. */
const optionalId = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().int().positive("Selecciona una opcion valida").optional(),
);

export const actualizarVoluntariadoSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .optional(),

  descripcion: z
    .string()
    .max(2000, "La descripcion no puede superar los 2000 caracteres")
    .optional()
    .or(z.literal("")),

  modalidad_id: optionalId,

  usuario_rol_id: optionalId,

  habilidades: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().optional(),
  ),
});

export type ActualizarVoluntariadoInput = z.infer<typeof actualizarVoluntariadoSchema>;

export interface VoluntariadoFormState {
  message?: string;
  success?: boolean;
  attemptedAt?: number;
}
