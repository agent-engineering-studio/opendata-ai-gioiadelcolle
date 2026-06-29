import { SignUp } from "@clerk/nextjs";

// Pagina di registrazione dedicata. Catch-all richiesto da Clerk per i
// sotto-percorsi del flusso di sign-up.
export default function SignUpPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F3EC", padding: 24 }}>
      <SignUp />
    </main>
  );
}
