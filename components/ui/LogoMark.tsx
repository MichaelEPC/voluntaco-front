interface LogoMarkProps {
  compact?: boolean;
}

export default function LogoMark({ compact = false }: LogoMarkProps) {
  const size = compact ? "h-12 w-12" : "h-16 w-16";

  return (
    <div className={`relative ${size}`} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-white/30 blur-md" />
      <svg
        viewBox="0 0 96 96"
        className="relative h-full w-full drop-shadow-[0_10px_24px_rgba(31,82,66,0.16)]"
      >
        <path
          d="M47.6 28.4C41.9 17.1 28.1 13.8 18.2 21.6c-10 7.9-10.7 22.8-1.7 32.9l26.3 29.6c2.6 2.9 7.1 2.9 9.7 0l26.3-29.6c9-10.1 8.3-25-1.7-32.9-9.9-7.8-23.7-4.5-29.5 6.8z"
          fill="#f2a75d"
        />
        <path
          d="M47.6 28.4c5.8-11.3 19.6-14.6 29.5-6.8 10 7.9 10.7 22.8 1.7 32.9L52.5 84.1c-2.6 2.9-7.1 2.9-9.7 0L16.5 54.5c-9-10.1-8.3-25 1.7-32.9 9.9-7.8 23.7-4.5 29.4 6.8z"
          fill="#ef7e69"
          opacity="0.9"
        />
        <path
          d="M48 82.6c-1.7 0-3.4-.7-4.7-1.9L24.8 60.4c1.7-1.8 4.6-2.5 7.2-1.6 7.3 2.4 11.6-2.5 15.8-8.6 4-5.8 8-12 16.3-12.8 3.1-.3 6.3.3 8.9 1.8L52.7 80.7c-1.3 1.2-3 1.9-4.7 1.9z"
          fill="#1fa26b"
        />
        <path
          d="M30 61.4c4.1-1 7.1 1 10.2 3.3 2.6 2 5.3 4.1 9 4.1 3.8 0 6.7-1.9 9.6-4.1 3.2-2.3 6.5-4.7 11-4 1.4.2 2.8.7 4 1.5l-21 18.6c-2.7 2.4-6.8 2.4-9.5 0L26 63.5c1.2-1 2.6-1.7 4-2.1z"
          fill="#0d6f58"
        />
      </svg>
    </div>
  );
}
