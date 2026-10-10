"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { crearVoluntariado, actualizarVoluntariado, eliminarVoluntariado } from "@/lib/actions/voluntariados";
import SubmitButton from "@/components/ui/SubmitButton";
import type { Voluntariado, Modalidad, VoluntarioRol, VoluntariadoEstado, Habilidad } from "@/types";
import type { VoluntariadoFormState } from "@/lib/validations/voluntariado";

// ── Display helpers ──────────────────────────────────────────────────────────

const ESTADO_CONFIG: Record<
  VoluntariadoEstado,
  { label: string; dot: string; text: string; bg: string }
> = {
  ABIERTO: {
    label: "Abierto",
    dot: "status-dot",
    text: "text-[var(--color-accent)]",
    bg: "bg-[rgba(32,162,107,0.08)]",
  },
  EN_PROGRESO: {
    label: "En progreso",
    dot: "status-dot--warm",
    text: "text-[var(--color-highlight)]",
    bg: "bg-[rgba(242,167,93,0.1)]",
  },
  FINALIZADO: {
    label: "Finalizado",
    dot: "",
    text: "text-[var(--color-muted)]",
    bg: "bg-[rgba(18,53,47,0.05)]",
  },
};

function formatDate(raw: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(raw));
  } catch {
    return raw;
  }
}

// ── Habilidades multi-select picker ─────────────────────────────────────────

function HabilidadesPicker({
  habilidades,
  value,
  onChange,
}: {
  habilidades: Habilidad[];
  value: Habilidad[];
  onChange: (selected: Habilidad[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggle(h: Habilidad) {
    const exists = value.some((v) => v.id === h.id);
    onChange(exists ? value.filter((v) => v.id !== h.id) : [...value, h]);
  }

  const label =
    value.length === 0
      ? "Selecciona habilidades..."
      : value.length === 1
        ? value[0].nombre
        : `${value.length} habilidades seleccionadas`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-left text-sm outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
      >
        <span className={value.length === 0 ? "text-[var(--color-muted)]" : "text-[var(--color-ink)]"}>
          {label}
        </span>
        <span
          aria-hidden="true"
          className={`ml-2 shrink-0 text-[var(--color-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-52 overflow-y-auto rounded-[1.1rem] border border-[var(--color-line)] bg-white shadow-[0_12px_40px_rgba(18,53,47,0.12)]">
          {habilidades.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[var(--color-muted)]">Sin opciones disponibles</p>
          ) : (
            habilidades.map((h) => {
              const checked = value.some((v) => v.id === h.id);
              return (
                <label
                  key={h.id}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(h)}
                    className="h-4 w-4 rounded accent-[var(--color-accent)]"
                  />
                  {h.nombre}
                </label>
              );
            })
          )}
        </div>
      )}

      {/* Selected tags */}
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.map((h) => (
            <span
              key={h.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(32,162,107,0.1)] px-2.5 py-1 text-xs font-medium text-[var(--color-accent)]"
            >
              {h.nombre}
              <button
                type="button"
                onClick={() => toggle(h)}
                aria-label={`Quitar ${h.nombre}`}
                className="leading-none text-[var(--color-accent)] opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-[var(--color-line)] bg-white/50 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-strong)] text-3xl">
        📋
      </div>
      <h2 className="mt-5 font-display text-3xl leading-none text-[var(--color-ink)]">
        Aún no hay voluntariados
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--color-muted)]">
        No has publicado ningún voluntariado todavía. Crea tu primera
        convocatoria y empieza a recibir postulaciones.
      </p>
      <button
        onClick={onOpen}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.24)]"
      >
        <span aria-hidden="true">+</span>
        Crear voluntariado
      </button>
    </div>
  );
}

// ── Card options menu ────────────────────────────────────────────────────────

function CardMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position dropdown relative to the trigger button using fixed coords,
  // so it escapes any transform stacking context on the card.
  function openMenu() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
    setOpen(true);
  }

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setOpen(false);
    }
    function handleScroll() { setOpen(false); }
    if (open) {
      document.addEventListener("mousedown", handleOutside);
      window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [open]);

  const dropdown = open && dropdownStyle ? createPortal(
    <div
      ref={dropdownRef}
      role="menu"
      style={{ top: dropdownStyle.top, right: dropdownStyle.right }}
      className="fixed z-[9999] w-44 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-[0_12px_40px_rgba(18,53,47,0.13)]"
    >
      <button
        role="menuitem"
        type="button"
        onClick={() => { setOpen(false); onEdit(); }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-strong)]"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9.5 1.5 12.5 4.5 4.5 12.5H1.5V9.5L9.5 1.5Z" />
        </svg>
        Editar
      </button>

      <div className="mx-3 h-px bg-[var(--color-line)]" />

      <button
        role="menuitem"
        type="button"
        onClick={() => { setOpen(false); onDelete(); }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--color-danger)] transition-colors hover:bg-[rgba(236,106,95,0.06)]"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1.5 3.5H12.5M5 3.5V2H9V3.5M3 3.5L3.5 12H10.5L11 3.5" />
        </svg>
        Eliminar
      </button>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-label="Más opciones"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-ink)]"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" aria-hidden="true">
          <circle cx="7.5" cy="2.5" r="1.4" />
          <circle cx="7.5" cy="7.5" r="1.4" />
          <circle cx="7.5" cy="12.5" r="1.4" />
        </svg>
      </button>
      {dropdown}
    </>
  );
}

// ── Delete confirmation modal ────────────────────────────────────────────────

function DeleteModal({
  nombre,
  onClose,
  onConfirm,
  deleting,
  error,
}: {
  nombre: string;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
  error: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => { if (!deleting) onClose(); }}
        aria-hidden="true"
      />
      <div className="glass-panel relative w-full max-w-sm rounded-[1.75rem] p-6 shadow-[0_28px_80px_rgba(18,53,47,0.2)]">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(236,106,95,0.1)]">
          <svg width="22" height="22" viewBox="0 0 14 14" fill="none" stroke="var(--color-danger)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1.5 3.5H12.5M5 3.5V2H9V3.5M3 3.5L3.5 12H10.5L11 3.5" />
          </svg>
        </div>

        <h3 className="mt-4 font-display text-2xl leading-tight text-[var(--color-ink)]">
          Eliminar voluntariado
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          ¿Estás seguro de que deseas eliminar{" "}
          <span className="font-semibold text-[var(--color-ink)]">{nombre}</span>?
          Esta acción no se puede deshacer.
        </p>

        {error && (
          <div className="mt-4 rounded-[1rem] border border-[var(--color-danger)]/25 bg-[rgba(236,106,95,0.06)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-full bg-[var(--color-danger)] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(236,106,95,0.3)] disabled:opacity-60"
          >
            {deleting ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Voluntariado card ────────────────────────────────────────────────────────

function VoluntariadoCard({
  v,
  modalidades,
  voluntariosRoles,
  habilidades,
}: {
  v: Voluntariado;
  modalidades: Modalidad[];
  voluntariosRoles: VoluntarioRol[];
  habilidades: Habilidad[];
}) {
  const router = useRouter();
  const estado = ESTADO_CONFIG[v.estado] ?? ESTADO_CONFIG.ABIERTO;
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    const result = await eliminarVoluntariado(v.id);
    if (result.success) {
      router.refresh();
    } else {
      setDeleteError(result.message ?? "Error al eliminar.");
      setDeleting(false);
    }
  }

  function openDeleteModal() {
    setDeleteError(null);
    setConfirmOpen(true);
  }

  function closeDeleteModal() {
    if (!deleting) {
      setConfirmOpen(false);
      setDeleteError(null);
    }
  }

  return (
    <>
      <article className="card-hover glass-panel grid gap-4 rounded-[1.8rem] p-5 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${estado.text} ${estado.bg}`}
            >
              {estado.dot && <span className={estado.dot} />}
              {estado.label}
            </span>
            {v.modalidad && (
              <span className="app-chip rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
                {v.modalidad}
              </span>
            )}
          </div>

          <h3 className="mt-3 font-display text-2xl leading-tight text-[var(--color-ink)]">
            {v.nombre}
          </h3>

          {v.descripcion && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
              {v.descripcion}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
            {v.rol_voluntario && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">👤</span>
                {v.rol_voluntario}
              </span>
            )}
            {v.postulaciones_count !== undefined && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">📨</span>
                {v.postulaciones_count} postulante
                {v.postulaciones_count !== 1 ? "s" : ""}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span aria-hidden="true">📅</span>
              {formatDate(v.fecha_creacion)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:justify-center">
          <button className="rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_8px_20px_rgba(32,162,107,0.22)]">
            Ver detalles
          </button>
          <CardMenu onEdit={() => setEditOpen(true)} onDelete={openDeleteModal} />
        </div>
      </article>

      {editOpen && (
        <EditModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          v={v}
          modalidades={modalidades}
          voluntariosRoles={voluntariosRoles}
          habilidades={habilidades}
        />
      )}

      {confirmOpen && (
        <DeleteModal
          nombre={v.nombre}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          deleting={deleting}
          error={deleteError}
        />
      )}
    </>
  );
}

// ── Edit modal ──────────────────────────────────────────────────────────────

function EditModal({
  isOpen,
  onClose,
  v,
  modalidades,
  voluntariosRoles,
  habilidades: allHabilidades,
}: {
  isOpen: boolean;
  onClose: () => void;
  v: Voluntariado;
  modalidades: Modalidad[];
  voluntariosRoles: VoluntarioRol[];
  habilidades: Habilidad[];
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(v.nombre);
  const [descripcion, setDescripcion] = useState(v.descripcion ?? "");
  const [modalidadId, setModalidadId] = useState<string>(() => {
    if (v.modalidad_id != null) return String(v.modalidad_id);
    const found = modalidades.find((m) => m.nombre === v.modalidad);
    return found ? String(found.id) : "";
  });
  const [rolId, setRolId] = useState<string>(() => {
    if (v.usuario_rol_id != null) return String(v.usuario_rol_id);
    const found = voluntariosRoles.find((r) => r.nombre === v.rol_voluntario);
    return found ? String(found.id) : "";
  });
  const [selectedHabilidades, setSelectedHabilidades] = useState<Habilidad[]>(
    v.habilidades ?? [],
  );
  const [state, action] = useActionState<VoluntariadoFormState, FormData>(
    actualizarVoluntariado.bind(null, v.id),
    {},
  );

  // Sync all controlled fields whenever the modal opens for a (potentially different) card
  useEffect(() => {
    if (isOpen) {
      setNombre(v.nombre);
      setDescripcion(v.descripcion ?? "");

      // Prefer the numeric ID field; fall back to matching by name in the catalogue
      if (v.modalidad_id != null) {
        setModalidadId(String(v.modalidad_id));
      } else {
        const found = modalidades.find((m) => m.nombre === v.modalidad);
        setModalidadId(found ? String(found.id) : "");
      }

      if (v.usuario_rol_id != null) {
        setRolId(String(v.usuario_rol_id));
      } else {
        const found = voluntariosRoles.find((r) => r.nombre === v.rol_voluntario);
        setRolId(found ? String(found.id) : "");
      }

      setSelectedHabilidades(v.habilidades ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, v.id]);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="glass-panel relative w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] p-6 shadow-[0_-20px_80px_rgba(18,53,47,0.2)] sm:max-h-[90vh] sm:rounded-[1.75rem] sm:shadow-[0_28px_100px_rgba(18,53,47,0.2)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Modificar convocatoria</p>
            <h2 className="mt-2 font-display text-3xl leading-none text-[var(--color-ink)]">
              Editar voluntariado
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)]"
          >
            ✕
          </button>
        </div>

        {/* Error message */}
        {state.message && (
          <div className="mt-4 rounded-[1.1rem] border border-[var(--color-danger)]/25 bg-[rgba(236,106,95,0.06)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {state.message}
          </div>
        )}

        {/* Form */}
        <form action={action} className="mt-5 grid gap-4">
          {/* Nombre */}
          <div className="grid gap-1.5">
            <label
              htmlFor="edit-nombre"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
            >
              Nombre <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              id="edit-nombre"
              name="nombre"
              type="text"
              required
              maxLength={100}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>

          {/* Descripcion */}
          <div className="grid gap-1.5">
            <label
              htmlFor="edit-descripcion"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
            >
              Descripcion
            </label>
            <textarea
              id="edit-descripcion"
              name="descripcion"
              rows={4}
              maxLength={2000}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="resize-none rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>

          {/* Modalidad + Rol */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label
                htmlFor="edit-modalidad_id"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                Modalidad
              </label>
              <select
                id="edit-modalidad_id"
                name="modalidad_id"
                value={modalidadId}
                onChange={(e) => setModalidadId(e.target.value)}
                className="rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              >
                <option value="">Selecciona...</option>
                {modalidades.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="edit-usuario_rol_id"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                Perfil buscado
              </label>
              <select
                id="edit-usuario_rol_id"
                name="usuario_rol_id"
                value={rolId}
                onChange={(e) => setRolId(e.target.value)}
                className="rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              >
                <option value="">Selecciona...</option>
                {voluntariosRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Habilidades requeridas */}
          <div className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Habilidades requeridas
            </span>
            <input
              type="hidden"
              name="habilidades"
              value={JSON.stringify(selectedHabilidades)}
              readOnly
            />
            <HabilidadesPicker
              habilidades={allHabilidades}
              value={selectedHabilidades}
              onChange={setSelectedHabilidades}
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Cancelar
            </button>
            <SubmitButton
              label="Guardar cambios"
              pendingLabel="Guardando..."
              className="flex-1 rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.24)] disabled:opacity-60"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Create modal ─────────────────────────────────────────────────────────────

function CreateModal({
  isOpen,
  onClose,
  fundacionId,
  modalidades,
  voluntariosRoles,
  habilidades,
}: {
  isOpen: boolean;
  onClose: () => void;
  fundacionId: string;
  modalidades: Modalidad[];
  voluntariosRoles: VoluntarioRol[];
  habilidades: Habilidad[];
}) {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const [selectedHabilidades, setSelectedHabilidades] = useState<Habilidad[]>([]);
  const [state, action] = useActionState<VoluntariadoFormState, FormData>(
    crearVoluntariado.bind(null, fundacionId),
    {},
  );

  useEffect(() => {
    if (state.success) {
      onClose();
      setFormKey((k) => k + 1);
      setSelectedHabilidades([]);
      router.refresh();
    }
  }, [state.success, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="glass-panel relative w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] p-6 shadow-[0_-20px_80px_rgba(18,53,47,0.2)] sm:max-h-[90vh] sm:rounded-[1.75rem] sm:shadow-[0_28px_100px_rgba(18,53,47,0.2)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Nueva convocatoria</p>
            <h2 className="mt-2 font-display text-3xl leading-none text-[var(--color-ink)]">
              Crear voluntariado
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)]"
          >
            ✕
          </button>
        </div>

        {/* Error message */}
        {state.message && (
          <div className="mt-4 rounded-[1.1rem] border border-[var(--color-danger)]/25 bg-[rgba(236,106,95,0.06)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {state.message}
          </div>
        )}

        {/* Form */}
        <form key={formKey} action={action} className="mt-5 grid gap-4">
          {/* Nombre */}
          <div className="grid gap-1.5">
            <label
              htmlFor="nombre"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
            >
              Nombre <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              maxLength={200}
              placeholder="Ej. Educación ambiental en colegios"
              className="rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>

          {/* Descripcion */}
          <div className="grid gap-1.5">
            <label
              htmlFor="descripcion"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
            >
              Descripcion
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              maxLength={2000}
              placeholder="Describe el voluntariado, objetivos y perfil buscado..."
              className="resize-none rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
            />
          </div>

          {/* Modalidad + Rol */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label
                htmlFor="modalidad_id"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                Modalidad
              </label>
              <select
                id="modalidad_id"
                name="modalidad_id"
                className="rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              >
                <option value="">Selecciona...</option>
                {modalidades.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="usuario_rol_id"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                Perfil buscado
              </label>
              <select
                id="usuario_rol_id"
                name="usuario_rol_id"
                className="rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
              >
                <option value="">Selecciona...</option>
                {voluntariosRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Habilidades requeridas */}
          <div className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Habilidades requeridas
            </span>
            {/* Hidden input carries the JSON-stringified selection */}
            <input
              type="hidden"
              name="habilidades"
              value={selectedHabilidades.length > 0 ? JSON.stringify(selectedHabilidades) : ""}
              readOnly
            />
            <HabilidadesPicker
              habilidades={habilidades}
              value={selectedHabilidades}
              onChange={setSelectedHabilidades}
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Cancelar
            </button>
            <SubmitButton
              label="Crear voluntariado"
              pendingLabel="Creando..."
              className="flex-1 rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.24)] disabled:opacity-60"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────

interface VoluntariadosViewProps {
  fundacionId: string;
  voluntariados: Voluntariado[];
  modalidades: Modalidad[];
  voluntariosRoles: VoluntarioRol[];
  habilidades: Habilidad[];
}

export default function VoluntariadosView({
  fundacionId,
  voluntariados,
  modalidades,
  voluntariosRoles,
  habilidades,
}: VoluntariadosViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const counts = {
    total: voluntariados.length,
    abiertos: voluntariados.filter((v) => v.estado === "ABIERTO").length,
    en_progreso: voluntariados.filter((v) => v.estado === "EN_PROGRESO").length,
    finalizados: voluntariados.filter((v) => v.estado === "FINALIZADO").length,
  };

  return (
    <>
      <main className="relative overflow-hidden px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-5xl">
          <section className="shell-panel soft-grid relative overflow-hidden rounded-[2rem] p-3 sm:p-4 lg:p-5">
            <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-4">

              {/* Page header */}
              <header className="glass-panel rounded-[1.75rem] px-5 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="section-kicker">Gestion de convocatorias</p>
                    <h1 className="mt-2 font-display text-4xl leading-none tracking-[-0.04em] text-[var(--color-ink)]">
                      Mis voluntariados
                    </h1>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      Crea y administra tus convocatorias de voluntariado.
                    </p>
                  </div>
                  <button
                    onClick={openModal}
                    className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.24)] sm:self-auto"
                  >
                    <span aria-hidden="true">+</span>
                    Crear voluntariado
                  </button>
                </div>

                {/* Summary stats (only when there's data) */}
                {counts.total > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Total", value: counts.total },
                      { label: "Abiertos", value: counts.abiertos },
                      { label: "En progreso", value: counts.en_progreso },
                      { label: "Finalizados", value: counts.finalizados },
                    ].map((s) => (
                      <div key={s.label} className="metric-card rounded-[1.2rem] p-3 text-center">
                        <p className="font-display text-3xl text-[var(--color-ink)]">{s.value}</p>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </header>

              {/* List or empty state */}
              {voluntariados.length === 0 ? (
                <EmptyState onOpen={openModal} />
              ) : (
                <div className="flex flex-col gap-4">
                  {voluntariados.map((v) => (
                    <VoluntariadoCard
                      key={v.id}
                      v={v}
                      modalidades={modalidades}
                      voluntariosRoles={voluntariosRoles}
                      habilidades={habilidades}
                    />
                  ))}
                </div>
              )}

            </div>
          </section>
        </div>
      </main>

      <CreateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        fundacionId={fundacionId}
        modalidades={modalidades}
        voluntariosRoles={voluntariosRoles}
        habilidades={habilidades}
      />
    </>
  );
}
