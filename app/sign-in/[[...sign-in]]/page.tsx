import { SignIn } from "@clerk/nextjs";

// Pagina di accesso dedicata (oltre alla modale in Nav). Catch-all richiesto
// da Clerk per gestire i sotto-percorsi del flusso (SSO, verifica, ecc.).
export default function SignInPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F3EC", padding: 24 }}>
      <SignIn />
    </main>
  );
}
