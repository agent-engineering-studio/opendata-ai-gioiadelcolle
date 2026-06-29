import type { CityAnalysis } from "@/lib/types";
import { Section, SectionHead } from "./Section";

export default function Fonti({ a }: { a: CityAnalysis }) {
  return (
    <Section id="fonti" bg="#F1E9DA">
      <SectionHead eyebrow="Fonti" title="Dati aperti citati" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 10 }}>
        {a.fonti.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 11, background: "#fff", border: "1px solid #E6DECF", borderRadius: 5, padding: "13px 15px" }}>
            <span style={{ font: "600 10px 'IBM Plex Mono'", color: "#fff", background: "#A8432A", borderRadius: 3, padding: "3px 6px", whiteSpace: "nowrap", flex: "none", marginTop: 1 }}>{f.src}</span>
            <div>
              <div style={{ font: "500 13px/1.4 'Archivo'", color: "#211E1A" }}>{f.name}</div>
              <div style={{ font: "400 11px 'IBM Plex Mono'", color: "#9A8E78", marginTop: 2 }}>{f.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
