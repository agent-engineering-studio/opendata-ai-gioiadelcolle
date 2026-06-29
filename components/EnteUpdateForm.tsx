"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import type { CardUpdate } from "@/lib/types";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "confermato", label: "Confermato dall'ente" },
  { value: "in_corso", label: "In corso" },
  { value: "completato", label: "Completato" },
  { value: "fermo", label: "Fermo" },
  { value: "rettificato", label: "Rettificato" },
  { value: "superato", label: "Superato" },
];

const labelStyle: React.CSSProperties = { font: "600 12px 'Archivo'", color: "#3A352C", marginBottom: 5, display: "block" };
const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #D8CDB8", borderRadius: 6, padding: "9px 11px",
  font: "400 14px 'Archivo'", color: "#211E1A", background: "#fff",
};

export default function EnteUpdateForm({
  istat,
  idAnalysis,
  itemId,
  itemTitle,
  onSubmitted,
}: {
  istat: string;
  idAnalysis: string;
  itemId: string;
  itemTitle: string;
  onSubmitted: (u: CardUpdate) => void;
}) {
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("in_corso");
  const [divergence, setDivergence] = useState(false);
  const [note, setNote] = useState("");
  const [source, setSource] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStatus("in_corso");
    setDivergence(false);
    setNote("");
    setSource("");
    setEffectiveDate("");
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/${istat}/${idAnalysis}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getToken()}` },
        body: JSON.stringify({
          itemId,
          status,
          divergence,
          note: note.trim() || null,
          source: source.trim() || null,
          effectiveDate: effectiveDate || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error || `Errore ${res.status}`);
      onSubmitted((data as { update: CardUpdate }).update);
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Riservato agli operatori dell'ente"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", border: "1px dashed #B5752B", background: "#FBF3E6", color: "#8A5A1F", borderRadius: 999, padding: "5px 11px", font: "600 12px 'Archivo'" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        Aggiorna stato (ente)
      </button>

      {open && (
        <div
          onClick={() => !busy && setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(20,18,15,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            style={{ width: "min(520px,100%)", maxHeight: "90vh", overflow: "auto", background: "#FBF8F1", border: "1px solid #E0D7C4", borderRadius: 10, boxShadow: "0 20px 60px rgba(33,30,26,.35)", padding: "22px 24px" }}
          >
            <div style={{ font: "600 11px 'Archivo'", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8432A", marginBottom: 6 }}>Verifica dell'ente</div>
            <h3 style={{ margin: "0 0 4px", font: "600 19px/1.25 'Spectral'", color: "#211E1A" }}>Aggiorna stato</h3>
            <p style={{ margin: "0 0 18px", font: "400 13px/1.5 'Archivo'", color: "#5A5346" }}>{itemTitle}</p>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Stato</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={divergence} onChange={(e) => setDivergence(e.target.checked)} style={{ marginTop: 3 }} />
              <span style={{ font: "400 13px/1.45 'Archivo'", color: "#3A352C" }}>
                Lo stato reale <strong>diverge dai dati pubblici</strong> (OpenCoesione/ISTAT) e potrebbe non essere ancora sincronizzato
              </span>
            </label>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Nota di verifica</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Es. Cantiere ripartito a marzo 2026, SAL al 62% da ultima rendicontazione comunale." style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>Fonte</label>
                <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Delibera/protocollo/PEC" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Data dello stato</label>
                <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: 14, padding: "9px 11px", borderRadius: 6, background: "#FBE9E4", border: "1px solid #E7C3B8", font: "500 12.5px 'Archivo'", color: "#A8432A" }}>{error}</div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" disabled={busy} onClick={() => setOpen(false)} style={{ cursor: "pointer", border: "1px solid #D8CDB8", background: "#fff", color: "#5A5346", borderRadius: 999, padding: "8px 16px", font: "600 13px 'Archivo'" }}>Annulla</button>
              <button type="submit" disabled={busy} style={{ cursor: busy ? "default" : "pointer", border: "1px solid #A8432A", background: busy ? "#C77A66" : "#A8432A", color: "#fff", borderRadius: 999, padding: "8px 18px", font: "600 13px 'Archivo'" }}>
                {busy ? "Salvataggio…" : "Salva verifica"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
