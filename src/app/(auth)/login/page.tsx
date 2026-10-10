"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import LogoMark from "@/components/ui/LogoMark";
import SubmitButton from "@/components/ui/SubmitButton";
import FormToast, { type FormToastData } from "@/components/ui/FormToast";
import { accountTypes, socialProviders } from "@/lib/data/login";
import { login } from "@/lib/actions/login";
import type { LoginFormState } from "@/lib/validations/login";

const initialState: LoginFormState = {
  values: {
    email: "",
    password: "",
  },
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState(initialState.values);

  useEffect(() => {
    if (state.values) {
      setFormValues(state.values);
    }
  }, [state.values]);

  const toast: FormToastData | null =
    state?.message && state?.attemptedAt
      ? {
          id: state.attemptedAt,
          title: "Error al iniciar sesion",
          message: state.message,
          tone: "error",
        }
      : null;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <FormToast key={toast?.id ?? "login-toast"} toast={toast} />
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl gap-4 lg:grid-cols-[1fr_520px]">
        <section className="shell-panel hero-wash relative hidden overflow-hidden rounded-[2rem] p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-y-10 right-10 w-40 rounded-full bg-[var(--color-highlight)]/20 blur-3xl" />
          <div className="absolute bottom-8 left-8 h-32 w-32 rounded-full bg-[var(--color-accent)]/18 blur-3xl" />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-4 rounded-full border border-white/70 bg-white/72 px-4 py-3 backdrop-blur">
              <LogoMark />
              <div>
                <p className="font-display text-2xl leading-none text-[var(--color-ink)]">Voluntaco</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  comunidad en accion
                </p>
              </div>
            </div>

            <h1 className="mt-10 font-display text-6xl leading-[0.92] tracking-[-0.06em] text-[var(--color-ink)]">
              Inicia sesión para convertir interés en impacto.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-center leading-8 text-[var(--color-muted)]">
                <span className="font-semibold text-[#1FA26B]">¿No tienes cuenta? </span>
                Crea una y únete a miles de 
                <span className="font-semibold text-[#1FA26B]"> voluntarios </span>
                 y 
                <span className="font-semibold text-[#1FA26B]"> fundaciones </span> 
                 que ya estan haciendo la <span className="font-semibold text-[#12352F]"> diferencia</span>.            
            </p>
          </div>

          <div className="relative mt-1 z-10 grid gap-4 md:grid-cols-2">
            {accountTypes.map((account) => (
              account.title === "Voluntario" ? (
                <Link
                  key={account.title}
                  href="/registro/voluntario"
                  className="block rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4"
                  aria-label="Ir al registro de voluntario"
                >
                  <article className="card-hover glass-panel flex h-full flex-col text-center rounded-[1.5rem] p-4 cursor-pointer">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                      {account.badge}
                    </p>
                    <div className="mt-3 mb-0.5">
                      <account.Icon />
                    </div>
                    <p className="mt-1.5 flex-1 text-sm leading-6 text-[var(--color-muted)]">
                      {account.description}
                    </p>
                    <span className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95">
                      {account.cta}
                    </span>
                  </article>
                </Link>
              ) : (
                <Link
                  key={account.title}
                  href="/registro/fundacion"
                  className="block rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4"
                  aria-label="Ir al registro de fundacion"
                >
                  <article
                    className={`card-hover flex h-full flex-col text-center rounded-[1.5rem] p-4 cursor-pointer ${
                      account.dark
                        ? "bg-[var(--color-ink)] text-white shadow-[0_20px_50px_rgba(18,53,47,0.28)]"
                        : "glass-panel"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.22em] ${
                        account.dark ? "text-white/55" : "text-[var(--color-muted)]"
                      }`}
                    >
                      {account.badge}
                    </p>
                    <div className="mt-3 mb-0.5">
                      <account.Icon />
                    </div>
                    <p
                      className={`mt-1.5 flex-1 text-sm leading-6 ${
                        account.dark ? "text-white/70" : "text-[var(--color-muted)]"
                      }`}
                    >
                      {account.description}
                    </p>
                    <span
                      className={`mt-3 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition hover:brightness-95 ${
                        account.dark
                          ? "bg-white text-[var(--color-ink)]"
                          : "bg-[var(--color-ink)] text-white"
                      }`}
                    >
                      {account.cta}
                    </span>
                  </article>
                </Link>
              )
            ))}
          </div>
        </section>

        <section className="glass-panel mx-auto flex w-full max-w-[480px] flex-col justify-center rounded-[1.85rem] px-5 py-7 shadow-[0_28px_80px_rgba(31,82,66,0.14)] sm:px-7 sm:py-9 lg:px-8">
          <div className="mx-auto flex w-full max-w-[360px] flex-col items-center text-center">
            <div className="lg:hidden">
              <LogoMark />
            </div>
            <div className="hidden lg:block">
              <LogoMark compact />
            </div>

            <p className="mt-3 font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-ink)]">
              Voluntaco
            </p>
            <h2 className="mt-6 max-w-[14ch] font-display text-[2.35rem] leading-[0.95] tracking-[-0.05em] text-[var(--color-ink)] sm:text-[2.8rem]">
              Inicia sesión para impactar
            </h2>
            <p className="mt-3 text-[0.95rem] leading-7 text-[var(--color-muted)]">
              O crea una cuenta si eres nuevo
            </p>

            <form action={formAction} className="mt-7 grid w-full gap-3.5" noValidate>
              <label className="flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white px-4 py-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <span className="text-lg text-[var(--color-ink)]" aria-hidden="true">
                  ◔
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electronico"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  disabled={isPending}
                  className="w-full bg-transparent text-base text-[var(--color-ink)] outline-none placeholder:text-[#8a8f8a] disabled:opacity-50"
                />
              </label>

              <label className="flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white px-4 py-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <span className="text-lg text-[var(--color-ink)]" aria-hidden="true">
                  ⚿
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contrasena"
                  autoComplete="current-password"
                  value={formValues.password}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  disabled={isPending}
                  className="w-full bg-transparent text-base text-[var(--color-ink)] outline-none placeholder:text-[#8a8f8a] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="shrink-0 text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </label>

              <a
                href="#"
                className="justify-self-end text-sm font-medium text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
              >
                Olvidaste tu contrasena?
              </a>

              <SubmitButton
                label="Iniciar Sesion"
                pendingLabel="Iniciando sesion..."
                className="mt-1 cursor-pointer rounded-full bg-[var(--color-accent)] px-5 py-3.5 text-base font-semibold text-[var(--color-accent-foreground)] shadow-[0_18px_36px_rgba(32,162,107,0.22)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </form>

            <div className="mt-7 flex w-full items-center gap-4 text-[var(--color-ink)]">
              <span className="h-px flex-1 bg-[var(--color-line)]" />
              <span className="text-xl leading-none">ó</span>
              <span className="h-px flex-1 bg-[var(--color-line)]" />
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              {socialProviders.map((provider) => (
                <button
                  key={provider.name}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[1.7rem] shadow-[0_10px_24px_rgba(31,82,66,0.08)] transition hover:-translate-y-0.5"
                  aria-label={`Continuar con ${provider.name}`}
                >
                  <span className={provider.accent}>{provider.mark}</span>
                </button>
              ))}
            </div>

            <p className="mt-7 text-[0.95rem] text-[var(--color-ink)]">
              No tienes cuenta? <a href="#" className="font-semibold">Registrate</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

