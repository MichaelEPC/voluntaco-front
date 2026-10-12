"use client";

import Link from "next/link";

export default function ProyectosError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <section role="alert" className="glass-panel rounded-[1.75rem] px-5 py-10 text-center">
      <h1 className="font-display text-2xl">No se pudieron cargar los proyectos</h1>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        El servicio no esta disponible o devolvio una respuesta invalida. Intenta de nuevo.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button onClick={unstable_retry} className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)]">
          Reintentar
        </button>
        <Link href="/proyectos" className="rounded-full border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm font-semibold">
          Volver a proyectos
        </Link>
      </div>
    </section>
  );
}
