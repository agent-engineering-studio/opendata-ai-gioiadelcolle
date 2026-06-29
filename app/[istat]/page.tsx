import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnalysisByIstat } from "@/lib/content";
import { getCounts, getLatestUpdates } from "@/lib/preferences";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Kpis from "@/components/Kpis";
import Swot from "@/components/Swot";
import Fonti from "@/components/Fonti";
import Footer from "@/components/Footer";
import CardGrid from "@/components/CardGrid";
import { Section, SectionHead } from "@/components/Section";

export const dynamic = "force-dynamic"; // conteggi/voti sempre freschi

export async function generateMetadata({ params }: { params: Promise<{ istat: string }> }): Promise<Metadata> {
  const { istat } = await params;
  const a = getAnalysisByIstat(istat);
  if (!a) return { title: "Analisi non trovata" };
  const title = `${a.comune} — Analisi del territorio`;
  const description = a.intro.text;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CityPage({ params }: { params: Promise<{ istat: string }> }) {
  const { istat } = await params;
  const a = getAnalysisByIstat(istat);
  if (!a) notFound();

  const [counts, updates] = await Promise.all([
    getCounts(a.istat, a.idAnalysis),
    getLatestUpdates(a.istat, a.idAnalysis),
  ]);

  return (
    <>
      <Nav comune={a.comune} />
      <Hero a={a} />
      <Kpis a={a} />
      <Swot a={a} />

      {/* Proposte */}
      <Section id="proposte">
        <SectionHead
          eyebrow="Proposte operative"
          title="Proposte per il territorio"
          text="Ogni proposta nasce da uno scarto tra i dati e quanto realizzato. Esprimi il tuo sostegno di cittadino e condividi la card."
        />
        <CardGrid istat={a.istat} idAnalysis={a.idAnalysis} items={a.proposte} initialCounts={counts} updates={updates} minColWidth={380} footerBg="#FBF8F1" />
      </Section>

      {/* Idee */}
      <Section id="idee" bg="#FBF8F1">
        <SectionHead
          eyebrow="Idee per il territorio"
          title="Idee che nascono dai dati"
          text="Confronti con comuni simili, bisogni scoperti, progetti fermi e risorse disponibili: spunti per trasformare i divari del territorio in opportunità. Sostieni le idee che ti convincono."
        />
        <CardGrid istat={a.istat} idAnalysis={a.idAnalysis} items={a.idee} initialCounts={counts} updates={updates} minColWidth={330} footerBg="#FAF6EE" />
      </Section>

      {/* Marketing */}
      <Section id="marketing">
        <SectionHead
          eyebrow="Marketing territoriale"
          title="Spunti di posizionamento e attrattività"
          text="Ogni spunto cita una premessa locale e un precedente esterno. Non sono atti amministrativi né progetti finanziati."
        />
        {a.marketing.map((g) => (
          <div key={g.group}>
            <div style={{ margin: "36px 0 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <h3 style={{ margin: 0, font: "600 20px 'Spectral'", color: "#211E1A", whiteSpace: "nowrap" }}>{g.group}</h3>
              <div style={{ flex: 1, height: 1, background: "#E0D7C4" }} />
            </div>
            <CardGrid istat={a.istat} idAnalysis={a.idAnalysis} items={g.items} initialCounts={counts} updates={updates} minColWidth={360} footerBg="#FBF8F1" />
          </div>
        ))}
      </Section>

      <Fonti a={a} />
      <Footer a={a} />
    </>
  );
}
