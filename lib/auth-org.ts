import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Verifica che l'utente corrente possa scrivere aggiornamenti di verifica
 * per il comune `istat`:
 *  - deve essere autenticato e dentro un'organizzazione Clerk (= un ente);
 *  - l'org deve avere publicMetadata.istat == istat (l'ente del comune giusto);
 *  - il ruolo deve essere org:admin oppure org:editor.
 *
 * Ritorna { ok, userId } oppure { ok:false, status, message } per la risposta.
 */
export async function authorizeEnte(istat: string): Promise<
  | { ok: true; userId: string }
  | { ok: false; status: number; message: string }
> {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) return { ok: false, status: 401, message: "Autenticazione richiesta." };
  if (!orgId) {
    return { ok: false, status: 403, message: "Devi operare all'interno dell'organizzazione dell'ente." };
  }

  const client = await clerkClient();
  const org = await client.organizations.getOrganization({ organizationId: orgId });
  const orgIstat = (org.publicMetadata as { istat?: string } | null)?.istat;

  if (orgIstat !== istat) {
    return { ok: false, status: 403, message: "L'organizzazione non corrisponde a questo comune." };
  }
  if (orgRole !== "org:admin" && orgRole !== "org:editor") {
    return { ok: false, status: 403, message: "Ruolo non autorizzato (serve editor o admin)." };
  }

  return { ok: true, userId };
}
