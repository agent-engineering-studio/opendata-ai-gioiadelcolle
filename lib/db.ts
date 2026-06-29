import { neon } from "@neondatabase/serverless";

// Driver HTTP serverless di Neon — ideale per i Route Handler su Vercel
// (nessun pool persistente da gestire). Usa lo STESSO progetto Neon di
// opendata-ai (db neondb). `sql` è una tagged template parametrizzata:
// i valori interpolati sono sempre passati come parametri (no SQL injection).
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL non impostata — configura .env.local (Neon).");
}

export const sql = neon(url);
