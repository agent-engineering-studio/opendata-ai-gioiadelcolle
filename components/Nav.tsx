import { SignInButton, SignedIn, SignedOut, UserButton, OrganizationSwitcher } from "@clerk/nextjs";

const links = [
  ["#sintesi", "Sintesi"],
  ["#swot", "SWOT"],
  ["#proposte", "Proposte"],
  ["#idee", "Idee"],
  ["#marketing", "Marketing"],
  ["#fonti", "Fonti"],
];

export default function Nav({ comune, basePath = "" }: { comune: string; basePath?: string }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(247,243,236,.92)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderBottom: "1px solid #E6DECF" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "11px clamp(18px,5vw,64px)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#A8432A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: "700 14px 'Spectral'" }}>
            {comune.charAt(0)}
          </div>
          <span style={{ font: "600 15px 'Spectral'", color: "#211E1A" }}>{comune}</span>
          <span style={{ font: "500 12px 'Archivo'", color: "#9A8E78" }}>· Analisi territoriale</span>
        </div>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          {links.map(([href, label]) => (
            <a key={href} href={`${basePath}${href}`} className="navlink" style={{ font: "600 13px 'Archivo'", color: "#5A5346", textDecoration: "none", padding: "6px 11px", borderRadius: 6 }}>
              {label}
            </a>
          ))}
          <a href="/roadmap" className="navlink" style={{ font: "600 13px 'Archivo'", color: "#A8432A", textDecoration: "none", padding: "6px 11px", borderRadius: 6 }}>
            Roadmap
          </a>
          <span style={{ width: 1, height: 20, background: "#E0D7C4", margin: "0 6px" }} />
          <SignedOut>
            <SignInButton mode="modal">
              <button style={{ cursor: "pointer", border: "1px solid #A8432A", background: "#A8432A", color: "#fff", borderRadius: 999, padding: "6px 14px", font: "600 13px 'Archivo'" }}>
                Accedi
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <OrganizationSwitcher hidePersonal afterCreateOrganizationUrl="/" afterSelectOrganizationUrl="/" />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
