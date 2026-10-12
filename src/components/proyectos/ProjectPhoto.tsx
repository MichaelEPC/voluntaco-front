"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProjectPhoto({
  url,
  name,
  variant = "thumbnail",
}: {
  url: string | null;
  name: string;
  variant?: "thumbnail" | "avatar" | "cover";
}) {
  const cover = variant === "cover";
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const validUrl = url && URL.canParse(url) && /^https?:\/\//i.test(url);
  const showPhoto = validUrl && failedUrl !== url;

  return (
    <div
      className={`relative overflow-hidden bg-[var(--color-surface-strong)] ${
        cover
          ? "h-32 w-full sm:h-36"
          : variant === "avatar"
            ? "h-16 w-16 shrink-0 rounded-full border-4 border-white"
            : "h-16 w-16 shrink-0 rounded-2xl"
      }`}
    >
      {showPhoto ? (
        <Image
          src={url}
          alt={`${cover ? "Portada" : "Foto"} de ${name}`}
          fill
          unoptimized
          sizes={cover ? "(max-width: 1024px) 100vw, 1024px" : "64px"}
          className="object-cover"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        <div className="hero-wash flex h-full items-center justify-center">
          <span
            role="img"
            aria-label={failedUrl === url && url ? "Foto no disponible" : "Proyecto sin foto"}
            className={`font-display font-semibold text-[var(--color-accent)] ${cover ? "text-5xl" : "text-2xl"}`}
          >
            {name.trim().slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
