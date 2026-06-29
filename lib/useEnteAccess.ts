"use client";

import { useOrganization } from "@clerk/nextjs";

/**
 * Verifica lato client se l'utente corrente può inserire aggiornamenti di
 * verifica per il comune `istat`: deve avere attiva un'organizzazione Clerk
 * con publicMetadata.istat == istat e ruolo org:editor / org:admin.
 *
 * NB: è solo per mostrare/nascondere la UI. La sicurezza vera resta lato
 * server in lib/auth-org.ts (il POST /updates rifiuta comunque i non
 * autorizzati). Non fidarti mai del solo controllo client.
 */
export function useEnteAccess(istat: string): { canEdit: boolean; isLoaded: boolean } {
  const { organization, membership, isLoaded } = useOrganization();
  if (!isLoaded || !organization) return { canEdit: false, isLoaded: !!isLoaded };

  const orgIstat = (organization.publicMetadata as { istat?: string } | null)?.istat;
  const role = membership?.role;
  const canEdit = orgIstat === istat && (role === "org:admin" || role === "org:editor");
  return { canEdit, isLoaded: true };
}
