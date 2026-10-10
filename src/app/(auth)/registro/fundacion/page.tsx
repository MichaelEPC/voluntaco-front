"use client";

import { useActionState, useState } from "react";
import FormToast, { type FormToastData } from "@/components/ui/FormToast";
import LogoMark from "@/components/ui/LogoMark";
import Field from "@/components/ui/Field";
import SubmitButton from "@/components/ui/SubmitButton";
import { registrarFundacion } from "@/lib/actions/registro";
import {
  defaultRegistroFundacionValues,
  REGISTRO_FUNDACION_LIMITS,
  REGISTRO_LIMITS,
  type FormStateFundacion,
  type RegistroFundacionValues,
} from "@/lib/validations/registro";

const initialState: FormStateFundacion = {};

const fieldLabels: Record<keyof RegistroFundacionValues, string> = {
  nombre_legal: "nombre legal",
  nit: "NIT",
  email: "correo electronico",
  password: "contrasena",
};

function getFirstErrorMessage(state: FormStateFundacion) {
  if (state.message) {
    return state.message;
  }

  if (!state.errors) {
    return "No pudimos crear la cuenta. Revisa la informacion e intenta nuevamente.";
  }

  for (const [fieldName, fieldErrors] of Object.entries(state.errors) as Array<
    [keyof RegistroFundacionValues, string[] | undefined]
  >) {
    const firstError = fieldErrors?.[0];

    if (firstError) {
      return `Revisa ${fieldLabels[fieldName]}: ${firstError}.`;
    }
  }

  return "No pudimos crear la cuenta. Revisa la informacion e intenta nuevamente.";
}

export default function RegistroFundacionPage() {
  const [state, formAction, isPending] = useActionState(
    registrarFundacion,
    initialState,
  );
  const [formValues, setFormValues] = useState<RegistroFundacionValues>({
    ...defaultRegistroFundacionValues,
  });
  const [showPassword, setShowPassword] = useState(false);

  const toast: FormToastData | null =
    state && !state.success && state.attemptedAt && (state.message || state.errors)
      ? {
          id: state.attemptedAt,
          title: "Registro rechazado",
          message: getFirstErrorMessage(state),
          tone: "error",
        }
      : null;

  function updateField<K extends keyof RegistroFundacionValues>(
    fieldName: K,
    value: RegistroFundacionValues[K],
  ) {
    setFormValues((current) => ({
      ...current,
      [fieldName]: value,
    }));
  }

  if (state?.success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-surface)] px-4 py-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#12352F]/8 blur-3xl" />

        <div className="glass-panel relative z-10 w-full max-w-lg rounded-[2rem] p-10 shadow-[0_32px_80px_rgba(31,82,66,0.13)]">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <LogoMark compact />
            <span className="font-display text-xl leading-none text-[var(--color-ink)]">Voluntaco</span>
          </div>

          {/* Icon badge */}
          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/12">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="14" fill="var(--color-accent)" fillOpacity="0.15" />
              <path d="M8 14.5l4 4 8-9" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className="mt-5 font-display text-[2.2rem] leading-[0.95] tracking-[-0.05em] text-[var(--color-ink)]">
            Cuenta creada con exito
          </h2>

          {state.values?.email && (
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Enviamos un correo de bienvenida a{" "}
              <span className="font-semibold text-[var(--color-ink)]">{state.values.email}</span>.
            </p>
          )}

          {/* Divider */}
          <div className="my-6 h-px bg-[var(--color-line)]" />

          {/* Next steps */}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Que puedes hacer ahora</p>
          <ul className="mt-4 grid gap-3">
            {[
              { icon: "◎", text: "Publica tu primera convocatoria de voluntariado" },
              { icon: "◉", text: "Completa el perfil de tu fundacion para ganar visibilidad" },
              { icon: "◔", text: "Revisa y gestiona las postulaciones de voluntarios" },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-sm text-[var(--color-accent)]" aria-hidden="true">
                  {icon}
                </span>
                <span className="text-sm leading-6 text-[var(--color-muted)]">{text}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-8 grid gap-3">
            <a
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3.5 text-base font-semibold text-[var(--color-accent-foreground)] shadow-[0_18px_36px_rgba(32,162,107,0.22)] transition hover:brightness-95"
            >
              Iniciar sesion
            </a>
            <a
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-line)] bg-white px-5 py-3.5 text-base font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-strong)]"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <FormToast key={toast?.id ?? "registro-fundacion-toast"} toast={toast} />

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl gap-4 lg:grid-cols-[1fr_560px]">

        {/* Panel izquierdo de marca */}
        <section className="relative hidden overflow-hidden rounded-[2rem] bg-[#12352F] p-8 lg:flex lg:items-center lg:justify-center">
          <div className="absolute inset-y-10 right-10 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-8 left-8 h-32 w-32 rounded-full bg-[var(--color-accent)]/18 blur-3xl" />

          <a href="/login" className="relative z-10 flex flex-col items-center text-center">
            <LogoMark />
            <p className="mt-6 font-display text-5xl leading-none tracking-[-0.05em] text-white">Voluntaco</p>
            <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/60">comunidad en accion</p>
          </a>
        </section>

        {/* Panel derecho — formulario */}
        <section className="glass-panel mx-auto flex w-full max-w-[540px] flex-col justify-center rounded-[1.85rem] px-5 py-7 shadow-[0_28px_80px_rgba(31,82,66,0.14)] sm:px-7 sm:py-9 lg:px-8">
          <div className="mx-auto flex w-full max-w-[420px] flex-col">

            {/* Logo mobile */}
            <div className="flex items-center gap-3 lg:hidden">
              <LogoMark compact />
              <p className="font-display text-2xl leading-none text-[var(--color-ink)]">Voluntaco</p>
            </div>

            <div className="mt-6 lg:mt-0">
              <p className="section-kicker font-bold">Registro</p>
              <h2 className="mt-2 font-display text-[2.2rem] leading-[0.95] tracking-[-0.05em] text-[var(--color-ink)]">
                Crea tu cuenta de fundacion
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Ya tienes cuenta?{" "}
                <a href="/login" className="font-semibold text-[var(--color-accent)] hover:underline">
                  Inicia sesion
                </a>
              </p>
            </div>

            <form action={formAction} className="mt-6 grid gap-3" noValidate>

              {/* Nombre legal */}
              <div className="grid gap-1">
                <Field icon="🏛" invalid={Boolean(state?.errors?.nombre_legal)}>
                  <input
                    type="text"
                    name="nombre_legal"
                    placeholder="Nombre legal de la fundacion"
                    autoComplete="organization"
                    minLength={REGISTRO_FUNDACION_LIMITS.nombreLegal.min}
                    maxLength={REGISTRO_FUNDACION_LIMITS.nombreLegal.max}
                    value={formValues.nombre_legal}
                    onChange={(event) =>
                      updateField("nombre_legal", event.target.value)
                    }
                    disabled={isPending}
                    aria-invalid={Boolean(state?.errors?.nombre_legal)}
                    aria-describedby={state?.errors?.nombre_legal ? "err-nombre-legal" : undefined}
                    className="w-full bg-transparent text-base text-[var(--color-ink)] outline-none placeholder:text-[#8a8f8a] disabled:opacity-50"
                  />
                </Field>
                {state?.errors?.nombre_legal && (
                  <p id="err-nombre-legal" className="pl-4 text-xs text-[var(--color-danger)]">
                    {state.errors.nombre_legal[0]}
                  </p>
                )}
              </div>

              {/* NIT */}
              <div className="grid gap-1">
                <Field icon="🪪" invalid={Boolean(state?.errors?.nit)}>
                  <input
                    type="text"
                    name="nit"
                    placeholder="NIT (9-10 digitos)"
                    autoComplete="off"
                    inputMode="numeric"
                    minLength={REGISTRO_FUNDACION_LIMITS.nit.min}
                    maxLength={REGISTRO_FUNDACION_LIMITS.nit.max}
                    value={formValues.nit}
                    onChange={(event) =>
                      updateField(
                        "nit",
                        event.target.value.replace(/\D/g, "").slice(0, REGISTRO_FUNDACION_LIMITS.nit.max),
                      )
                    }
                    disabled={isPending}
                    aria-invalid={Boolean(state?.errors?.nit)}
                    aria-describedby={state?.errors?.nit ? "err-nit" : undefined}
                    className="w-full bg-transparent text-base text-[var(--color-ink)] outline-none placeholder:text-[#8a8f8a] disabled:opacity-50"
                  />
                </Field>
                {state?.errors?.nit && (
                  <p id="err-nit" className="pl-4 text-xs text-[var(--color-danger)]">
                    {state.errors.nit[0]}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-1">
                <Field icon="◔" invalid={Boolean(state?.errors?.email)}>
                  <input
                    type="email"
                    name="email"
                    placeholder="correo@fundacion.org"
                    autoComplete="email"
                    minLength={REGISTRO_LIMITS.email.min}
                    maxLength={REGISTRO_LIMITS.email.max}
                    value={formValues.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    disabled={isPending}
                    aria-invalid={Boolean(state?.errors?.email)}
                    aria-describedby={state?.errors?.email ? "err-email" : undefined}
                    className="w-full bg-transparent text-base text-[var(--color-ink)] outline-none placeholder:text-[#8a8f8a] disabled:opacity-50"
                  />
                </Field>
                {state?.errors?.email && (
                  <p id="err-email" className="pl-4 text-xs text-[var(--color-danger)]">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div className="grid gap-1">
                <label
                  className={`flex items-center gap-3 rounded-full border bg-white px-4 py-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition ${
                    state?.errors?.password
                      ? "border-[var(--color-danger)]/45 ring-4 ring-[var(--color-danger)]/10"
                      : "border-[var(--color-line)]"
                  }`}
                >
                  <span className="text-lg text-[var(--color-ink)]" aria-hidden="true">⚿</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contrasena"
                    autoComplete="new-password"
                    minLength={REGISTRO_LIMITS.password.min}
                    maxLength={REGISTRO_LIMITS.password.max}
                    value={formValues.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    disabled={isPending}
                    aria-invalid={Boolean(state?.errors?.password)}
                    aria-describedby={state?.errors?.password ? "err-pass" : undefined}
                    className="w-full bg-transparent text-base text-[var(--color-ink)] outline-none placeholder:text-[#8a8f8a] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="shrink-0 text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
                    aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Ocultar" : "Ver"}
                  </button>
                </label>
                {state?.errors?.password && (
                  <p id="err-pass" className="pl-4 text-xs text-[var(--color-danger)]">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              <SubmitButton
                label="Crear cuenta"
                pendingLabel="Creando cuenta..."
                className="mt-1 cursor-pointer rounded-full bg-[var(--color-accent)] px-5 py-3.5 text-base font-semibold text-[var(--color-accent-foreground)] shadow-[0_18px_36px_rgba(32,162,107,0.22)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </form>

            <p className="mt-6 text-center text-xs leading-6 text-[var(--color-muted)]">
              Al registrarte aceptas los{" "}
              <a href="#" className="font-medium text-[var(--color-ink)] hover:underline">
                Terminos de uso
              </a>{" "}
              y la{" "}
              <a href="#" className="font-medium text-[var(--color-ink)] hover:underline">
                Politica de privacidad
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
