import type { CityAnalysis } from "@/lib/types";
import { Section, SectionHead } from "./Section";

export default function Swot({ a }: { a: CityAnalysis }) {
  return (
    <Section id="swot" bg="#F1E9DA">
      <SectionHead
        eyebrow="Analisi SWOT"
        title="Forze, debolezze, opportunità e minacce"
        text="Lettura sintetica del territorio a partire dagli indicatori pubblici disponibili."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
        {a.swot.map((q) => (
          <div key={q.label} style={{ background: "#fff", border: "1px solid #E6DECF", borderTop: `3px solid ${q.color}`, borderRadius: 5, padding: "8px 22px 18px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "14px 0 4px" }}>
              <span style={{ font: "600 17px 'Spectral'", color: q.color }}>{q.label}</span>
              <span style={{ font: "500 11px 'Archivo'", letterSpacing: ".04em", textTransform: "uppercase", color: "#9A8E78" }}>{q.tag}</span>
            </div>
            {q.items.map((it) => (
              <div key={it.title} style={{ padding: "13px 0", borderTop: "1px solid #EFE8DA" }}>
                <div style={{ font: "600 14px 'Archivo'", color: "#211E1A", marginBottom: 4 }}>{it.title}</div>
                <div style={{ font: "400 13.5px/1.55 'Archivo'", color: "#5A5346" }}>{it.text}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
