"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  PROYECTO_IMAGE_TYPES,
  validateProyectoImage,
} from "@/lib/validations/proyecto";

export interface ProjectImageSelection {
  file: File | null;
  error: string | null;
}

export default function ProjectImageField({
  name,
  label,
  selection,
  onChange,
  disabled,
  errors,
}: {
  name: "foto" | "foto_cabeza";
  label: string;
  selection: ProjectImageSelection;
  onChange: (selection: ProjectImageSelection) => void;
  disabled: boolean;
  errors?: string[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!selection.file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => setPreviewFailed(true);
    reader.readAsDataURL(selection.file);
    return () => {
      if (reader.readyState === FileReader.LOADING) reader.abort();
    };
  }, [selection.file]);

  function select(files: FileList | null) {
    setPreviewFailed(false);
    setPreview(null);
    if (!files?.length) return;
    if (files.length !== 1) {
      onChange({ file: null, error: "Selecciona una sola imagen por campo." });
      return;
    }
    const file = files[0];
    const error = validateProyectoImage(file);
    onChange({ file: error ? null : file, error });
  }

  const message = selection.error || errors?.join(" ");
  const id = `proyecto-${name}`;

  return (
    <div className="grid min-w-0 gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label} <span className="text-[var(--color-muted)]">(opcional)</span>
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) select(event.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-2 border-dashed bg-white p-3 transition focus-within:ring-2 focus-within:ring-[var(--color-accent)] ${
          dragging ? "border-[var(--color-accent)]" : "border-[var(--color-line)]"
        } ${disabled ? "opacity-60" : ""}`}
      >
        <label htmlFor={id} className={`flex flex-col items-center gap-2 text-center ${disabled ? "" : "cursor-pointer"}`}>
          {selection.file && preview && !previewFailed ? (
            <div className="relative h-20 w-full overflow-hidden rounded-xl">
              <Image
                src={preview}
                alt={`Vista previa: ${label}`}
                fill
                unoptimized
                className="object-contain"
                onError={() => setPreviewFailed(true)}
              />
            </div>
          ) : (
            <span aria-hidden="true" className="text-2xl text-[var(--color-accent)]">+</span>
          )}
          <span className="text-sm font-medium">
            {selection.file ? "Cambiar imagen" : "Suelta una imagen o selecciona un archivo"}
          </span>
          <span className="text-xs text-[var(--color-muted)]">JPG, PNG, WebP, GIF o AVIF · Hasta 2 MB</span>
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="file"
            accept={PROYECTO_IMAGE_TYPES.join(",")}
            disabled={disabled}
            onChange={(event) => {
              select(event.target.files);
              event.target.value = "";
            }}
            aria-invalid={Boolean(message)}
            aria-describedby={message ? `${id}-error` : undefined}
            className="sr-only"
          />
        </label>
        {(selection.file || selection.error) && (
          <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
            <p className="min-w-0 truncate text-xs text-[var(--color-muted)]" title={selection.file?.name}>
              {selection.file?.name || "Archivo no valido"}
            </p>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                onChange({ file: null, error: null });
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label={`Quitar ${label.toLowerCase()}`}
              className="shrink-0 text-xs font-semibold text-[var(--color-accent)]"
            >
              Quitar
            </button>
          </div>
        )}
      </div>
      {previewFailed && selection.file && (
        <p role="alert" className="text-xs text-[var(--color-danger)]">
          No se pudo mostrar la imagen. Selecciona otra imagen si el archivo esta dañado.
        </p>
      )}
      {message && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[var(--color-danger)]">{message}</p>
      )}
    </div>
  );
}
