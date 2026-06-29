"use client";

import { useEffect, useRef, useState } from "react";

const ROW: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 6,
  font: "500 13px 'Archivo'", color: "#3A352C", textDecoration: "none", background: "transparent",
  border: "none", cursor: "pointer", textAlign: "left", width: "100%",
};

function dot(color: string) {
  return <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, flex: "none" }} />;
}

export default function ShareMenu({ title, anchorId }: { title: string; anchorId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  const url = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}#${anchorId}` : `#${anchorId}`;
  const text = `${title} — Analisi del territorio`;
  const eu = encodeURIComponent(url);
  const et = encodeURIComponent(text);

  const onShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Web Share API nativa su mobile/browser supportati.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        /* annullato → mostra il menu */
      }
    }
    setOpen((o) => !o);
  };

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { navigator.clipboard?.writeText(url); } catch { /* noop */ }
    setCopied(true);
    setOpen(false);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={onShareClick} style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", border: "1px solid #D8CDB8", background: "#fff", color: "#5A5346", borderRadius: 999, padding: "7px 12px", font: "600 13px 'Archivo'" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="m8.3 10.8 7.4-4.3M8.3 13.2l7.4 4.3" /></svg>
        <span>{copied ? "Copiato!" : "Condividi"}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, bottom: "calc(100% + 8px)", zIndex: 30, background: "#fff", border: "1px solid #E0D7C4", borderRadius: 9, boxShadow: "0 14px 34px rgba(33,30,26,.18)", padding: 6, minWidth: 184, display: "flex", flexDirection: "column" }}>
          <a className="sharerow" style={ROW} href={`https://www.facebook.com/sharer/sharer.php?u=${eu}`} target="_blank" rel="noopener">{dot("#1877F2")}Facebook</a>
          <a className="sharerow" style={ROW} href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`} target="_blank" rel="noopener">{dot("#25D366")}WhatsApp</a>
          <a className="sharerow" style={ROW} href={`https://twitter.com/intent/tweet?text=${et}&url=${eu}`} target="_blank" rel="noopener">{dot("#111")}X</a>
          <a className="sharerow" style={ROW} href={`https://www.linkedin.com/sharing/share-offsite/?url=${eu}`} target="_blank" rel="noopener">{dot("#0A66C2")}LinkedIn</a>
          <div style={{ height: 1, background: "#EFE8DA", margin: "4px 6px" }} />
          <button className="sharerow" style={ROW} onClick={copy}>{dot("#9A8E78")}Copia link</button>
        </div>
      )}
    </div>
  );
}
