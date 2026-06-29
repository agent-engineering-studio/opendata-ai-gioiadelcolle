import type { ReactNode } from "react";

// Icona (stroke) per ciascuna categoria, eredita il colore via currentColor.
const PATHS: Record<string, ReactNode> = {
  "Mobilità": (
    <>
      <rect x="4" y="4" width="16" height="12" rx="2" />
      <path d="M4 11h16" />
      <circle cx="8" cy="19" r="1.4" />
      <circle cx="16" cy="19" r="1.4" />
    </>
  ),
  "Cultura": (
    <>
      <path d="M12 3 3 8h18z" />
      <path d="M5 8v9M9.7 8v9M14.3 8v9M19 8v9" />
      <path d="M3 21h18" />
    </>
  ),
  "Welfare": (
    <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  ),
  "Lavoro": (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </>
  ),
  "Commercio": (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  "Sanità": <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  "Istruzione": (
    <>
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
    </>
  ),
  "Ambiente": (
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" />
  ),
  "Impresa": (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h6" />
    </>
  ),
};

export default function CategoryIcon({ category, size = 14 }: { category?: string; size?: number }) {
  const path = category ? PATHS[category] : null;
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none" }}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
