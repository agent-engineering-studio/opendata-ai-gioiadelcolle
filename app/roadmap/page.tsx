import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnalysisByIstat, DEFAULT_ISTAT } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Section, SectionHead } from "@/components/Section";

export const metadata: Metadata = {
  title: "Roadmap — cosa arriverà",
  description: "Le prossime evoluzioni del sito di analisi del territorio: nuove lenti di lettura, storico delle verifiche, avvisi e altro.",
};

interface RoadItem {
  title: string;
  text: string;
}
interface RoadGroup {
  label: string;
  caption: string;
  color: string;
  items: RoadItem[];
}

const GROUPS: RoadGroup[] = [
  {
    label: "In arrivo",
    caption: "su cui stiamo lavorando ora",
    color: "#2C5545",
    items: [
      {
        title: "Storico delle verifiche",
        text: "Per ogni proposta potrai vedere come cambia lo stato nel tempo: quando il Comune conferma un avanzamento, lo aggiorna o segnala che i dati pubblici non sono ancora aggiornati alla realtà.",
      },
      {
        title: "Avvisi sulle tue preferenze",
        text: "Se sostieni una proposta o un'idea, potrai scegliere di essere avvisato quando il suo stato cambia, così segui da vicino i temi che ti stanno a cuore.",
      },
    ],
  },
  {
    label: "Stiamo lavorando a",
    caption: "in arrivo più avanti",
    color: "#B5752B",
    items: [
      {
        title: "Nuove lenti di lettura",
        text: "Nuovi punti di vista per leggere gli stessi dati da angolazioni diverse: una lente «giovani e lavoro», una «ambiente e rischio», una «turismo e cultura». Ogni lente mette in evidenza i numeri e le proposte più rilevanti per quel tema.",
      },
      {
        title: "Mappa del territorio",
        text: "Una mappa interattiva con i luoghi citati nell'analisi — la stazione, i siti culturali, le aree a rischio idraulico — per capire dove ricadono concretamente proposte e numeri.",
      },
      {
        title: "Confronto nel tempo",
        text: "Un confronto semplice «prima / ora» tra una versione dell'analisi e la precedente, per vedere a colpo d'occhio cosa è cambiato nel comune.",
      },
      {
        title: "Più grafici, più chiari",
        text: "Visualizzazioni semplici per capire al volo dove vanno i fondi pubblici e quali temi vanno meglio o peggio.",
      },
    ],
  },
  {
    label: "Idee allo studio",
    caption: "ancora da valutare",
    color: "#6B6356",
    items: [
      {
        title: "La voce dei cittadini",
        text: "Uno spazio per proporre nuove idee per il territorio, non solo per sostenere quelle già presenti.",
      },
      {
        title: "Più accessibile e in più lingue",
        text: "Una navigazione più accessibile a tutti e contenuti disponibili anche in altre lingue.",
      },
    ],
  },
];

export default function RoadmapPage() {
  const a = getAnalysisByIstat(DEFAULT_ISTAT);
  if (!a) notFound();

  return (
    <>
      <Nav comune={a.comune} basePath={`/${a.istat}`} />

      <Section>
        <SectionHead
          eyebrow="Roadmap"
          title="Cosa arriverà"
          text="Questo sito è uno spazio civico in evoluzione. Qui trovi, in parole semplici, le prossime migliorie al modo in cui leggi e sostieni l'analisi del tuo comune. È un elenco indicativo, aperto ai suggerimenti: l'ordine e i tempi possono cambiare."
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {GROUPS.map((g) => (
            <div key={g.label}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
                <span style={{ flex: "none", width: 11, height: 11, borderRadius: "50%", background: g.color }} />
                <h3 style={{ margin: 0, font: "600 19px 'Spectral'", color: "#211E1A", whiteSpace: "nowrap" }}>{g.label}</h3>
                <span style={{ font: "500 12px 'Archivo'", color: "#9A8E78", whiteSpace: "nowrap" }}>{g.caption}</span>
                <div style={{ flex: 1, height: 1, background: "#E0D7C4" }} />
              </div>
              <div className="card-grid" style={{ "--col": "320px" } as React.CSSProperties}>
                {g.items.map((it) => (
                  <article key={it.title} className="card" style={{ display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E6DECF", borderTop: `3px solid ${g.color}`, borderRadius: 6, padding: "18px 20px" }}>
                    <h4 style={{ margin: "0 0 8px", font: "600 16px/1.3 'Spectral'", color: "#211E1A" }}>{it.title}</h4>
                    <p style={{ margin: 0, font: "400 13.5px/1.6 'Archivo'", color: "#4A4439" }}>{it.text}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ margin: "36px 0 0", font: "400 13.5px/1.6 'Archivo'", color: "#6B6356" }}>
          Hai un&apos;idea o un suggerimento? Questo è uno spazio di confronto civico sul valore dei dati pubblici: le tue preferenze sulle proposte aiutano a capire quali temi sono più sentiti dalla comunità.
        </p>
      </Section>

      <Footer a={a} />
    </>
  );
}
