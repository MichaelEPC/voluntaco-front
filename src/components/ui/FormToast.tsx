"use client";

import type { CSSProperties } from "react";

type ToastTone = "error" | "success";

export interface FormToastData {
  id: number;
  title: string;
  message: string;
  tone: ToastTone;
}

interface FormToastProps {
  toast: FormToastData | null;
  durationMs?: number;
}

const toneStyles: Record<
  ToastTone,
  {
    panel: string;
    badge: string;
    progress: string;
    icon: string;
  }
> = {
  error: {
    panel:
      "border-[var(--color-danger)]/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,241,239,0.96))] text-[var(--color-ink)] shadow-[0_24px_60px_rgba(103,39,33,0.18)]",
    badge: "bg-[var(--color-danger)]/12 text-[var(--color-danger)]",
    progress: "bg-[linear-gradient(90deg,var(--color-danger),#f3a29b)]",
    icon: "!",
  },
  success: {
    panel:
      "border-[var(--color-accent)]/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(236,250,243,0.96))] text-[var(--color-ink)] shadow-[0_24px_60px_rgba(26,93,64,0.18)]",
    badge: "bg-[var(--color-accent)]/12 text-[var(--color-accent)]",
    progress: "bg-[linear-gradient(90deg,var(--color-accent),#8edcbd)]",
    icon: "✓",
  },
};

export default function FormToast({
  toast,
  durationMs = 8000,
}: FormToastProps) {
  if (!toast) {
    return null;
  }

  const styles = toneStyles[toast.tone];
  const animationStyles = {
    "--toast-duration": `${durationMs}ms`,
    "--toast-fade-delay": `${Math.max(durationMs - 320, 0)}ms`,
  } as CSSProperties;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-center sm:justify-end">
      <div
        role="status"
        aria-live="polite"
        className={`toast-life pointer-events-auto relative w-full max-w-md overflow-hidden rounded-[1.6rem] border px-4 py-4 backdrop-blur-xl ${styles.panel}`}
        style={animationStyles}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${styles.badge}`}
            aria-hidden="true"
          >
            {styles.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-[0.01em]">{toast.title}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
              {toast.message}
            </p>
          </div>
        </div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-black/5">
          <div
            className={`toast-progress h-full rounded-full ${styles.progress}`}
            style={{ animationDuration: `${durationMs}ms` }}
          />
        </div>
      </div>
    </div>
  );
}