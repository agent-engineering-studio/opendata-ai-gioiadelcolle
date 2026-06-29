import type { CityAnalysis } from "@/lib/types";

// Nota formale sul senso civico dell'analisi — uguale per tutti i comuni.
const PURPOSE_NOTE =
  "Questa analisi non costituisce un giudizio politico sull'amministrazione in carica né una valutazione dell'operato di alcun soggetto. È concepita come uno spazio di discussione costruttivo e civico sul valore dei dati pubblici aperti (open data) e sulla diffusione della loro cultura come strumento di trasparenza, partecipazione e cura del bene comune. Le proposte e le idee qui raccolte sono spunti aperti al confronto, elaborati automaticamente a partire da fonti pubbliche, e vanno sempre verificati presso le amministrazioni competenti.";

export default function Disclaimer({ a }: { a: CityAnalysis }) {
  return (
    <div style={{ background: "#26221C", color: "#C9BBA2" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(28px,5vw,44px) clamp(18px,5vw,64px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E9C9A8" strokeWidth="1.8" style={{ flex: "none" }}>
            <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          <span style={{ font: "600 12px 'Archivo'", letterSpacing: ".14em", textTransform: "uppercase", color: "#E9C9A8" }}>
            Avvertenze e finalità
          </span>
        </div>
        <p style={{ margin: "0 0 12px", font: "500 13px/1.65 'Archivo'", color: "#D8CBB1" }}>{a.disclaimer}</p>
        <p style={{ margin: 0, font: "400 13px/1.65 'Archivo'", color: "#A99B82" }}>{PURPOSE_NOTE}</p>
      </div>
    </div>
  );
}
