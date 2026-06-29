import { sql } from "@/lib/db";
import type { MaturityData, MaturityReport } from "@/lib/types";

interface Row {
  slug: string;
  scope: "comune" | "regione";
  istat: string | null;
  region: string | null;
  entity_name: string;
  status: "insufficient" | "scored";
  score: number | string | null;
  odm_level: string | null;
  data: MaturityData;
  generated_at: string | null;
}

function map(r: Row): MaturityReport {
  return {
    slug: r.slug,
    scope: r.scope,
    istat: r.istat,
    region: r.region,
    entityName: r.entity_name,
    status: r.status,
    score: r.score != null ? Number(r.score) : null,
    odmLevel: r.odm_level,
    data: r.data,
    generatedAt: r.generated_at,
  };
}

export async function getComuneMaturity(istat: string): Promise<MaturityReport | null> {
  const rows = (await sql`
    SELECT slug, scope, istat, region, entity_name, status, score, odm_level, data, generated_at
    FROM maturity_reports
    WHERE scope = 'comune' AND istat = ${istat} LIMIT 1
  `) as Row[];
  return rows[0] ? map(rows[0]) : null;
}

export async function getRegionMaturity(region: string): Promise<MaturityReport | null> {
  const rows = (await sql`
    SELECT slug, scope, istat, region, entity_name, status, score, odm_level, data, generated_at
    FROM maturity_reports
    WHERE scope = 'regione' AND region = ${region} LIMIT 1
  `) as Row[];
  return rows[0] ? map(rows[0]) : null;
}
