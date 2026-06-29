"use client";

import { useState } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import type { AnalysisItem, CardUpdate } from "@/lib/types";
import { accentFor } from "@/lib/types";
import { useEnteAccess } from "@/lib/useEnteAccess";
import ShareMenu from "./ShareMenu";
import EnteUpdateForm from "./EnteUpdateForm";
import CategoryIcon from "./CategoryIcon";

const STATUS_LABEL: Record<string, string> = {
  confermato: "Confermato dall'ente",
  in_corso: "In corso",
  completato: "Completato",
  fermo: "Fermo",
  rettificato: "Rettificato",
  superato: "Superato",
};

function StatusBadge({ u }: { u: CardUpdate }) {
  const label = STATUS_LABEL[u.status] ?? u.status;
  const color = u.divergence ? "#A8432A" : "#2C5545";
  const date = u.effectiveDate
    ? new Date(u.effectiveDate).toLocaleDateString("it-IT")
    : new Date(u.createdAt).toLocaleDateString("it-IT");
  return (
    <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px dashed #E6DECF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, font: "600 11px 'Archivo'", color: "#fff", background: color, borderRadius: 999, padding: "3px 9px" }}>
          {u.divergence ? "⚠" : "✓"} {label}
        </span>
        <span style={{ font: "400 11px 'IBM Plex Mono'", color: "#9A8E78" }}>verificato il {date}</span>
      </div>
      {u.note && <p style={{ margin: "7px 0 0", font: "400 12.5px/1.5 'Archivo'", color: "#5A5346" }}>{u.note}</p>}
      {u.source && <p style={{ margin: "3px 0 0", font: "400 11px 'IBM Plex Mono'", color: "#9A8E78" }}>Fonte: {u.source}</p>}
    </div>
  );
}

export default function Card({
  item,
  count,
  voted,
  update,
  onVote,
  istat,
  idAnalysis,
  footerBg = "#FBF8F1",
}: {
  item: AnalysisItem;
  count: number;
  voted: boolean;
  update?: CardUpdate | null;
  onVote: (item: AnalysisItem) => void;
  istat: string;
  idAnalysis: string;
  footerBg?: string;
}) {
  const { isSignedIn } = useAuth();
  const { canEdit } = useEnteAccess(istat);
  const [currentUpdate, setCurrentUpdate] = useState<CardUpdate | null>(update ?? null);
  const accent = accentFor(item.category);

  const likeBtn = (
    <button
      onClick={() => isSignedIn && onVote(item)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
        border: voted ? "1px solid #A8432A" : "1px solid #D8CDB8",
        background: voted ? "#A8432A" : "#fff",
        color: voted ? "#fff" : "#5A5346",
        borderRadius: 999, padding: "7px 14px", font: "600 13px 'Archivo'",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={voted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={voted ? 0 : 1.8}>
        <path d="M12 20s-6.6-4.1-9.1-8.2C1.5 9.5 2.7 6.6 5.5 6.6c1.7 0 2.9 1 3.6 2 .7-1 1.9-2 3.6-2 2.8 0 4 2.9 2.6 5.5C18.6 15.9 12 20 12 20z" />
      </svg>
      <span>{voted ? "Sostengo" : "Sostieni"} · {count}</span>
    </button>
  );

  return (
    <article id={item.id} className="card" style={{ position: "relative", display: "flex", flexDirection: "column", background: "#fff", border: "1px solid #E6DECF", borderRadius: 6, overflow: "hidden", scrollMarginTop: 84 }}>
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "20px 22px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {item.category && (
          <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, font: "600 11px 'Archivo'", letterSpacing: ".09em", textTransform: "uppercase", color: accent }}>
            <CategoryIcon category={item.category} size={14} />
            {item.category}
          </span>
        )}
        <h3 style={{ margin: 0, font: "600 20px/1.26 'Spectral'", color: "#211E1A" }}>{item.title}</h3>
        {item.badges.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {item.badges.map((b) => (
              <span key={b} style={{ font: "500 11px 'Archivo'", color: "#6B6356", background: "#F4EEE1", border: "1px solid #E6DECF", padding: "3px 9px", borderRadius: 999 }}>{b}</span>
            ))}
          </div>
        )}
        <p style={{ margin: 0, font: "400 14px/1.62 'Archivo'", color: "#4A4439" }}>{item.text}</p>
        {item.funding && (
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", paddingTop: 13, borderTop: "1px dashed #E6DECF" }}>
            <span style={{ font: "600 10px 'Archivo'", letterSpacing: ".07em", textTransform: "uppercase", color: "#A8432A", whiteSpace: "nowrap", paddingTop: 3 }}>Finanz.</span>
            <span style={{ font: "500 12.5px/1.5 'Archivo'", color: "#5A5346" }}>{item.funding}</span>
          </div>
        )}
        {currentUpdate && <StatusBadge u={currentUpdate} />}
        {canEdit && (
          <div style={{ marginTop: currentUpdate ? 10 : "auto", paddingTop: currentUpdate ? 0 : 12, borderTop: currentUpdate ? "none" : "1px dashed #E6DECF" }}>
            <EnteUpdateForm
              istat={istat}
              idAnalysis={idAnalysis}
              itemId={item.id}
              itemTitle={item.title}
              onSubmitted={setCurrentUpdate}
            />
          </div>
        )}
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "11px 16px", borderTop: "1px solid #EFE8DA", background: footerBg }}>
        {isSignedIn ? likeBtn : <SignInButton mode="modal">{likeBtn}</SignInButton>}
        <ShareMenu title={item.title} anchorId={item.id} />
      </div>
    </article>
  );
}
