import type { CityAnalysis } from "@/lib/types";

export default function Footer({ a }: { a: CityAnalysis }) {
  const generata = new Date(a.generatedAt).toLocaleString("it-IT", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  return (
    <footer style={{ background: "#211E1A", color: "#C9BBA2" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px clamp(18px,5vw,64px)", display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ maxWidth: 520 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#A8432A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: "700 14px 'Spectral'" }}>
              {a.comune.charAt(0)}
            </div>
            <span style={{ font: "600 16px 'Spectral'", color: "#FCF8F0" }}>{a.comune} — Analisi del territorio</span>
          </div>
          <p style={{ margin: 0, font: "400 12.5px/1.6 'Archivo'", color: "#A99B82" }}>
            Spazio civico di confronto sul valore degli open data. I sostegni richiedono l'accesso e sono salvati nel database. Vedi le avvertenze e finalità complete qui sopra.
          </p>
        </div>
        <div style={{ font: "400 11px/1.7 'IBM Plex Mono'", color: "#8C8068" }}>
          Generata il {generata}
          <br />Fonti: OpenCoesione · ISTAT · ISPRA
          <br />OpenStreetMap · MIUR · Min. Salute
        </div>
      </div>
    </footer>
  );
}
