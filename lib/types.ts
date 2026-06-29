// Tipi condivisi per l'analisi territoriale (predisposti multi-comune).

export type ItemType = "proposta" | "idea" | "marketing";

/** Una "card" votabile e condivisibile (proposta, idea o spunto marketing). */
export interface AnalysisItem {
  id: string; // id stabile usato come chiave voto + ancora condivisione (es. 'prop-ss100')
  type: ItemType;
  category?: string; // mappata su un colore accento
  title: string;
  text: string;
  badges: string[];
  funding?: string; // solo per le proposte
}

/** Definizione di un termine tecnico, mostrata come riquadro nella modale "i". */
export interface Glossary {
  term: string;
  def: string;
}

export interface Kpi {
  value: string;
  label: string;
  sub: string;
  info?: string; // spiegazione estesa: paragrafi separati da \n\n, **grassetto** supportato
  glossary?: Glossary;
}

export interface SwotItem {
  title: string;
  text: string;
}

export interface SwotQuadrant {
  label: string;
  tag: string;
  color: string;
  items: SwotItem[];
}

export interface MarketingGroup {
  group: string;
  items: AnalysisItem[];
}

export interface Fonte {
  src: string; // badge: JSON | CSV | OSM …
  name: string;
  meta: string;
}

/** Contenuto completo di un'analisi, identificato da (istat, idAnalysis). */
export interface CityAnalysis {
  istat: string;
  idAnalysis: string;
  comune: string;
  provincia: string;
  generatedAt: string; // ISO
  disclaimer: string;
  intro: { eyebrow: string; title: string; text: string };
  /** Indice 0–100 sull'uso dei fondi pubblici (solo dati coesione). */
  fundsScore: {
    value: number;
    spendRatioPct: number;
    completionPct: number;
    info: string;
    glossary?: Glossary;
  };
  /** Capacità di spesa per tema (per il grafico a barre). */
  spendByTheme: { label: string; pct: number }[];
  avgSpendPct: number;
  /** Numeri grandi resi "parlanti". */
  fundsSummary: { projects: number; concluded: number; totalCost: string; perCapita: string };
  highlights: { value: string; label: string; text: string; color: string; info?: string; glossary?: Glossary }[];
  /** "Carta d'identità" del comune: dati strutturali ISTAT (contesto, non performance). */
  identity: Kpi[];
  swot: SwotQuadrant[];
  proposte: AnalysisItem[];
  idee: AnalysisItem[];
  marketing: MarketingGroup[];
  fonti: Fonte[];
}

/** Colore accento per categoria (dal design .dc). */
export const CAT_COLOR: Record<string, string> = {
  "Mobilità": "#2B6A6F",
  "Cultura": "#A8432A",
  "Welfare": "#6E4B7A",
  "Lavoro": "#B5752B",
  "Commercio": "#8A6D2F",
  "Sanità": "#2C5545",
  "Istruzione": "#3A5A8C",
  "Ambiente": "#4E7A3A",
  "Impresa": "#9A3B52",
};

export function accentFor(category?: string): string {
  return (category && CAT_COLOR[category]) || "#A8432A";
}

// ── Maturità open data (importata da markdown, salvata in DB) ──

export interface MaturityScored {
  status: "scored";
  odmLevel: string | null;
  score: number | null;
  datasetCount: number | null;
  dimensions: { name: string; score: number }[];
  sectorsMissing: string[];
  recommendations: { priority: string; text: string }[];
}

export interface MaturityInsufficient {
  status: "insufficient";
  intro: string;
  whyPublish: { title: string; text: string }[];
  steps: { n: number; title: string; text: string }[];
  note: string | null;
}

export type MaturityData = MaturityScored | MaturityInsufficient;

export interface MaturityReport {
  slug: string;
  scope: "comune" | "regione";
  istat: string | null;
  region: string | null;
  entityName: string;
  status: "insufficient" | "scored";
  score: number | null;
  odmLevel: string | null;
  data: MaturityData;
  generatedAt: string | null;
}

/** Conteggi voti per item_id. */
export type CountsMap = Record<string, number>;

/** Stato di verifica corrente di una card (ultimo card_updates). */
export interface CardUpdate {
  itemId: string;
  status: string;
  divergence: boolean;
  note: string | null;
  source: string | null;
  effectiveDate: string | null;
  verifiedBy: string;
  createdAt: string;
}
