# Analisi del territorio

Sito Next.js 15 (App Router) full-stack per pubblicare le **analisi territoriali** dei comuni
(generate da [opendata-ai](../opendata-ai)) con **voto cittadino** ("Sostieni") e **condivisione**
per ogni proposta/idea/spunto, più una **timeline di verifiche dell'ente** quando lo stato reale
diverge dai dati pubblici.

Comune attivo: **Gioia del Colle (072021)**. L'architettura è già predisposta per più comuni.

## Stack

| Ambito | Tecnologia |
|---|---|
| Framework | Next.js 15 App Router, React 19, TypeScript — frontend **e** backend (Route Handlers) |
| Auth | `@clerk/nextjs` (stessa app Clerk di opendata-ai) |
| DB | Neon Postgres serverless (`@neondatabase/serverless`) — stesso progetto `opendata-ai` |
| Hosting | **Vercel** (il backend Next non gira su GitHub Pages, che è solo statico) |

## Sviluppo locale

```bash
npm install
cp .env.local.example .env.local   # poi inserisci le chiavi (vedi sotto)
npm run dev                         # http://localhost:3001
```

`.env.local` richiede:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_…
CLERK_SECRET_KEY=sk_test_…
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
DATABASE_URL=postgresql://…neon.tech/neondb?sslmode=require
```

## Modello dati (Neon)

Tre tabelle (DDL applicata sul progetto Neon `opendata-ai`):

- **`city_analysis`** — registro dei report. PK `id_analysis` (es. `072021-20260626-111935`), `istat`, `comune`, `generated_at`.
- **`city_preferences`** — voti "Sostieni", scope `(istat, id_analysis, item_id)`, `UNIQUE` per utente → 1 voto/card.
- **`card_updates`** — verifiche dell'ente, **append-only** (timeline). Flag `divergence` quando il dato reale diverge da quello pubblico.

## API (Route Handlers)

| Metodo | Rotta | Auth |
|---|---|---|
| `GET` | `/api/[istat]/[id_analysis]/preferences/counts` | pubblica |
| `GET` | `/api/[istat]/[id_analysis]/preferences` | voti dell'utente loggato |
| `POST` | `/api/[istat]/[id_analysis]/preferences` `{itemId}` | **login Clerk** (toggle voto) |
| `GET` | `/api/[istat]/[id_analysis]/updates` (`?itemId=` per la timeline) | pubblica |
| `POST` | `/api/[istat]/[id_analysis]/updates` | **ruolo ente** (vedi sotto) |

## Permessi degli aggiornamenti (Clerk Organizations)

Gli aggiornamenti delle card sono riservati agli enti:

1. In Clerk, abilita **Organizations**.
2. Crea un'organizzazione per il comune e imposta `publicMetadata.istat = "072021"`.
3. Aggiungi gli operatori con ruolo **`org:admin`** o **`org:editor`**.

Il `POST /updates` (vedi `lib/auth-org.ts`) accetta solo membri di un'org il cui `istat`
coincide con quello della rotta → ogni ente aggiorna **solo** le card del proprio comune.

## Aggiungere un nuovo comune

1. `content/analisi-{istat}.ts` (stesso shape di `content/analisi-072021.ts`).
2. Registralo in `lib/content.ts` (`REGISTRY`).
3. `INSERT` in `city_analysis` la riga del report.
4. (Opzionale) crea l'organizzazione Clerk dell'ente con `publicMetadata.istat`.

## Deploy su Vercel

1. Push del repo su GitHub.
2. Importa il progetto su Vercel.
3. Imposta le env var (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, le due URL Clerk).
4. Deploy automatico ad ogni push.

## Roadmap — prossime versioni

Questo sito è la **Fase 4 · "Sito civico"** della roadmap di
[opendata-ai](../opendata-ai/docs/architettura.md): pubblicazione versionata
dell'analisi, diff *"fatto vs non fatto"* (qui i `card_updates` con flag
`divergence`) e partecipazione della community (voto "Sostieni" + condivisione).
Di seguito le cose da fare, raggruppate per versione.

### ✅ Fatto (v0.1)
- Sito Next.js full-stack su Vercel, auth Clerk, persistenza Neon.
- Voto cittadino "Sostieni" (1/persona, revocabile) + condivisione social/OG.
- Verifiche dell'ente via Clerk Organizations (`card_updates`, append-only).
- Quadro di sintesi: indice 0–100 sull'uso dei fondi, grafico capacità di
  spesa per tema, carta d'identità del comune; modali esplicative.

### v0.2 — Completare il ciclo dell'ente
- [ ] **Timeline delle verifiche**: UI pubblica che mostra lo storico
  `card_updates` per ogni card (l'API `GET /updates?itemId=` esiste già).
- [ ] **Onboarding ente**: pagina dedicata per inviti/membership all'org del
  comune (oggi via Clerk Backend API a mano).
- [ ] **Notifiche**: avvisa i sostenitori quando una card che hanno votato
  riceve un aggiornamento di stato dall'ente.
- [ ] **OG image per card**: anteprime social dedicate alla singola proposta.

### v0.3 — Multi-comune reale
- [ ] **Ingestione automatica** dei report markdown `analisi-territorio-{istat}`
  → `content/analisi-{istat}.ts` + riga `city_analysis` (oggi trascritto a mano).
- [ ] **Indice dei comuni** (`/`): elenco/ricerca dei comuni pubblicati.
- [ ] **Snapshot versionati** (allineamento Fase 4): più `id_analysis` per
  comune nel tempo, con **diff** tra una versione e la precedente.
- [ ] Generalizzare hero/branding per comune.

### v1.0 — Integrazione con opendata-ai
- [ ] **Aggancio al backend opendata-ai** (A2A / API) per generare e aggiornare
  le analisi senza passaggi manuali.
- [ ] **Anello valore⇄maturità (Fase 5)**: i gap di dato dell'analisi diventano
  "domanda di riuso" che incrocia la maturità open-data dell'ente.
- [ ] **Cruscotto dell'ente**: aggregati dei sostegni e delle verifiche per
  orientare le priorità.
- [ ] Accessibilità (WCAG), SEO/sitemap, test E2E + CI.
