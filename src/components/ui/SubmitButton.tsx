"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  pendingLabel?: string;
  className?: string;
}

/**
 * Must be rendered inside a <form> element.
 * Reads the enclosing form's pending state via useFormStatus.
 */
export default function SubmitButton({
  label,
  pendingLabel = "Procesando...",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-label={pending ? pendingLabel : label}
      className={className}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
