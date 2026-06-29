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
