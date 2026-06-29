import { NextResponse } from "next/server";
import { getCounts } from "@/lib/preferences";

// GET pubblico: conteggi aggregati dei voti per ogni card dell'analisi.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ istat: string; id_analysis: string }> },
) {
  const { istat, id_analysis } = await params;
  const counts = await getCounts(istat, id_analysis);
  return NextResponse.json({ counts }, { headers: { "Cache-Control": "public, max-age=10" } });
}
