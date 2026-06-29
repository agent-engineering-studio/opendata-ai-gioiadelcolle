// Importa una scheda di "Maturità Open Data" da un file markdown nel database.
//
// Uso:
//   DATABASE_URL=... node scripts/import-maturity.mjs <file.md> --scope comune --istat 072021 --region Puglia
//   DATABASE_URL=... node scripts/import-maturity.mjs <file.md> --scope regione --region Puglia
//
// Riconosce due formati: "Dato insufficiente" (guida operativa) e scorecard
// con punteggio ODM. Fa upsert in maturity_reports (slug = comune-<istat> |
// regione-<region>).

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const file = process.argv[2];
const scope = arg("scope");
const istat = arg("istat");
const region = arg("region");

if (!file || !scope) {
  console.error("Uso: node scripts/import-maturity.mjs <file.md> --scope comune|regione [--istat NNN] [--region Nome]");
  process.exit(2);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL non impostata.");
  process.exit(2);
}

const md = readFileSync(file, "utf8");
const lines = md.split(/\r?\n/);

// ── sezioni per H2 ──
const sections = {};
let preamble = [];
let current = null;
for (const line of lines) {
  const h2 = line.match(/^##\s+(.+?)\s*$/);
  if (h2) {
    current = h2[1];
    sections[current] = [];
    continue;
  }
  if (line.startsWith("# ")) continue; // H1
  if (current) sections[current].push(line);
  else preamble.push(line);
}

const findSection = (kw) => {
  const key = Object.keys(sections).find((k) => k.toLowerCase().includes(kw.toLowerCase()));
  return key ? sections[key] : [];
};

// I link a opendata-ai puntano al deployment ufficiale agentengineering.it.
const mapHost = (u) => u.replace(/^https?:\/\/opendata-ai\.it/, "https://opendata-ai.agentengineering.it");
const linkRe = /^-\s*(?:[^[]*?)\[([^\]]+)\]\(([^)]+)\)(?:\s*[—–-]\s*(.+))?\s*$/;
const parseLinks = (secLines) =>
  secLines
    .map((l) => l.match(linkRe))
    .filter(Boolean)
    .map((m) => ({ label: m[1].trim(), url: mapHost(m[2].trim()), note: m[3] ? m[3].trim() : null }));

const docs = parseLinks(findSection("Documentazione"));
const references = parseLinks(findSection("Riferimenti"));

const entityName = (md.match(/^#\s*Maturità Open Data\s*[—-]\s*(.+)$/m) || [])[1]?.trim() || "Ente";
const generatedAt = (md.match(/aggiornato al\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/) || md.match(/\bil\s+([0-9]{4}-[0-9]{2}-[0-9]{2})/) || [])[1] || null;

let status, data, score = null, odmLevel = null;

if (/dato insufficiente/i.test(md)) {
  status = "insufficient";
  const intro = preamble.map((l) => l.trim()).filter((l) => l && !l.startsWith(">")).join(" ").trim();

  const whyPublish = findSection("Perché pubblicare")
    .map((l) => l.match(/^-\s*\*\*(.+?):\*\*\s*(.+)$/))
    .filter(Boolean)
    .map((m) => ({ title: m[1].trim(), text: m[2].trim() }));

  // Passi: "### N. Titolo" + paragrafo successivo
  const startLines = findSection("Come partire");
  const steps = [];
  for (let i = 0; i < startLines.length; i++) {
    const h = startLines[i].match(/^###\s*(\d+)\.\s*(.+)$/);
    if (h) {
      const text = (startLines.slice(i + 1).find((l) => l.trim() && !l.startsWith("#")) || "").trim();
      steps.push({ n: Number(h[1]), title: h[2].trim(), text });
    }
  }

  const note = (md.match(/^>\s*(Guida operativa.+)$/m) || [])[1]?.trim() || null;
  data = { status, intro, whyPublish, steps, note, docs, references };
} else {
  status = "scored";
  odmLevel = (md.match(/Livello ODM:\s*([^*·]+)/) || [])[1]?.trim() || null;
  score = Number((md.match(/Punteggio complessivo\s*\*\*([\d.]+)\/100/) || [])[1]) || null;
  const datasetCount = Number((md.match(/(\d+)\s+dataset valutati/) || [])[1]) || null;

  const dimensions = findSection("dimensioni")
    .map((l) => l.match(/^\|\s*([^|]+?)\s*\|\s*([\d.]+)\/100\s*\|/))
    .filter(Boolean)
    .filter((m) => !/dimensione/i.test(m[1]))
    .map((m) => ({ name: m[1].trim(), score: Number(m[2]) }));

  const sectorsMissing = findSection("Settori da coprire")
    .map((l) => l.match(/^-\s+(.+)$/))
    .filter(Boolean)
    .map((m) => m[1].trim());

  const recommendations = findSection("Raccomandazioni")
    .map((l) => l.match(/^-\s*\*\*\[(.+?)\]\*\*\s*(.+)$/))
    .filter(Boolean)
    .map((m) => ({ priority: m[1].trim(), text: m[2].trim() }));

  // CTA "Apri la scheda di maturità completa …" (fuori dalle sezioni standard)
  if (docs.length === 0) {
    const ctaLine = lines.find((l) => /scheda di maturità|scheda.*completa/i.test(l));
    const m = ctaLine && ctaLine.match(/\[([^\]]+)\]\(([^)]+)\)\s*(.*)$/);
    if (m) docs.push({ label: m[1].trim(), url: mapHost(m[2].trim()), note: m[3] ? m[3].trim() : null });
  }

  data = { status, odmLevel, score, datasetCount, dimensions, sectorsMissing, recommendations, docs, references };
}

const slug = scope === "comune" ? `comune-${istat}` : `regione-${(region || "").toLowerCase().replace(/\s+/g, "-")}`;

const sql = neon(process.env.DATABASE_URL);
await sql`
  INSERT INTO maturity_reports (slug, scope, istat, region, entity_name, status, score, odm_level, data, generated_at, updated_at)
  VALUES (${slug}, ${scope}, ${istat ?? null}, ${region ?? null}, ${entityName}, ${status}, ${score}, ${odmLevel}, ${JSON.stringify(data)}::jsonb, ${generatedAt}, now())
  ON CONFLICT (slug) DO UPDATE SET
    scope = excluded.scope, istat = excluded.istat, region = excluded.region,
    entity_name = excluded.entity_name, status = excluded.status, score = excluded.score,
    odm_level = excluded.odm_level, data = excluded.data, generated_at = excluded.generated_at,
    updated_at = now()
`;

console.log(`✓ Importato: slug=${slug} status=${status}` + (score != null ? ` score=${score} odm=${odmLevel}` : "") + ` entity="${entityName}"`);
