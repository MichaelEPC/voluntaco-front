import Link from "next/link";
import ProyectoForm from "@/components/proyectos/ProyectoForm";

export default function NuevoProyectoPage() {
  return (
    <section className="glass-panel mx-auto w-full max-w-2xl rounded-[1.75rem] p-4 sm:p-5">
      <Link href="/proyectos" className="text-sm font-semibold text-[var(--color-accent)]">
        ← Volver a proyectos
      </Link>
      <p className="section-kicker mt-4">Nueva iniciativa</p>
      <h1 className="mt-2 font-display text-3xl">Añadir proyecto</h1>
      <p className="mt-2 mb-4 text-sm leading-6 text-[var(--color-muted)]">
        Presenta el proyecto de tu fundacion y lo que quieres lograr.
      </p>
      <ProyectoForm />
    </section>
  );
}
