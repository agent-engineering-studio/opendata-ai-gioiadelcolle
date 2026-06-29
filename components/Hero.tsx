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
    </>
  );
}
