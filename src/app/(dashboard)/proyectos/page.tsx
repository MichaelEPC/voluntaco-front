import Link from "next/link";
import ProjectPhoto from "@/components/proyectos/ProjectPhoto";
import { getProyectosFundacion } from "@/lib/data/proyectos";

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: Promise<{ creado?: string }>;
}) {
  const [proyectos, query] = await Promise.all([getProyectosFundacion(), searchParams]);

  return (
    <div className="grid gap-3">
      <header className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] p-4">
        <div className="min-w-0">
          <p className="section-kicker">Proyectos de la fundacion</p>
          <h1 className="mt-2 font-display text-3xl leading-none">Mis proyectos</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Conoce y presenta las iniciativas de tu fundacion.
          </p>
        </div>
        <Link href="/proyectos/nuevo" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)]">
          <span aria-hidden="true">+</span> Añadir proyecto
        </Link>
      </header>

      {query.creado === "1" && (
        <p role="status" className="rounded-2xl bg-[var(--color-surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
          Proyecto creado correctamente.
        </p>
      )}

      {proyectos.length === 0 ? (
        <section className="glass-panel flex flex-col items-center rounded-[1.75rem] px-5 py-10 text-center">
          <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-strong)] text-2xl text-[var(--color-accent)]">+</span>
          <h2 className="mt-4 font-display text-2xl">Aun no tienes proyectos</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--color-muted)]">
            Añade tu primera iniciativa para compartir su informacion.
          </p>
          <Link href="/proyectos/nuevo" className="mt-4 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)]">
            Añadir primer proyecto
          </Link>
        </section>
      ) : (
        <section aria-label="Lista de proyectos" className="grid gap-3">
          <p className="px-2 text-xs text-[var(--color-muted)]">
            {proyectos.length} {proyectos.length === 1 ? "proyecto" : "proyectos"}
          </p>
          <ul className="grid gap-3">
            {proyectos.map((proyecto) => (
              <li key={proyecto.id}>
                <Link href={`/proyectos/${proyecto.id}`} className="card-hover glass-panel flex min-w-0 items-start gap-3 rounded-[1.5rem] p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
                  <ProjectPhoto
                    url={proyecto.foto_url || proyecto.foto_cabeza_url || null}
                    name={proyecto.nombre}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold break-words">{proyecto.nombre}</h2>
                      <span className="app-chip rounded-full px-2.5 py-1 text-xs break-words">
                        {proyecto.estado.replaceAll("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 break-words text-[var(--color-muted)]">
                      {proyecto.descripcion || "Este proyecto aun no tiene descripcion."}
                    </p>
                    <p className="mt-2 text-xs text-[var(--color-muted)]">
                      Creado el {new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(proyecto.fecha_creacion))}
                    </p>
                    <span className="mt-2 inline-block text-xs font-semibold text-[var(--color-accent)]">Ver proyecto →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
