export default function ProyectosLoading() {
  return (
    <div role="status" className="glass-panel rounded-[1.75rem] p-6">
      <p className="text-sm text-[var(--color-muted)]">Cargando proyectos...</p>
      <div aria-hidden="true" className="mt-4 grid animate-pulse gap-3 motion-reduce:animate-none">
        <div className="h-20 rounded-2xl bg-[var(--color-surface-strong)]" />
        <div className="h-20 rounded-2xl bg-[var(--color-surface-strong)]" />
        <div className="h-20 rounded-2xl bg-[var(--color-surface-strong)]" />
      </div>
    </div>
  );
}
