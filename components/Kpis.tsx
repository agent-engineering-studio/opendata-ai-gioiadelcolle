import type { CityAnalysis } from "@/lib/types";
import { Section, SectionHead } from "./Section";
import InfoDot from "./InfoDot";

export default function Kpis({ a }: { a: CityAnalysis }) {
  return (
    <Section id="sintesi">
      <SectionHead eyebrow={a.intro.eyebrow} title={a.intro.title} text={a.intro.text} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 26 }}>
        {a.kpis.map((k) => (
          <div key={k.label} style={{ position: "relative", background: "#fff", border: "1px solid #E6DECF", borderRadius: 5, padding: "18px 18px 16px" }}>
            {k.info && (
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <InfoDot title={k.label} value={k.value} info={k.info} />
              </div>
            )}
            <div style={{ font: "600 clamp(28px,3.6vw,40px)/1 'Spectral'", color: "#211E1A", paddingRight: 24 }}>{k.value}</div>
            <div style={{ marginTop: 7, font: "600 13px 'Archivo'", color: "#3A352C" }}>{k.label}</div>
            <div style={{ marginTop: 3, font: "400 11px/1.4 'IBM Plex Mono'", color: "#9A8E78" }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        {a.highlights.map((h) => (
          <div key={h.label} style={{ position: "relative", background: "#fff", border: "1px solid #E6DECF", borderLeft: `4px solid ${h.color}`, borderRadius: 5, padding: "22px 24px" }}>
            {h.info && (
              <div style={{ position: "absolute", top: 14, right: 14 }}>
                <InfoDot title={h.label} value={h.value} info={h.info} color={h.color} />
              </div>
            )}
            <div style={{ font: "600 clamp(34px,5vw,52px)/1 'Spectral'", color: h.color, paddingRight: 28 }}>{h.value}</div>
            <div style={{ marginTop: 8, font: "600 14px 'Archivo'", color: "#211E1A" }}>{h.label}</div>
            <div style={{ marginTop: 5, font: "400 13.5px/1.55 'Archivo'", color: "#5A5346" }}>{h.text}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
