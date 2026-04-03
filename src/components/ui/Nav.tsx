"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Ausmalbilder", href: "/ausmalbilder" },
  { label: "Tiere", href: "/tiere" },
  { label: "Mandala", href: "/mandala" },
  { label: "Saisonal", href: "/saisonal/weihnachten" },
  { label: "Erwachsene", href: "/erwachsene" },
  { label: "Online Ausmalen", href: "/online-ausmalen" },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-indigo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0 text-xl font-bold text-white">
            Ausmalbilder Gratis
          </Link>

          {/* Desktop navigation links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA button */}
          <div className="hidden lg:block">
            <Link
              href="/ausmalbilder"
              className="inline-flex items-center rounded-full bg-brand-coral px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Kostenlos starten
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white/80 transition-colors hover:text-white lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {mobileMenuOpen ? (
              /* Close icon */
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 lg:hidden">
          <div className="space-y-1 px-4 pb-4 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/ausmalbilder"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 block rounded-full bg-brand-coral px-5 py-2.5 text-center text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              Kostenlos starten
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
