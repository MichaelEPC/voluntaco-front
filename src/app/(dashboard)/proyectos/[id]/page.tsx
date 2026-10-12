import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getProyectoFundacion } from "@/lib/data/proyectos";
import ProjectPhoto from "@/components/proyectos/ProjectPhoto";
import { proyectoIdSchema } from "@/lib/validations/proyecto";

export default async function ProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = proyectoIdSchema.safeParse(id);
  if (!parsedId.success) notFound();

  const [proyecto, session] = await Promise.all([
    getProyectoFundacion(parsedId.data),
    getSession(),
  ]);
  if (!proyecto) notFound();

  const fecha = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(proyecto.fecha_creacion));

  return (
    <div className="grid gap-3">
      <Link href="/proyectos" className="px-2 py-1 text-sm font-semibold text-[var(--color-accent)]">
        ← Volver a proyectos
      </Link>

      <header className="glass-panel overflow-hidden rounded-[1.75rem]">
        <ProjectPhoto url={proyecto.foto_cabeza_url ?? null} name={proyecto.nombre} variant="cover" />
        <div className="relative px-4 pb-3 sm:px-6">
          <div className="relative -mt-6 mb-3 w-fit">
            <ProjectPhoto url={proyecto.foto_url} name={proyecto.nombre} variant="avatar" />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="section-kicker">Perfil del proyecto</p>
              <h1 className="mt-2 font-display text-2xl leading-tight break-words sm:text-3xl">{proyecto.nombre}</h1>
              <p className="mt-1 text-sm break-words text-[var(--color-muted)]">
                Una iniciativa de {session?.name}
              </p>
            </div>
            <span className="app-chip rounded-full px-3 py-1.5 text-xs font-semibold break-words">
              {proyecto.estado.replaceAll("_", " ")}
            </span>
          </div>
        </div>
      </header>

      <div className="grid items-start gap-3 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="metric-card rounded-[1.75rem] p-3">
          <h2 className="font-display text-lg font-semibold">Informacion</h2>
          <dl className="mt-3 grid gap-3 text-sm">
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Fundacion</dt>
              <dd className="mt-1 font-semibold break-words">{session?.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Fecha de creacion</dt>
              <dd className="mt-1">{fecha}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Estado</dt>
              <dd className="mt-1 break-words">{proyecto.estado.replaceAll("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-muted)]">ID del proyecto</dt>
              <dd className="mt-1 break-all">{proyecto.id}</dd>
            </div>
          </dl>
        </aside>

        <section className="glass-panel min-w-0 rounded-[1.75rem] p-4 sm:p-5">
          <p className="section-kicker">Nuestra iniciativa</p>
          <h2 className="mt-2 font-display text-xl font-semibold">Acerca del proyecto</h2>
          <p className="mt-4 text-sm leading-7 whitespace-pre-wrap break-words text-[var(--color-ink-soft)]">
            {proyecto.descripcion || "Esta fundacion aun no ha añadido una descripcion al proyecto."}
          </p>
        </section>
      </div>
    </div>
  );
}
