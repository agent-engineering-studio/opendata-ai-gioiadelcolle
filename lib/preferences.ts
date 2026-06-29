import { sql } from "@/lib/db";
import type { CardUpdate, CountsMap, ItemType } from "@/lib/types";

// ── Preferenze ("Sostieni") — scoped su (istat, id_analysis, item_id) ──

/** Conteggi aggregati dei voti per ogni item dell'analisi. */
export async function getCounts(istat: string, idAnalysis: string): Promise<CountsMap> {
  const rows = (await sql`
    SELECT item_id, count(*)::int AS n
    FROM city_preferences
    WHERE istat = ${istat} AND id_analysis = ${idAnalysis}
    GROUP BY item_id
  `) as { item_id: string; n: number }[];
  const map: CountsMap = {};
  for (const r of rows) map[r.item_id] = r.n;
  return map;
}

/** Gli item_id votati da uno specifico utente. */
export async function getUserVotes(
  istat: string,
  idAnalysis: string,
  userId: string,
): Promise<string[]> {
  const rows = (await sql`
    SELECT item_id
    FROM city_preferences
    WHERE istat = ${istat} AND id_analysis = ${idAnalysis} AND clerk_user_id = ${userId}
  `) as { item_id: string }[];
  return rows.map((r) => r.item_id);
}

/** Toggle del voto: ritorna lo stato finale (voted) e il nuovo conteggio. */
export async function toggleVote(
  istat: string,
  idAnalysis: string,
  userId: string,
  itemId: string,
  itemType: ItemType,
): Promise<{ voted: boolean; count: number }> {
  const deleted = (await sql`
    DELETE FROM city_preferences
    WHERE istat = ${istat} AND id_analysis = ${idAnalysis}
      AND clerk_user_id = ${userId} AND item_id = ${itemId}
    RETURNING id
  `) as { id: number }[];

  if (deleted.length === 0) {
    await sql`
      INSERT INTO city_preferences (istat, id_analysis, clerk_user_id, item_id, item_type)
      VALUES (${istat}, ${idAnalysis}, ${userId}, ${itemId}, ${itemType})
      ON CONFLICT (clerk_user_id, istat, id_analysis, item_id) DO NOTHING
    `;
  }

  const countRows = (await sql`
    SELECT count(*)::int AS n
    FROM city_preferences
    WHERE istat = ${istat} AND id_analysis = ${idAnalysis} AND item_id = ${itemId}
  `) as { n: number }[];

  return { voted: deleted.length === 0, count: countRows[0]?.n ?? 0 };
}

// ── Aggiornamenti / verifiche delle card (card_updates) ──

/** Ultimo stato verificato per ogni card dell'analisi (1 riga per item_id). */
export async function getLatestUpdates(
  istat: string,
  idAnalysis: string,
): Promise<Record<string, CardUpdate>> {
  const rows = (await sql`
    SELECT DISTINCT ON (item_id)
      item_id, status, divergence, note, source, effective_date, verified_by, created_at
    FROM card_updates
    WHERE istat = ${istat} AND id_analysis = ${idAnalysis}
    ORDER BY item_id, created_at DESC
  `) as {
    item_id: string;
    status: string;
    divergence: boolean;
    note: string | null;
    source: string | null;
    effective_date: string | null;
    verified_by: string;
    created_at: string;
  }[];

  const map: Record<string, CardUpdate> = {};
  for (const r of rows) {
    map[r.item_id] = {
      itemId: r.item_id,
      status: r.status,
      divergence: r.divergence,
      note: r.note,
      source: r.source,
      effectiveDate: r.effective_date,
      verifiedBy: r.verified_by,
      createdAt: r.created_at,
    };
  }
  return map;
}

/** Cronologia completa degli aggiornamenti di una card (timeline). */
export async function getUpdateHistory(
  istat: string,
  idAnalysis: string,
  itemId: string,
): Promise<CardUpdate[]> {
  const rows = (await sql`
    SELECT item_id, status, divergence, note, source, effective_date, verified_by, created_at
    FROM card_updates
    WHERE istat = ${istat} AND id_analysis = ${idAnalysis} AND item_id = ${itemId}
    ORDER BY created_at DESC
  `) as {
    item_id: string;
    status: string;
    divergence: boolean;
    note: string | null;
    source: string | null;
    effective_date: string | null;
    verified_by: string;
    created_at: string;
  }[];
  return rows.map((r) => ({
    itemId: r.item_id,
    status: r.status,
    divergence: r.divergence,
    note: r.note,
    source: r.source,
    effectiveDate: r.effective_date,
    verifiedBy: r.verified_by,
    createdAt: r.created_at,
  }));
}

export interface NewUpdate {
  status: string;
  divergence?: boolean;
  note?: string | null;
  source?: string | null;
  effectiveDate?: string | null;
}

/** Inserisce un nuovo aggiornamento di verifica (append-only). */
export async function insertUpdate(
  istat: string,
  idAnalysis: string,
  itemId: string,
  verifiedBy: string,
  u: NewUpdate,
): Promise<CardUpdate> {
  const rows = (await sql`
    INSERT INTO card_updates
      (istat, id_analysis, item_id, status, divergence, note, source, effective_date, verified_by)
    VALUES
      (${istat}, ${idAnalysis}, ${itemId}, ${u.status}, ${u.divergence ?? false},
       ${u.note ?? null}, ${u.source ?? null}, ${u.effectiveDate ?? null}, ${verifiedBy})
    RETURNING item_id, status, divergence, note, source, effective_date, verified_by, created_at
  `) as {
    item_id: string;
    status: string;
    divergence: boolean;
    note: string | null;
    source: string | null;
    effective_date: string | null;
    verified_by: string;
    created_at: string;
  }[];
  const r = rows[0];
  return {
    itemId: r.item_id,
    status: r.status,
    divergence: r.divergence,
    note: r.note,
    source: r.source,
    effectiveDate: r.effective_date,
    verifiedBy: r.verified_by,
    createdAt: r.created_at,
  };
}
