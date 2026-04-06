import Link from "next/link";

const kategorienLinks = [
  { label: "Tiere", href: "/tiere" },
  { label: "Mandala", href: "/mandala" },
  { label: "Erwachsene", href: "/erwachsene" },
  { label: "Saisonal", href: "/saisonal/weihnachten" },
];

const rechtlichesLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
];

const featuresLinks = [
  { label: "Online Ausmalen", href: "/online-ausmalen" },
  { label: "PDF Download", href: "/ausmalbilder" },
  { label: "Blog", href: "/blog" },
  { label: "Community (coming soon)", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-indigo text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-white">
              Ausmalbilder Gratis
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Deutschlands modernste Plattform für kostenlose Ausmalbilder
              — zum Ausdrucken und Online-Ausmalen.
            </p>
          </div>

          {/* Kategorien */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Kategorien
            </h3>
            <ul className="mt-4 space-y-2.5">
              {kategorienLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Rechtliches
            </h3>
            <ul className="mt-4 space-y-2.5">
              {rechtlichesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Features
            </h3>
            <ul className="mt-4 space-y-2.5">
              {featuresLinks.map((link) => (
                <li key={link.href}>
                  {link.href === "#" ? (
                    <span className="text-sm text-white/40">{link.label}</span>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/50">
            &copy; 2025 ausmalbilder-gratis.com — Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
