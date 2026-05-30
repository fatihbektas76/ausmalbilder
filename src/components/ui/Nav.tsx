"use client";

import { useState } from "react";
import Link from "next/link";
import SearchTrigger from "@/components/search/SearchTrigger";

const navLinks = [
  { label: "Ausmalbilder", href: "/ausmalbilder" },
  { label: "Tiere", href: "/tiere" },
  { label: "Mandala", href: "/mandala" },
  { label: "Saisonal", href: "/saisonal/weihnachten" },
  { label: "Spiele", href: "/spiele" },
  { label: "Online", href: "/online-ausmalen" },
  { label: "Blog", href: "/blog" },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: "1px solid #E8E4DC" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 whitespace-nowrap text-xl font-bold"
          >
            <span style={{ color: "#1D1448" }}>ausmal</span>
            <span style={{ color: "#E8490F" }}>bilder-gratis</span>
          </Link>

          {/* Desktop navigation links — centered, takes remaining space */}
          <div className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-indigo xl:px-3"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right cluster: search icon + CTA */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <SearchTrigger />
            <Link
              href="/ausmalbilder"
              className="inline-flex items-center whitespace-nowrap rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 xl:px-5"
            >
              Kostenlos starten
            </Link>
          </div>

          {/* Mobile right cluster: search icon + hamburger */}
          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            <SearchTrigger />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {mobileMenuOpen ? (
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
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="border-t lg:hidden"
          style={{ borderColor: "#E8E4DC" }}
        >
          <div className="space-y-1 px-4 pb-4 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {link.label === "Online" ? "Online Ausmalen" : link.label}
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
