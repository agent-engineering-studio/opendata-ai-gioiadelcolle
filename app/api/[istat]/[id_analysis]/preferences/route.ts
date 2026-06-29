import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserVotes, toggleVote } from "@/lib/preferences";
import { getAnalysisByIstat, findItem } from "@/lib/content";

// GET: gli item_id votati dall'utente corrente (vuoto se non loggato).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ istat: string; id_analysis: string }> },
) {
  const { istat, id_analysis } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ votes: [] });
  const votes = await getUserVotes(istat, id_analysis, userId);
  return NextResponse.json({ votes });
}

// POST: toggle del voto (login Clerk obbligatorio). Body: { itemId }.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ istat: string; id_analysis: string }> },
) {
  const { istat, id_analysis } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Autenticazione richiesta." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { itemId?: string } | null;
  const itemId = body?.itemId;
  if (!itemId) {
    return NextResponse.json({ error: "itemId mancante." }, { status: 400 });
  }

  // Valida che l'item appartenga davvero a questa analisi (evita id arbitrari).
  const analysis = getAnalysisByIstat(istat);
  const item = analysis && analysis.idAnalysis === id_analysis ? findItem(analysis, itemId) : null;
  if (!item) {
    return NextResponse.json({ error: "Item non valido per questa analisi." }, { status: 404 });
  }

  const result = await toggleVote(istat, id_analysis, userId, itemId, item.type);
  return NextResponse.json(result);
}
