import { NextResponse } from "next/server";
import { getLatestUpdates, getUpdateHistory, insertUpdate } from "@/lib/preferences";
import { getAnalysisByIstat, findItem } from "@/lib/content";
import { authorizeEnte } from "@/lib/auth-org";

// GET pubblico: ultimo stato verificato per ogni card. Con ?itemId=… ritorna
// invece la cronologia completa (timeline) di quella card.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ istat: string; id_analysis: string }> },
) {
  const { istat, id_analysis } = await params;
  const itemId = new URL(req.url).searchParams.get("itemId");

  if (itemId) {
    const history = await getUpdateHistory(istat, id_analysis, itemId);
    return NextResponse.json({ history });
  }

  const latest = await getLatestUpdates(istat, id_analysis);
  return NextResponse.json({ latest });
}

// POST riservato all'ente (Clerk Organization del comune, ruolo editor/admin).
// Body: { itemId, status, divergence?, note?, source?, effectiveDate? }.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ istat: string; id_analysis: string }> },
) {
  const { istat, id_analysis } = await params;

  const authz = await authorizeEnte(istat);
  if (!authz.ok) {
    return NextResponse.json({ error: authz.message }, { status: authz.status });
  }

  const body = (await req.json().catch(() => null)) as {
    itemId?: string;
    status?: string;
    divergence?: boolean;
    note?: string | null;
    source?: string | null;
    effectiveDate?: string | null;
  } | null;

  if (!body?.itemId || !body?.status) {
    return NextResponse.json({ error: "itemId e status sono obbligatori." }, { status: 400 });
  }

  // L'item deve appartenere a questa analisi.
  const analysis = getAnalysisByIstat(istat);
  const item = analysis && analysis.idAnalysis === id_analysis ? findItem(analysis, body.itemId) : null;
  if (!item) {
    return NextResponse.json({ error: "Item non valido per questa analisi." }, { status: 404 });
  }

  const created = await insertUpdate(istat, id_analysis, body.itemId, authz.userId, {
    status: body.status,
    divergence: body.divergence,
    note: body.note,
    source: body.source,
    effectiveDate: body.effectiveDate,
  });
  return NextResponse.json({ update: created }, { status: 201 });
}
