import { z } from "zod";

export const PROYECTO_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const PROYECTO_IMAGE_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
] as const;

export function validateProyectoImage(file: File): string | null {
  if (!PROYECTO_IMAGE_TYPES.some((type) => type === file.type)) {
    return "Selecciona una imagen JPG, PNG, WebP, GIF o AVIF.";
  }
  if (file.size === 0) return "La imagen esta vacia.";
  if (file.size > PROYECTO_IMAGE_MAX_BYTES) return "La imagen no puede superar los 2 MB.";
  return null;
}

export async function validateProyectoImageContent(file: File): Promise<string | null> {
  const error = validateProyectoImage(file);
  if (error) return error;
  const bytes = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  const matches = (offset: number, signature: number[]) =>
    signature.every((byte, index) => bytes[offset + index] === byte);
  const text = (offset: number, value: string) =>
    matches(offset, Array.from(value, (character) => character.charCodeAt(0)));
  const valid =
    (file.type === "image/png" && matches(0, [137, 80, 78, 71, 13, 10, 26, 10])) ||
    (file.type === "image/jpeg" && matches(0, [255, 216, 255])) ||
    (file.type === "image/gif" && (text(0, "GIF87a") || text(0, "GIF89a"))) ||
    (file.type === "image/webp" && text(0, "RIFF") && text(8, "WEBP")) ||
    (file.type === "image/avif" && text(4, "ftyp") &&
      Array.from({ length: Math.floor((bytes.length - 8) / 4) }, (_, index) => 8 + index * 4)
        .some((offset) => text(offset, "avif") || text(offset, "avis")));
  return valid ? null : "El contenido del archivo no corresponde al formato de imagen indicado.";
}

const imageSchema = z
  .instanceof(File)
  .superRefine((file, ctx) => {
    const message = validateProyectoImage(file);
    if (message) ctx.addIssue({ code: "custom", message });
  })
  .nullable();

export const crearProyectoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre del proyecto es obligatorio.")
    .max(150, "El nombre no puede superar los 150 caracteres."),
  descripcion: z.string().trim().transform((value) => value || null),
  fecha_creacion: z.iso.date("Selecciona una fecha de creacion valida.")
    .refine(
      (value) => value <= new Date().toISOString().slice(0, 10),
      "La fecha de creacion no puede ser futura.",
    )
    .transform((value) => `${value}T00:00:00.000Z`),
  foto: imageSchema,
  foto_cabeza: imageSchema,
});

export const proyectoIdSchema = z.string().uuid("El ID del proyecto debe ser un UUID valido.");

export const proyectoSchema = z.object({
  id: proyectoIdSchema,
  nombre: z.string().min(1).max(150),
  descripcion: z.string().nullable(),
  foto_url: z.string().nullable(),
  foto_cabeza_url: z.string().nullable().optional(),
  estado: z.string().min(1),
  fecha_creacion: z
    .string()
    .refine((value) => Number.isFinite(Date.parse(value))),
});

export type Proyecto = z.infer<typeof proyectoSchema>;
export type ProyectoFormValues = {
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
};

export interface ProyectoFormState {
  message?: string;
  errors?: Partial<Record<keyof ProyectoFormValues | "foto" | "foto_cabeza", string[]>>;
  values?: ProyectoFormValues;
}
