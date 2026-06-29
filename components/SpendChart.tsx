import type { CityAnalysis } from "@/lib/types";

function barColor(pct: number): string {
  if (pct >= 67) return "#2C5545";
  if (pct >= 40) return "#B5752B";
  return "#A8432A";
}

export default function SpendChart({
  themes,
  avg,
}: {
  themes: CityAnalysis["spendByTheme"];
  avg: number;
}) {
  const fmt = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 1 });
  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E6DECF", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ font: "600 12px 'Archivo'", letterSpacing: ".06em", textTransform: "uppercase", color: "#3A352C", marginBottom: 4 }}>
        Capacità di spesa per tema
      </div>
      <div style={{ font: "400 12px 'Archivo'", color: "#9A8E78", marginBottom: 16 }}>
        quota di fondi spesi sul totale disponibile · linea = media comunale {fmt(avg)}%
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {themes.map((t) => {
          const color = barColor(t.pct);
          return (
            <div key={t.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                <span style={{ font: "600 13px 'Archivo'", color: "#3A352C" }}>{t.label}</span>
                <span style={{ font: "600 13px 'IBM Plex Mono'", color }}>{fmt(t.pct)}%</span>
              </div>
              <div style={{ position: "relative", height: 12, background: "#F1E9DA", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${t.pct}%`, background: color, borderRadius: 999 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Riferimento media comunale, allineato sotto le barre */}
      <div style={{ position: "relative", height: 18, marginTop: 4 }}>
        <div style={{ position: "absolute", top: 0, left: `${avg}%`, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 1, height: 8, background: "#6B6356" }} />
          <span style={{ font: "500 10px 'IBM Plex Mono'", color: "#6B6356", whiteSpace: "nowrap" }}>media {fmt(avg)}%</span>
        </div>
      </div>
    </div>
  );
}
