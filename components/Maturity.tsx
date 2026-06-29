import { Fragment } from "react";
import type { MaturityReport, MaturityScored, MaturityInsufficient } from "@/lib/types";
import { Section, SectionHead } from "./Section";
import InfoDot from "./InfoDot";

const ODM_GLOSSARY = {
  term: "Maturità open data (ODM)",
  def: "Misura quanto un ente pubblica e rende davvero riutilizzabili i suoi dati aperti, su quattro aspetti: politica/governance, portale, qualità dei dati e impatto/riuso. Il punteggio va da 0 a 100: più è alto, più i dati creano valore per cittadini e imprese.",
};
const ODM_INFO =
  "L'**ODM (Open Data Maturity)** è un indicatore europeo che valuta la capacità di un ente di pubblicare dati aperti utili e riutilizzabili.\n\nNon misura quanti servizi offre il Comune, ma quanto i suoi **dati pubblici** sono accessibili, ben descritti e legalmente riusabili da chiunque (cittadini, imprese, ricercatori).\n\nFonte: metodologia OpenData AI / Linee guida AGID.";

function band(v: number): string {
  if (v >= 67) return "#2C5545";
  if (v >= 40) return "#B5752B";
  return "#A8432A";
}

function renderInline(text: string) {
  return text.split("**").map((c, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: "#211E1A" }}>{c}</strong> : <Fragment key={i}>{c}</Fragment>,
  );
}

const PRIORITY = {
  alta: { label: "Priorità alta", color: "#A8432A" },
  media: { label: "Priorità media", color: "#B5752B" },
  bassa: { label: "Priorità bassa", color: "#6B6356" },
} as const;

function Bars({ dims }: { dims: { name: string; score: number }[] }) {
  const fmt = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 1 });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {dims.map((d) => {
        const color = band(d.score);
        return (
          <div key={d.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
              <span style={{ font: "600 13px 'Archivo'", color: "#3A352C" }}>{d.name}</span>
              <span style={{ font: "600 13px 'IBM Plex Mono'", color }}>{fmt(d.score)}</span>
            </div>
            <div style={{ height: 10, background: "#F1E9DA", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${d.score}%`, background: color, borderRadius: 999 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Scorecard({ r }: { r: MaturityReport & { data: MaturityScored } }) {
  const d = r.data;
  const v = d.score ?? 0;
  const color = band(v);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="grid-2">
        {/* Gauge + livello */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", background: "#fff", border: "1px solid #E6DECF", borderRadius: 8, padding: "22px 24px" }}>
          <div style={{ position: "relative", flex: "none", width: 140, height: 140, borderRadius: "50%", background: `conic-gradient(${color} ${v * 3.6}deg, #ECE3D2 0)` }}>
            <div style={{ position: "absolute", inset: 15, background: "#fff", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ font: "600 40px/1 'Spectral'", color }}>{v}</span>
              <span style={{ font: "500 11px 'IBM Plex Mono'", color: "#9A8E78" }}>/ 100</span>
            </div>
          </div>
          <div style={{ minWidth: 150, flex: 1 }}>
            <span style={{ display: "inline-block", font: "600 12px 'Archivo'", color: "#fff", background: color, borderRadius: 999, padding: "3px 12px", marginBottom: 8 }}>
              Livello {d.odmLevel}
            </span>
            <p style={{ margin: 0, font: "400 13px/1.55 'Archivo'", color: "#5A5346" }}>
              {r.entityName} · <strong>{d.datasetCount}</strong> dataset valutati. Punteggio complessivo di maturità open data.
            </p>
          </div>
        </div>
        {/* Dimensioni */}
        <div style={{ background: "#fff", border: "1px solid #E6DECF", borderRadius: 8, padding: "22px 24px" }}>
          <div style={{ font: "600 12px 'Archivo'", letterSpacing: ".06em", textTransform: "uppercase", color: "#3A352C", marginBottom: 16 }}>Le quattro dimensioni</div>
          <Bars dims={d.dimensions} />
        </div>
      </div>

      {d.sectorsMissing.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, font: "400 13px 'Archivo'", color: "#5A5346" }}>
          <span style={{ font: "600 13px 'Archivo'", color: "#211E1A" }}>Settori ancora da coprire:</span>
          {d.sectorsMissing.map((s) => (
            <span key={s} style={{ font: "500 12px 'Archivo'", color: "#8A5A1F", background: "#FBF3E6", border: "1px solid #E7D3B0", borderRadius: 999, padding: "3px 10px" }}>{s}</span>
          ))}
        </div>
      )}

      {d.recommendations.length > 0 && (
        <div>
          <div style={{ font: "600 12px 'Archivo'", letterSpacing: ".06em", textTransform: "uppercase", color: "#3A352C", marginBottom: 12 }}>Raccomandazioni prioritarie</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {d.recommendations.map((rec, i) => {
              const p = PRIORITY[rec.priority as keyof typeof PRIORITY] ?? PRIORITY.bassa;
              return (
                <div key={i} style={{ background: "#fff", border: "1px solid #E6DECF", borderLeft: `4px solid ${p.color}`, borderRadius: 6, padding: "12px 16px" }}>
                  <span style={{ display: "inline-block", font: "600 10px 'Archivo'", letterSpacing: ".05em", textTransform: "uppercase", color: p.color, marginBottom: 4 }}>{p.label}</span>
                  <p style={{ margin: 0, font: "400 13px/1.55 'Archivo'", color: "#4A4439" }}>{rec.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function RegionContext({ r }: { r: MaturityReport & { data: MaturityScored } }) {
  const d = r.data;
  const v = d.score ?? 0;
  const color = band(v);
  return (
    <div style={{ marginTop: 28, background: "#fff", border: "1px solid #E6DECF", borderRadius: 8, padding: "20px 22px" }}>
      <div style={{ font: "600 12px 'Archivo'", letterSpacing: ".06em", textTransform: "uppercase", color: "#A8432A", marginBottom: 14 }}>
        Il contesto regionale
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "none", width: 92, height: 92, borderRadius: "50%", background: `conic-gradient(${color} ${v * 3.6}deg, #ECE3D2 0)` }}>
          <div style={{ position: "absolute", inset: 11, background: "#fff", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ font: "600 26px/1 'Spectral'", color }}>{v}</span>
            <span style={{ font: "500 9px 'IBM Plex Mono'", color: "#9A8E78" }}>/100</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ font: "600 15px 'Spectral'", color: "#211E1A", marginBottom: 2 }}>{r.entityName}</div>
          <div style={{ font: "400 12.5px/1.5 'Archivo'", color: "#5A5346" }}>
            Livello <strong>{d.odmLevel}</strong> · {d.datasetCount} dataset valutati. La Regione fa da riferimento: anche senza dati propri, il Comune può agganciarsi al portale regionale.
          </div>
        </div>
      </div>
    </div>
  );
}

function Insufficient({ r, region }: { r: MaturityReport & { data: MaturityInsufficient }; region: MaturityReport | null }) {
  const d = r.data;
  return (
    <div>
      <div
        role="alert"
        style={{
          position: "relative", overflow: "hidden", background: "#A8432A", color: "#fff",
          border: "1px solid #8E3522", borderRadius: 12, padding: "clamp(22px,4vw,32px)",
          marginBottom: 26, boxShadow: "0 14px 38px rgba(168,67,42,.28)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span style={{ flex: "none", width: 46, height: 46, borderRadius: 12, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            </svg>
          </span>
          <span style={{ font: "700 12px 'Archivo'", letterSpacing: ".16em", textTransform: "uppercase", color: "#F3D9CF" }}>
            Attenzione · Trasparenza amministrativa
          </span>
        </div>
        <h3 style={{ margin: "0 0 12px", font: "600 clamp(22px,3.2vw,30px)/1.2 'Spectral'", color: "#FFF8F2" }}>
          Su questo comune non risultano dati aperti pubblicati
        </h3>
        <p style={{ margin: "0 0 12px", font: "500 15px/1.6 'Archivo'", color: "#FBEFE9" }}>
          I <strong>dati aperti</strong> sono la base della <strong>trasparenza amministrativa</strong>: senza, cittadini, imprese e ricercatori non possono verificare come vengono usate le risorse pubbliche, e un&apos;analisi come questa resta inevitabilmente <strong>incompleta e meno affidabile</strong>. Pubblicarli è un atto concreto di trasparenza, fiducia e partecipazione democratica.
        </p>
        <p style={{ margin: 0, font: "400 13.5px/1.6 'Archivo'", color: "#EAD3CB" }}>{renderInline(d.intro)}</p>
      </div>

      <h3 style={{ margin: "0 0 14px", font: "600 18px 'Spectral'", color: "#211E1A" }}>Perché pubblicare open data</h3>
      <div className="card-grid" style={{ "--col": "260px", marginBottom: 30 } as React.CSSProperties}>
        {d.whyPublish.map((w) => (
          <div key={w.title} style={{ background: "#fff", border: "1px solid #E6DECF", borderRadius: 6, padding: "16px 18px" }}>
            <div style={{ font: "600 14px 'Archivo'", color: "#211E1A", marginBottom: 5 }}>{w.title}</div>
            <p style={{ margin: 0, font: "400 13px/1.55 'Archivo'", color: "#5A5346" }}>{w.text}</p>
          </div>
        ))}
      </div>

      <h3 style={{ margin: "0 0 16px", font: "600 18px 'Spectral'", color: "#211E1A" }}>Come partire — guida operativa</h3>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {d.steps.map((st) => (
          <li key={st.n} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
            <span style={{ flex: "none", width: 26, height: 26, borderRadius: "50%", background: "#A8432A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: "700 13px 'Spectral'" }}>{st.n}</span>
            <div>
              <div style={{ font: "600 14px 'Archivo'", color: "#211E1A", marginBottom: 2 }}>{st.title}</div>
              <p style={{ margin: 0, font: "400 13px/1.55 'Archivo'", color: "#5A5346" }}>{st.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {d.docs && d.docs.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3 style={{ margin: "0 0 14px", font: "600 18px 'Spectral'", color: "#211E1A" }}>Documentazione e strumenti</h3>
          <div className="card-grid" style={{ "--col": "300px" } as React.CSSProperties}>
            {d.docs.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener" className="card" style={{ display: "block", textDecoration: "none", background: "#fff", border: "1px solid #E6DECF", borderLeft: "4px solid #A8432A", borderRadius: 8, padding: "16px 18px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, font: "600 14px 'Archivo'", color: "#A8432A" }}>
                  {l.label}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
                </span>
                {l.note && <p style={{ margin: "6px 0 0", font: "400 12.5px/1.5 'Archivo'", color: "#5A5346" }}>{l.note}</p>}
              </a>
            ))}
          </div>
        </div>
      )}

      {d.references && d.references.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4 style={{ margin: "0 0 10px", font: "600 12px 'Archivo'", letterSpacing: ".06em", textTransform: "uppercase", color: "#6B6356" }}>Riferimenti istituzionali</h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
            {d.references.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener" style={{ font: "500 13px 'Archivo'", color: "#3A5A8C", textDecoration: "none", borderBottom: "1px solid #C9D3E5", paddingBottom: 1 }}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {d.note && <p style={{ margin: "22px 0 0", font: "italic 400 12.5px/1.55 'Archivo'", color: "#9A8E78" }}>{d.note}</p>}

      {region && region.data.status === "scored" && <RegionContext r={region as MaturityReport & { data: MaturityScored }} />}
    </div>
  );
}

export default function Maturity({ comune, region }: { comune: MaturityReport; region: MaturityReport | null }) {
  return (
    <Section id="maturita" bg="#F1E9DA">
      <div style={{ maxWidth: 820, marginBottom: 24 }}>
        <div style={{ font: "600 12px 'Archivo'", letterSpacing: ".16em", textTransform: "uppercase", color: "#A8432A", marginBottom: 10 }}>
          Maturità open data
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, font: "600 clamp(28px,4vw,42px)/1.08 'Spectral'", color: "#211E1A", letterSpacing: "-.01em" }}>
            Quanto sono aperti i dati del comune
          </h2>
          <InfoDot title="Maturità open data (ODM)" info={ODM_INFO} glossary={ODM_GLOSSARY} />
        </div>
        <p style={{ margin: 0, font: "400 16px/1.65 'Archivo'", color: "#4A4439" }}>
          Pubblicare dati aperti, completi e riutilizzabili è la base perché analisi come questa siano possibili e affidabili. Ecco a che punto è {comune.entityName}.
        </p>
      </div>

      {comune.status === "scored"
        ? <Scorecard r={comune as MaturityReport & { data: MaturityScored }} />
        : <Insufficient r={comune as MaturityReport & { data: MaturityInsufficient }} region={region} />}
    </Section>
  );
}
