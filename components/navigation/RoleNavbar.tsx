"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/login";
import type { SessionPayload } from "@/lib/auth/session";

type NavItem = {
  label: string;
  href: string;
};

const VOLUNTARIO_ROLE = 1;
const FUNDACION_ROLE = 2;

const volunteerItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Postulaciones", href: "/postulaciones" },
  { label: "Mensajes", href: "/mensajes" },
  { label: "Perfil", href: "/perfil" },
  { label: "Ajustes", href: "/ajustes" },
];

const foundationItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Voluntariados", href: "/voluntariados" },
  { label: "Mensajes", href: "/mensajes" },
  { label: "Perfil", href: "/perfil" },
  { label: "Ajustes", href: "/ajustes" },
];

function normalizeRole(role: SessionPayload["role"]): number | null {
  const parsed = Number(role);
  return Number.isFinite(parsed) ? parsed : null;
}

function isHiddenPath(pathname: string): boolean {
  return pathname === "/login" || pathname.startsWith("/registro");
}

function isActivePath(currentPath: string, href: string): boolean {
  if (href === "/") {
    return currentPath === "/";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function RoleNavbar({ session }: { session: SessionPayload | null }) {
  const pathname = usePathname();

  if (!session || isHiddenPath(pathname)) {
    return null;
  }

  const role = normalizeRole(session.role);
  const items = role === FUNDACION_ROLE ? foundationItems : volunteerItems;
  const roleLabel = role === FUNDACION_ROLE ? "Fundacion" : "Voluntario";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-white/86 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-strong)] text-base font-bold text-[var(--color-accent)]">
            V
          </div>
          <div>
            <p className="font-display text-2xl leading-none text-[var(--color-ink)]">
              Voluntaco
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
              {roleLabel}
            </p>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex">
          {items.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-[0_14px_30px_rgba(32,162,107,0.18)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-ink)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 text-right sm:block">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Sesion activa
            </p>
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              {session.name}
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-strong)]"
            >
              Cerrar sesion
            </button>
          </form>
        </div>
      </div>

      <nav className="scrollbar-none flex gap-2 overflow-x-auto border-t border-[var(--color-line)] px-4 py-3 sm:px-6 lg:hidden">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                  : "bg-white text-[var(--color-muted)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}