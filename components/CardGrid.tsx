"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import type { AnalysisItem, CardUpdate, CountsMap } from "@/lib/types";
import Card from "./Card";

interface Props {
  istat: string;
  idAnalysis: string;
  items: AnalysisItem[];
  initialCounts: CountsMap;
  updates: Record<string, CardUpdate>;
  minColWidth?: number;
  footerBg?: string;
}

export default function CardGrid({ istat, idAnalysis, items, initialCounts, updates, minColWidth = 380, footerBg }: Props) {
  const { isSignedIn, getToken } = useAuth();
  const [counts, setCounts] = useState<CountsMap>(initialCounts);
  const [voted, setVoted] = useState<Set<string>>(new Set());

  const base = `/api/${istat}/${idAnalysis}/preferences`;

  // Al login (o al mount se già loggato) recupera i voti dell'utente.
  useEffect(() => {
    let cancelled = false;
    if (!isSignedIn) {
      setVoted(new Set());
      return;
    }
    (async () => {
      try {
        const res = await fetch(base, { headers: { Authorization: `Bearer ${await getToken()}` } });
        if (!res.ok) return;
        const data = (await res.json()) as { votes: string[] };
        if (!cancelled) setVoted(new Set(data.votes));
      } catch {
        /* noop */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, base, getToken]);

  const onVote = useCallback(
    async (item: AnalysisItem) => {
      // Aggiornamento ottimistico.
      const wasVoted = voted.has(item.id);
      setVoted((prev) => {
        const next = new Set(prev);
        if (wasVoted) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
      setCounts((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + (wasVoted ? -1 : 1) }));

      try {
        const res = await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getToken()}` },
          body: JSON.stringify({ itemId: item.id }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { voted: boolean; count: number };
        // Riconcilia con il valore reale del server.
        setCounts((prev) => ({ ...prev, [item.id]: data.count }));
        setVoted((prev) => {
          const next = new Set(prev);
          if (data.voted) next.add(item.id);
          else next.delete(item.id);
          return next;
        });
      } catch {
        // Rollback in caso di errore.
        setVoted((prev) => {
          const next = new Set(prev);
          if (wasVoted) next.add(item.id);
          else next.delete(item.id);
          return next;
        });
        setCounts((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + (wasVoted ? 1 : -1) }));
      }
    },
    [voted, base, getToken],
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${minColWidth}px,1fr))`, gap: 20 }}>
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          count={counts[item.id] ?? 0}
          voted={voted.has(item.id)}
          update={updates[item.id] ?? null}
          onVote={onVote}
          istat={istat}
          idAnalysis={idAnalysis}
          footerBg={footerBg}
        />
      ))}
    </div>
  );
}
