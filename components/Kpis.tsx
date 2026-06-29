import type { CityAnalysis } from "@/lib/types";
import { Section, SectionHead } from "./Section";
import InfoDot from "./InfoDot";
import ScoreGauge from "./ScoreGauge";
import SpendChart from "./SpendChart";

export default function Kpis({ a }: { a: CityAnalysis }) {
  const s = a.fundsSummary;
  return (
    <Section id="sintesi">
      <SectionHead eyebrow={a.intro.eyebrow} title={a.intro.title} text={a.intro.text} />

      {/* Punteggio + grafico capacità di spesa */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <ScoreGauge score={a.fundsScore} />
        <SpendChart themes={a.spendByTheme} avg={a.avgSpendPct} />
      </div>

      {/* Le due percentuali chiave (box) */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        {a.highlights.map((h) => (
          <div key={h.label} style={{ position: "relative", background: "#fff", border: "1px solid #E6DECF", borderLeft: `4px solid ${h.color}`, borderRadius: 8, padding: "22px 24px" }}>
            {h.info && (
              <div style={{ position: "absolute", top: 14, right: 14 }}>
                <InfoDot title={h.label} value={h.value} info={h.info} glossary={h.glossary} color={h.color} />
              </div>
            )}
            <div style={{ font: "600 clamp(34px,5vw,52px)/1 'Spectral'", color: h.color, paddingRight: 28 }}>{h.value}</div>
            <div style={{ marginTop: 8, font: "600 14px 'Archivo'", color: "#211E1A" }}>{h.label}</div>
            <div style={{ marginTop: 5, font: "400 13.5px/1.55 'Archivo'", color: "#5A5346" }}>{h.text}</div>
          </div>
        ))}
      </div>

      {/* Numeri grandi resi parlanti */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", alignItems: "baseline", background: "#FBF8F1", border: "1px solid #E6DECF", borderRadius: 8, padding: "16px 22px", marginBottom: 26 }}>
        <span style={{ font: "400 13.5px/1.5 'Archivo'", color: "#4A4439" }}>
          <strong style={{ color: "#211E1A" }}>{s.projects} progetti</strong> finanziati con fondi pubblici, di cui <strong style={{ color: "#211E1A" }}>{s.concluded} già conclusi</strong>.
        </span>
        <span style={{ font: "400 13.5px/1.5 'Archivo'", color: "#4A4439" }}>
          <strong style={{ color: "#211E1A" }}>{s.totalCost}</strong> di risorse pubbliche complessive <span style={{ color: "#9A8E78" }}>({s.perCapita})</span>.
        </span>
      </div>

      {/* Carta d'identità del comune (contesto, non performance) */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 12px" }}>
        <h3 style={{ margin: 0, font: "600 15px 'Spectral'", color: "#211E1A", whiteSpace: "nowrap" }}>Carta d&apos;identità del comune</h3>
        <div style={{ flex: 1, height: 1, background: "#E0D7C4" }} />
        <span style={{ font: "500 11px 'Archivo'", color: "#9A8E78" }}>dati di contesto</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 }}>
        {a.identity.map((k) => (
          <div key={k.label} style={{ position: "relative", background: "#fff", border: "1px solid #E6DECF", borderRadius: 6, padding: "16px 18px" }}>
            {k.info && (
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <InfoDot title={k.label} value={k.value} info={k.info} glossary={k.glossary} color="#6B6356" />
              </div>
            )}
            <div style={{ font: "600 clamp(24px,3vw,32px)/1 'Spectral'", color: "#3A352C", paddingRight: 24 }}>{k.value}</div>
            <div style={{ marginTop: 6, font: "600 12.5px 'Archivo'", color: "#3A352C" }}>{k.label}</div>
            <div style={{ marginTop: 3, font: "400 11px/1.4 'IBM Plex Mono'", color: "#9A8E78" }}>{k.sub}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
