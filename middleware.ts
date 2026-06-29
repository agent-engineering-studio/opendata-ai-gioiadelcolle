import { clerkMiddleware } from "@clerk/nextjs/server";

// La pagina e le GET pubbliche restano accessibili senza login; la protezione
// vera è applicata nei singoli Route Handler (POST voto / POST updates) con
// auth(). clerkMiddleware popola comunque la sessione su tutte le richieste.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Salta i file statici e gli asset interni di Next, processa tutto il resto.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Processa sempre le API.
    "/(api|trpc)(.*)",
  ],
};
