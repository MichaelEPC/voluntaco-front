import type { ReactNode } from "react";

interface FieldProps {
  icon: string;
  children: ReactNode;
  invalid?: boolean;
}

export default function Field({ icon, children, invalid = false }: FieldProps) {
  return (
    <label
      className={`flex items-center gap-3 rounded-full border bg-white px-4 py-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition ${
        invalid
          ? "border-[var(--color-danger)]/45 ring-4 ring-[var(--color-danger)]/10"
          : "border-[var(--color-line)]"
      }`}
    >
      <span className="text-lg text-[var(--color-ink)]" aria-hidden="true">
        {icon}
      </span>
      {children}
    </label>
  );
}
