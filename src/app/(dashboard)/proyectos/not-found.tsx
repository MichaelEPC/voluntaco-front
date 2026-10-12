import Link from "next/link";

export default function ProyectoNotFound() {
  return (
    <section className="glass-panel rounded-[1.75rem] px-5 py-10 text-center">
      <h1 className="font-display text-2xl">Proyecto no encontrado</h1>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        El proyecto no existe o no pertenece a tu fundacion.
      </p>
      <Link href="/proyectos" className="mt-5 inline-block rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)]">
        Volver a proyectos
      </Link>
    </section>
  );
}
