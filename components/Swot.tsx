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
      <div className="swot-grid">
        {a.swot.map((q) => (
          <div key={q.label} style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E6DECF", borderTop: `3px solid ${q.color}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 20px", background: `${q.color}0F`, borderBottom: "1px solid #EFE8DA" }}>
              <span style={{ flex: "none", width: 30, height: 30, borderRadius: 7, background: q.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: "700 15px 'Spectral'" }}>
                {q.label.charAt(0)}
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ font: "600 16px 'Spectral'", color: q.color, lineHeight: 1.1 }}>{q.label}</span>
                <span style={{ font: "500 10.5px 'Archivo'", letterSpacing: ".05em", textTransform: "uppercase", color: "#9A8E78" }}>{q.tag}</span>
              </div>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: "6px 20px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
              {q.items.map((it) => (
                <li key={it.title} style={{ display: "flex", gap: 10, padding: "11px 0", borderTop: "1px solid #F2ECDF" }}>
                  <span style={{ flex: "none", width: 7, height: 7, borderRadius: "50%", background: q.color, marginTop: 6 }} />
                  <div>
                    <div style={{ font: "600 13.5px 'Archivo'", color: "#211E1A", marginBottom: 2 }}>{it.title}</div>
                    <div style={{ font: "400 13px/1.5 'Archivo'", color: "#5A5346" }}>{it.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
