"use client";

import { useEffect, useState } from "react";

/**
 * Piccola icona "i" che apre una modale con la spiegazione di un dato.
 * Riutilizzabile per i KPI e gli highlight del quadro di sintesi.
 */
export default function InfoDot({
  title,
  value,
  info,
  color = "#A8432A",
}: {
  title: string;
  value?: string;
  info: string;
  color?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Cosa significa: ${title}`}
        title="Maggiori informazioni"
        style={{
          flex: "none", width: 22, height: 22, borderRadius: "50%", cursor: "pointer",
          border: "1px solid #E0D7C4", background: "#fff", color: "#9A8E78",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          font: "700 12px 'Spectral'", lineHeight: 1, padding: 0,
        }}
      >
        i
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(20,18,15,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ width: "min(460px,100%)", maxHeight: "85vh", overflow: "auto", background: "#FBF8F1", border: "1px solid #E0D7C4", borderTop: `4px solid ${color}`, borderRadius: 10, boxShadow: "0 20px 60px rgba(33,30,26,.35)", padding: "22px 24px" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                {value && <div style={{ font: "600 30px/1 'Spectral'", color }}>{value}</div>}
                <div style={{ marginTop: value ? 6 : 0, font: "600 14px 'Archivo'", color: "#211E1A" }}>{title}</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Chiudi"
                style={{ flex: "none", width: 30, height: 30, borderRadius: 8, cursor: "pointer", border: "1px solid #E0D7C4", background: "#fff", color: "#5A5346", font: "600 16px 'Archivo'", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <p style={{ margin: "14px 0 0", font: "400 14px/1.6 'Archivo'", color: "#4A4439" }}>{info}</p>
          </div>
        </div>
      )}
    </>
  );
}
