import { getAccessToken, getSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants/roles";
import { proyectoIdSchema, proyectoSchema } from "@/lib/validations/proyecto";
import type { Proyecto } from "@/types";

export async function requestProyectos(
  path: string,
  options: { method: "GET" | "POST"; body?: string | FormData },
): Promise<Response> {
  const session = await getSession();
  const token = await getAccessToken();

  if (!token || !session || Number(session.role) !== ROLES.FUNDACION) {
    throw new Error("Solo las fundaciones pueden acceder a sus proyectos.");
  }

  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    console.error("[proyectos] API_URL no configurada.");
    throw new Error("El servicio de proyectos no esta disponible.");
  }

  try {
    return await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
      method: options.method,
      body: options.body,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    const timeout = error instanceof Error && error.name === "TimeoutError";
    console.error("[proyectos] Fallo de conexion:", timeout ? "timeout" : "network");
    throw new Error(
      timeout
        ? "El servidor tardo demasiado. Intenta de nuevo."
        : "No se pudo conectar con el servicio de proyectos.",
      { cause: error },
    );
  }
}

async function readProyectoResponse(response: Response): Promise<unknown> {
  if (!response.ok) {
    console.error("[proyectos] Error al consultar proyectos:", response.status);
    throw new Error("No se pudieron cargar los proyectos.");
  }

  try {
    return await response.json();
  } catch (error) {
    console.error("[proyectos] El servicio devolvio JSON invalido.");
    throw new Error("El servicio devolvio una respuesta invalida.", { cause: error });
  }
}

export async function getProyectosFundacion(): Promise<Proyecto[]> {
  const response = await requestProyectos("/fundaciones/proyectos", { method: "GET" });
  const data = await readProyectoResponse(response);
  const parsed = proyectoSchema.array().safeParse(data);

  if (!parsed.success) {
    console.error("[proyectos] Formato invalido del listado.");
    throw new Error("El listado de proyectos tiene un formato invalido.");
  }

  return parsed.data;
}

export async function getProyectoFundacion(id: string): Promise<Proyecto | null> {
  const validatedId = proyectoIdSchema.parse(id);
  const response = await requestProyectos(`/fundaciones/proyectos/${validatedId}`, { method: "POST" });
  if (response.status === 404) return null;

  const data = await readProyectoResponse(response);
  if (data === null) return null;

  const parsed = proyectoSchema.safeParse(data);
  if (!parsed.success || parsed.data.id.toLowerCase() !== validatedId.toLowerCase()) {
    console.error("[proyectos] Formato invalido del detalle.");
    throw new Error("La informacion del proyecto tiene un formato invalido.");
  }

  return parsed.data;
}
