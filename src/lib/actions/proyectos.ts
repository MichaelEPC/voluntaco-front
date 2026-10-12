"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requestProyectos } from "@/lib/data/proyectos";
import {
  crearProyectoSchema,
  validateProyectoImageContent,
  type ProyectoFormState,
} from "@/lib/validations/proyecto";

export async function crearProyecto(
  _prevState: ProyectoFormState,
  formData: FormData,
): Promise<ProyectoFormState> {
  const values = {
    nombre: String(formData.get("nombre") ?? ""),
    descripcion: String(formData.get("descripcion") ?? ""),
    fecha_creacion: String(formData.get("fecha_creacion") ?? ""),
  };
  const foto = formData.get("foto");
  const fotoCabeza = formData.get("foto_cabeza");
  const parsed = crearProyectoSchema.safeParse({
    ...values,
    foto: foto instanceof File && foto.name === "" && foto.size === 0 ? null : foto,
    foto_cabeza: fotoCabeza instanceof File && fotoCabeza.name === "" && fotoCabeza.size === 0 ? null : fotoCabeza,
  });

  if (!parsed.success) {
    return {
      values,
      errors: parsed.error.flatten().fieldErrors,
      message: "Revisa los campos del proyecto.",
    };
  }

  for (const field of ["foto", "foto_cabeza"] as const) {
    const file = parsed.data[field];
    if (!file) continue;
    let message: string | null;
    try {
      message = await validateProyectoImageContent(file);
    } catch (error) {
      console.error("[crearProyecto] No se pudo leer la imagen:", error instanceof Error ? error.name : "unknown");
      return { values, message: "No se pudo leer la imagen. Selecciona el archivo nuevamente." };
    }
    if (message) return { values, errors: { [field]: [message] }, message: "Revisa las imagenes del proyecto." };
  }

  let response: Response;
  const body = new FormData();
  body.set("nombre", parsed.data.nombre);
  if (parsed.data.descripcion) body.set("descripcion", parsed.data.descripcion);
  body.set("fecha_creacion", parsed.data.fecha_creacion);
  if (parsed.data.foto) body.set("foto", parsed.data.foto);
  if (parsed.data.foto_cabeza) body.set("foto_cabeza", parsed.data.foto_cabeza);
  try {
    response = await requestProyectos("/fundaciones/proyectos/crear", {
      method: "POST",
      body,
    });
  } catch (error) {
    return {
      values,
      message: error instanceof Error
        ? error.message
        : "No se pudo crear el proyecto. Intenta de nuevo.",
    };
  }

  if (!response.ok) {
    console.error("[crearProyecto] El servicio rechazo la creacion:", response.status);
    return {
      values,
      message: response.status === 401 || response.status === 403
        ? "No autorizado. Inicia sesion con tu cuenta de fundacion."
        : response.status === 413
          ? "La carga supera el limite permitido. Usa imagenes de hasta 2 MB."
        : response.status === 422
          ? "El servicio rechazo los datos del proyecto. Revisa el formulario."
          : "No se pudo crear el proyecto. Intenta de nuevo.",
    };
  }

  revalidatePath("/proyectos");
  redirect("/proyectos?creado=1");
}
