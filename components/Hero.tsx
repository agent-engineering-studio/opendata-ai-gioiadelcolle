import type { CityAnalysis } from "@/lib/types";

export default function Hero({ a }: { a: CityAnalysis }) {
  return (
    <>
      <header style={{ position: "relative", minHeight: "clamp(440px,62vh,640px)", background: "#211E1A", overflow: "hidden", display: "flex" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-gioia.jpg"
          alt="Castello normanno-svevo di Gioia del Colle"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(20,18,15,.30) 0%,rgba(20,18,15,.10) 38%,rgba(20,18,15,.86) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", alignSelf: "flex-end", width: "100%", padding: "0 clamp(18px,5vw,64px) 42px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ font: "600 12px 'Archivo'", letterSpacing: ".2em", textTransform: "uppercase", color: "#E9C9A8" }}>
              Analisi del territorio · Comune {a.istat}
            </div>
            <h1 style={{ margin: "8px 0 12px", font: "600 clamp(42px,8vw,86px)/.98 'Spectral'", color: "#FCF8F0", letterSpacing: "-.015em" }}>
              {a.comune}
            </h1>
            <p style={{ margin: 0, maxWidth: 720, font: "400 clamp(15px,2vw,18px)/1.5 'Archivo'", color: "#EADFCB" }}>
              {a.provincia} · Un quadro costruito esclusivamente su dati pubblici: OpenCoesione, ISTAT, ISPRA, OpenStreetMap, MIUR, Ministero della Salute.
            </p>
          </div>
        </div>
      </header>
      <div style={{ background: "#26221C", color: "#C9BBA2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 11, padding: "11px clamp(18px,5vw,64px)", font: "500 12px/1.55 'Archivo'" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E9C9A8" strokeWidth="1.8" style={{ flex: "none", marginTop: 1 }}>
            <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          <span>{a.disclaimer}</span>
        </div>
      </div>
    </>
  );
}
