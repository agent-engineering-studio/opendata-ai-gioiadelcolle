import type { NextConfig } from "next";

// Full-stack su Vercel: Route Handlers come backend, middleware Clerk attivo.
// (NON è output:"export" — quello servirebbe per GitHub Pages statico, che
// non può eseguire il backend né connettersi a Neon.)
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
