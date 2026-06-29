import type { AnalysisItem, CityAnalysis } from "@/lib/types";
import { ANALISI_072021 } from "@/content/analisi-072021";

// Registro dei contenuti, indicizzato per (istat → analisi corrente).
// Predisposto multi-comune: aggiungere un comune = aggiungere il suo modulo
// content/analisi-{istat}.ts e registrarlo qui.
const REGISTRY: Record<string, CityAnalysis> = {
  [ANALISI_072021.istat]: ANALISI_072021,
};

/** Comune di default mostrato dalla home. */
export const DEFAULT_ISTAT = ANALISI_072021.istat;

export function getAnalysisByIstat(istat: string): CityAnalysis | null {
  return REGISTRY[istat] ?? null;
}

export function listIstat(): string[] {
  return Object.keys(REGISTRY);
}

/** Tutti gli item votabili appiattiti (proposte + idee + marketing). */
export function allItems(a: CityAnalysis): AnalysisItem[] {
  return [...a.proposte, ...a.idee, ...a.marketing.flatMap((g) => g.items)];
}

/** Trova un item per id (per validare i POST e per l'OG della condivisione). */
export function findItem(a: CityAnalysis, itemId: string): AnalysisItem | null {
  return allItems(a).find((it) => it.id === itemId) ?? null;
}
