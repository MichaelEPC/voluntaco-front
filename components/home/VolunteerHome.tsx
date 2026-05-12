const searchCategories = ["Fundaciones", "Voluntariados", "Practicas"] as const;

const applications = [
  {
    id: 1,
    foundation: "EcoRaíces",
    role: "Educador Ambiental",
    status: "En revisión",
    tone: "status-dot--warm",
    statusColor: "text-[var(--color-highlight)]",
    dateLabel: "Hace 2 días",
  },
  {
    id: 2,
    foundation: "Banco de Alimentos",
    role: "Asistente Logístico",
    status: "Aprobado",
    tone: "status-dot",
    statusColor: "text-[var(--color-accent)]",
    dateLabel: "Hace 5 días",
  },
  {
    id: 3,
    foundation: "Fundación Leer",
    role: "Voluntario Lector",
    status: "Pendiente",
    tone: "status-dot--warm",
    statusColor: "text-[var(--color-highlight)]",
    dateLabel: "Hace 1 semana",
  },
  {
    id: 4,
    foundation: "Ayuda Urbana",
    role: "Coordinador de Eventos",
    status: "Rechazado",
    tone: "status-dot--danger",
    statusColor: "text-[var(--color-danger)]",
    dateLabel: "Hace 2 semanas",
  },
];

const applicationSummary = [
  { count: 4, label: "Total" },
  { count: 1, label: "Aprobadas" },
  { count: 2, label: "En curso" },
];

const recommended = [
  {
    id: 1,
    title: "Educación ambiental en colegios",
    foundation: "EcoRaíces",
    location: "Bogotá",
    type: "Voluntariado",
    duration: "3 meses",
    schedule: "Fines de semana",
    match: "96%",
    cause: "Medio ambiente",
  },
  {
    id: 2,
    title: "Enseñanza de habilidades digitales",
    foundation: "Fundación Tecnos",
    location: "Medellín",
    type: "Práctica",
    duration: "6 meses",
    schedule: "Lun — Vie",
    match: "89%",
    cause: "Educación",
  },
  {
    id: 3,
    title: "Atención en comedor comunitario",
    foundation: "Banco de Alimentos",
    location: "Cali",
    type: "Voluntariado",
    duration: "Indefinido",
    schedule: "Sábados",
    match: "82%",
    cause: "Ayuda social",
  },
];

export default function VolunteerHome({ name }: { name: string }) {
  return (
    <main className="relative overflow-hidden px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <section className="shell-panel soft-grid relative overflow-hidden rounded-[2rem] p-3 sm:p-4 lg:p-5">
          <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-4">

            {/* Search header */}
            <header className="glass-panel rounded-[1.75rem] px-5 py-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">Hola, {name} 👋</p>
                  <p className="mt-1 font-display text-3xl leading-none tracking-[-0.04em] text-[var(--color-ink)] sm:text-4xl">
                    Descubri oportunidades con impacto real.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Category pills */}
                  <div className="flex gap-2">
                    {searchCategories.map((cat, i) => (
                      <span
                        key={cat}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
                          i === 0
                            ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-[0_6px_20px_rgba(32,162,107,0.22)]"
                            : "border border-[var(--color-line)] bg-white text-[var(--color-muted)]"
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Search bar */}
                  <form className="flex gap-3" action="#">
                    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:min-w-[400px]">
                      <span aria-hidden="true" className="text-[var(--color-muted)]">⌕</span>
                      <input
                        name="q"
                        type="search"
                        placeholder="Buscar fundaciones, voluntariados o practicas..."
                        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--color-muted)]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.24)]"
                    >
                      Explorar
                    </button>
                  </form>
                </div>
              </div>
            </header>

            {/* Main grid: recommended + application status */}
            <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">

              {/* Center: Recommended voluntariados */}
              <section className="flex flex-col gap-4">
                <div className="glass-panel rounded-[1.75rem] p-5">
                  <p className="section-kicker">Recomendados para ti</p>
                  <h2 className="mt-2 font-display text-3xl leading-none text-[var(--color-ink)]">
                    Basado en tu perfil
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    Oportunidades alineadas con tus habilidades e intereses.
                  </p>
                </div>

                {recommended.map((r) => (
                  <article
                    key={r.id}
                    className="card-hover glass-panel grid gap-4 rounded-[1.8rem] p-4 sm:p-5 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                        <span>{r.location}</span>
                        <span>·</span>
                        <span>{r.type}</span>
                        <span>·</span>
                        <span>{r.cause}</span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl leading-tight text-[var(--color-ink)]">
                        {r.title}
                      </h3>
                      <p className="mt-1 text-base font-semibold text-[var(--color-accent)]">
                        {r.foundation}
                      </p>
                      <div className="mt-4 grid gap-3 text-sm text-[var(--color-ink)] sm:grid-cols-2">
                        <div className="rounded-[1.1rem] bg-white/75 px-3 py-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Duracion
                          </p>
                          <p className="mt-2 font-medium">{r.duration}</p>
                        </div>
                        <div className="rounded-[1.1rem] bg-white/75 px-3 py-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                            Horario
                          </p>
                          <p className="mt-2 font-medium">{r.schedule}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                          Match
                        </p>
                        <p className="font-display text-3xl leading-none text-[var(--color-accent)]">
                          {r.match}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <button className="rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.22)]">
                          Ver detalles
                        </button>
                        <button className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]">
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              {/* Right: Application status timeline */}
              <aside className="glass-panel flex flex-col rounded-[1.75rem] p-5">
                <p className="section-kicker">Mis postulaciones</p>
                <h2 className="mt-2 font-display text-3xl leading-none text-[var(--color-ink)]">
                  Estado actual
                </h2>

                {/* Summary counts */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {applicationSummary.map((s) => (
                    <div key={s.label} className="metric-card rounded-[1.2rem] p-3 text-center">
                      <p className="font-display text-2xl text-[var(--color-ink)]">{s.count}</p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div className="relative mt-5 flex-1">
                  <div className="absolute bottom-0 left-[1.05rem] top-0 w-px bg-[var(--color-line)]" />

                  {applications.map((a, i) => (
                    <div
                      key={a.id}
                      className={`relative flex gap-4 ${i < applications.length - 1 ? "pb-5" : ""}`}
                    >
                      <div className="relative z-10 flex h-[2.1rem] w-[2.1rem] shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white shadow-sm">
                        <span className={a.tone} />
                      </div>
                      <div className="flex-1 rounded-[1.2rem] border border-[var(--color-line)] bg-white/88 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-ink)]">
                              {a.foundation}
                            </p>
                            <p className="text-xs text-[var(--color-muted)]">{a.role}</p>
                          </div>
                          <p className="shrink-0 text-xs text-[var(--color-muted)]">{a.dateLabel}</p>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`app-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${a.statusColor}`}
                          >
                            <span className={a.tone} />
                            {a.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
                  Ver historial completo
                </button>
              </aside>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
