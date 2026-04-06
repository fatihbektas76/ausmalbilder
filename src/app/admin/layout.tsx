"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Upload", href: "/admin/upload" },
  { label: "Kategorien", href: "/admin/categories" },
  { label: "Bilder", href: "/admin/images" },
  { label: "Blog", href: "/admin/blog" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F7F6F2]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white">
        <div className="p-5">
          <Link href="/admin" className="text-lg font-bold">
            <span className="text-[#1D1448]">Admin</span>
            <span className="text-[#E8490F]">Panel</span>
          </Link>
        </div>

        <nav className="mt-2 space-y-1 px-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#E8490F]/10 text-[#E8490F]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#1D1448]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-200 p-3">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
          >
            Zur Website
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/admin/auth", { method: "DELETE" });
              window.location.href = "/admin/login";
            }}
            className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
          >
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
