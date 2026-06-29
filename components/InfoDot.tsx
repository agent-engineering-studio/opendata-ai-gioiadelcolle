"use client";

import { Fragment, useEffect, useState } from "react";
import type { Glossary } from "@/lib/types";

// Rende il **grassetto** dentro un paragrafo (markdown-lite).
function renderInline(text: string) {
  return text.split("**").map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ color: "#211E1A", fontWeight: 600 }}>{chunk}</strong>
    ) : (
      <Fragment key={i}>{chunk}</Fragment>
    ),
  );
}

/**
 * Piccola icona "i" che apre una modale con la spiegazione di un dato.
 * `info` supporta più paragrafi (separati da \n\n) e **grassetto**.
 * `glossary` mostra un riquadro che definisce un termine tecnico.
 * Riutilizzabile per i KPI e gli highlight del quadro di sintesi.
 */
export default function InfoDot({
  title,
  value,
  info,
  glossary,
  color = "#A8432A",
}: {
  title: string;
  value?: string;
  info: string;
  glossary?: Glossary;
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
            {glossary && (
              <div style={{ margin: "16px 0 4px", padding: "12px 14px", background: "#F4EEE1", border: "1px solid #E6DECF", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span aria-hidden="true">💡</span>
                  <span style={{ font: "600 11px 'Archivo'", letterSpacing: ".05em", textTransform: "uppercase", color }}>{glossary.term}</span>
                </div>
                <div style={{ font: "400 13px/1.55 'Archivo'", color: "#4A4439" }}>{renderInline(glossary.def)}</div>
              </div>
            )}
            {info.split("\n\n").map((para, i) => (
              <p key={i} style={{ margin: i === 0 ? "14px 0 0" : "10px 0 0", font: "400 14px/1.6 'Archivo'", color: "#4A4439" }}>
                {renderInline(para)}
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
