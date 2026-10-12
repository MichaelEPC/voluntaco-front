"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { crearProyecto } from "@/lib/actions/proyectos";
import type { ProyectoFormState } from "@/lib/validations/proyecto";
import SubmitButton from "@/components/ui/SubmitButton";
import ProjectImageField, { type ProjectImageSelection } from "@/components/proyectos/ProjectImageField";

const initialState: ProyectoFormState = {};
const inputClass =
  "w-full min-w-0 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-base text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 disabled:opacity-60";

export default function ProyectoForm() {
  const [foto, setFoto] = useState<ProjectImageSelection>({ file: null, error: null });
  const [fotoCabeza, setFotoCabeza] = useState<ProjectImageSelection>({ file: null, error: null });
  const [state, formAction, pending] = useActionState(
    async (previous: ProyectoFormState, data: FormData): Promise<ProyectoFormState> => {
      if (foto.error || fotoCabeza.error) {
        return {
          message: "Revisa las imagenes del proyecto.",
          values: {
            nombre: String(data.get("nombre") ?? ""),
            descripcion: String(data.get("descripcion") ?? ""),
            fecha_creacion: String(data.get("fecha_creacion") ?? ""),
          },
          errors: {
            foto: foto.error ? [foto.error] : undefined,
            foto_cabeza: fotoCabeza.error ? [fotoCabeza.error] : undefined,
          },
        };
      }
      data.delete("foto");
      data.delete("foto_cabeza");
      if (foto.file) data.set("foto", foto.file);
      if (fotoCabeza.file) data.set("foto_cabeza", fotoCabeza.file);
      return crearProyecto(previous, data);
    },
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-3" noValidate>
      {state.message && (
        <p role="alert" className="rounded-2xl border border-[var(--color-danger)]/25 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-ink)]">
          {state.message}
        </p>
      )}

      <div className="grid gap-1.5">
        <label htmlFor="proyecto-nombre" className="text-sm font-semibold">
          Nombre del proyecto <span className="text-[var(--color-muted)]">(obligatorio)</span>
        </label>
        <input
          id="proyecto-nombre"
          name="nombre"
          type="text"
          required
          maxLength={150}
          defaultValue={state.values?.nombre}
          disabled={pending}
          aria-invalid={Boolean(state.errors?.nombre)}
          aria-describedby={state.errors?.nombre ? "proyecto-nombre-error" : undefined}
          className={inputClass}
          placeholder="Ej. Recuperacion de espacios verdes"
        />
        {state.errors?.nombre && (
          <p id="proyecto-nombre-error" className="text-xs text-[var(--color-danger)]">
            {state.errors.nombre.join(" ")}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="proyecto-descripcion" className="text-sm font-semibold">
          Descripcion <span className="text-[var(--color-muted)]">(opcional)</span>
        </label>
        <textarea
          id="proyecto-descripcion"
          name="descripcion"
          rows={4}
          defaultValue={state.values?.descripcion}
          disabled={pending}
          aria-invalid={Boolean(state.errors?.descripcion)}
          aria-describedby={state.errors?.descripcion ? "proyecto-descripcion-error" : undefined}
          className={`${inputClass} resize-y`}
          placeholder="Cuenta de que trata el proyecto y que busca lograr."
        />
        {state.errors?.descripcion && (
          <p id="proyecto-descripcion-error" className="text-xs text-[var(--color-danger)]">
            {state.errors.descripcion.join(" ")}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="proyecto-fecha" className="text-sm font-semibold">
          Fecha de creacion <span className="text-[var(--color-muted)]">(obligatorio)</span>
        </label>
        <input
          id="proyecto-fecha"
          name="fecha_creacion"
          type="date"
          required
          max={new Date().toISOString().slice(0, 10)}
          defaultValue={state.values?.fecha_creacion}
          disabled={pending}
          aria-invalid={Boolean(state.errors?.fecha_creacion)}
          aria-describedby={`proyecto-fecha-help${state.errors?.fecha_creacion ? " proyecto-fecha-error" : ""}`}
          className={inputClass}
        />
        <p id="proyecto-fecha-help" className="text-xs leading-5 text-[var(--color-muted)]">
          Selecciona hoy o una fecha anterior. Se envia a las 00:00 UTC.
        </p>
        {state.errors?.fecha_creacion && (
          <p id="proyecto-fecha-error" className="text-xs text-[var(--color-danger)]">
            {state.errors.fecha_creacion.join(" ")}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ProjectImageField name="foto" label="Foto principal" selection={foto} onChange={setFoto} disabled={pending} errors={state.errors?.foto} />
        <ProjectImageField name="foto_cabeza" label="Foto de encabezado" selection={fotoCabeza} onChange={setFotoCabeza} disabled={pending} errors={state.errors?.foto_cabeza} />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link href="/proyectos" className="rounded-full border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm font-semibold">
          Cancelar
        </Link>
        <SubmitButton
          label="Crear proyecto"
          pendingLabel="Creando proyecto..."
          className="rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </form>
  );
}
