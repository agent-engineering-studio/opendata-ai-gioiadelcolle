import type { CityAnalysis } from "@/lib/types";
import InfoDot from "./InfoDot";

function bandColor(v: number): string {
  if (v >= 67) return "#2C5545"; // verde
  if (v >= 40) return "#B5752B"; // ambra
  return "#A8432A"; // rosso
}

function bandLabel(v: number): string {
  if (v >= 67) return "Buono";
  if (v >= 40) return "Nella media";
  return "Critico";
}

export default function ScoreGauge({ score }: { score: CityAnalysis["fundsScore"] }) {
  const v = Math.max(0, Math.min(100, score.value));
  const color = bandColor(v);
  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E6DECF", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ font: "600 12px 'Archivo'", letterSpacing: ".06em", textTransform: "uppercase", color: "#3A352C" }}>
          Indice di utilizzo dei fondi
        </span>
        <InfoDot title="Indice di utilizzo dei fondi pubblici" value={`${v}/100`} info={score.info} glossary={score.glossary} color={color} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div
          style={{
            position: "relative", flex: "none", width: 150, height: 150, borderRadius: "50%",
            background: `conic-gradient(${color} ${v * 3.6}deg, #ECE3D2 0)`,
          }}
          role="img"
          aria-label={`Punteggio ${v} su 100`}
        >
          <div style={{ position: "absolute", inset: 16, background: "#fff", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ font: "600 44px/1 'Spectral'", color }}>{v}</span>
            <span style={{ font: "500 12px 'IBM Plex Mono'", color: "#9A8E78", marginTop: 2 }}>/ 100</span>
          </div>
        </div>
        <div style={{ minWidth: 150, flex: 1 }}>
          <span style={{ display: "inline-block", font: "600 12px 'Archivo'", color: "#fff", background: color, borderRadius: 999, padding: "3px 11px", marginBottom: 8 }}>
            {bandLabel(v)}
          </span>
          <p style={{ margin: 0, font: "400 13px/1.55 'Archivo'", color: "#5A5346" }}>
            Sintesi su <strong>uso dei fondi pubblici</strong> di coesione: {score.spendRatioPct}% di spesa effettiva e {score.completionPct}% di progetti conclusi. Tocca «i» per il calcolo.
          </p>
        </div>
      </div>
    </div>
  );
}
