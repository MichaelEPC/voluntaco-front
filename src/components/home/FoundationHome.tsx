const notifications = [
  {
    id: 1,
    text: "Ana García se postuló para Educación Ambiental",
    time: "Hace 8 min",
    tone: "status-dot",
  },
  {
    id: 2,
    text: "3 nuevas postulaciones en Reforestación Urbana",
    time: "Hace 42 min",
    tone: "status-dot",
  },
  {
    id: 3,
    text: "Tu voluntariado cierra mañana — quedan 2 cupos",
    time: "Hace 2 horas",
    tone: "status-dot--warm",
  },
  {
    id: 4,
    text: "Perfil de Luis Ramírez revisado",
    time: "Hace 5 horas",
    tone: "status-dot",
  },
  {
    id: 5,
    text: "12 nuevos seguidores esta semana",
    time: "Ayer",
    tone: "status-dot--warm",
  },
];

const stats = [
  { value: "124", label: "Voluntarios activos", symbol: "👤" },
  { value: "8", label: "Voluntariados publicados", symbol: "📋" },
  { value: "340", label: "Seguidores", symbol: "⭐" },
];

const recentApplicants = [
  {
    name: "Ana García",
    role: "Educadora Ambiental",
    match: "94%",
    time: "Hace 8 min",
    initials: "AG",
  },
  {
    name: "Carlos Medina",
    role: "Diseñador Gráfico",
    match: "87%",
    time: "Hace 1 hora",
    initials: "CM",
  },
  {
    name: "Sofía Herrera",
    role: "Trabajadora Social",
    match: "79%",
    time: "Hace 3 horas",
    initials: "SH",
  },
];

const activeVoluntariados = [
  {
    title: "Educación ambiental en colegios",
    applicants: 12,
    spots: 5,
    cause: "Educación",
  },
  {
    title: "Reforestación Urbana — Zona Norte",
    applicants: 8,
    spots: 3,
    cause: "Medio ambiente",
  },
  {
    title: "Apoyo en comedor comunitario",
    applicants: 4,
    spots: 8,
    cause: "Ayuda social",
  },
];

export default function FoundationHome({ name }: { name: string }) {
  return (
    <main className="relative overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="shell-panel soft-grid relative overflow-hidden rounded-[2rem] p-3">
          <div className="dashboard-content grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">

            {/* Izquierda: barra lateral de notificaciones */}
            <aside className="glass-panel hidden rounded-[1.75rem] p-4 lg:flex lg:flex-col">
              <p className="section-kicker">Notificaciones</p>
              <h2 className="mt-2 font-display text-xl leading-none text-[var(--color-ink)]">
                Actividad reciente
              </h2>

              <div className="mt-4 flex flex-1 flex-col gap-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-[1.2rem] border border-[var(--color-line)] bg-white/88 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`${n.tone} mt-1 shrink-0`} />
                      <div>
                        <p className="text-xs leading-5 text-[var(--color-ink)]">{n.text}</p>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-ink)]">
                Ver todas las notificaciones
              </button>
            </aside>

            {/* Derecha: contenido principal */}
            <div className="flex min-w-0 flex-col gap-3">

              {/* Encabezado de búsqueda */}
              <header className="glass-panel rounded-[1.75rem] px-4 py-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--color-muted)]">Hola, {name} 👋</p>
                    <p className="mt-1 font-display text-2xl leading-tight tracking-[-0.04em] text-[var(--color-ink)]">
                      Encontra el voluntario ideal.
                    </p>
                  </div>
                  <form className="flex min-w-0 gap-2 lg:w-[280px] lg:shrink-0" action="#">
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <span aria-hidden="true" className="text-[var(--color-muted)]">⌕</span>
                      <input
                        name="q"
                        type="search"
                        placeholder="Buscar voluntarios por habilidad, ciudad o causa..."
                        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--color-muted)]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.24)]"
                    >
                      Buscar
                    </button>
                  </form>
                </div>
              </header>

              {/* Fila de estadísticas */}
              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((s) => (
                  <div key={s.label} className="metric-card rounded-[1.75rem] px-3 py-2">
                    <p className="text-base">{s.symbol}</p>
                    <p className="mt-1 font-display text-2xl leading-none text-[var(--color-ink)]">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Voluntariados activos + postulantes recientes */}
              <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">

                {/* Voluntariados activos */}
                <section className="glass-panel min-w-0 rounded-[1.75rem] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="section-kicker">Voluntariados activos</p>
                      <h2 className="mt-1 font-display text-2xl leading-none text-[var(--color-ink)]">
                        Tus publicaciones
                      </h2>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.22)]">
                      <span aria-hidden="true">+</span>
                      Publicar
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {activeVoluntariados.map((v) => (
                      <article
                        key={v.title}
                        className="card-hover glass-panel grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-[1.4rem] p-2.5"
                      >
                        <div>
                          <div className="app-chip inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.08em]">
                            <span className="status-dot" />
                            {v.cause}
                          </div>
                          <h3 className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                            {v.title}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--color-muted)]">
                            {v.applicants} postulantes · {v.spots} cupos disponibles
                          </p>
                        </div>
                        <button className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
                          Ver
                        </button>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Postulantes recientes */}
                <aside className="metric-card flex min-w-0 flex-col rounded-[1.75rem] p-3">
                  <p className="section-kicker">Postulantes recientes</p>
                  <h2 className="mt-1 font-display text-xl leading-none text-[var(--color-ink)]">
                    Nuevas aplicaciones
                  </h2>

                  <div className="mt-3 flex flex-col gap-2">
                    {recentApplicants.map((a) => (
                      <div
                        key={a.name}
                        className="rounded-[1.2rem] border border-[var(--color-line)] bg-white/88 p-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-xs font-bold text-[var(--color-accent)]">
                            {a.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[var(--color-ink)]">{a.name}</p>
                            <p className="text-xs text-[var(--color-muted)]">{a.role}</p>
                          </div>
                          <span className="shrink-0 text-sm font-bold text-[var(--color-accent)]">
                            {a.match}
                          </span>
                        </div>
                        <p className="mt-2 pl-12 text-xs text-[var(--color-muted)]">{a.time}</p>
                      </div>
                    ))}
                  </div>

                  <button className="mt-3 rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-ink)]">
                    Ver todos los postulantes
                  </button>
                </aside>

              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
