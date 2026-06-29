import type { CSSProperties } from "react";

/** Intestazione di sezione riusabile (eyebrow + titolo + testo). */
export function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div style={{ maxWidth: 820, marginBottom: 30 }}>
      <div style={{ font: "600 12px 'Archivo'", letterSpacing: ".16em", textTransform: "uppercase", color: "#A8432A", marginBottom: 10 }}>
        {eyebrow}
      </div>
      <h2 style={{ margin: "0 0 14px", font: "600 clamp(28px,4vw,42px)/1.08 'Spectral'", color: "#211E1A", letterSpacing: "-.01em" }}>
        {title}
      </h2>
      {text && <p style={{ margin: 0, font: "400 16px/1.65 'Archivo'", color: "#4A4439" }}>{text}</p>}
    </div>
  );
}

export function Section({ id, bg, children }: { id?: string; bg?: string; children: React.ReactNode }) {
  const wrap: CSSProperties | undefined = bg
    ? { background: bg, borderTop: "1px solid #E6DECF", borderBottom: "1px solid #E6DECF" }
    : undefined;
  const inner: CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "clamp(48px,7vw,84px) clamp(18px,5vw,64px)",
    scrollMarginTop: 72,
  };
  const content = (
    <section id={id} style={inner}>
      {children}
    </section>
  );
  return wrap ? <div style={wrap}>{content}</div> : content;
}
