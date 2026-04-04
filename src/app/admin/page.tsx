"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  total: number;
  live: number;
  draft: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, live: 0, draft: 0 });

  useEffect(() => {
    fetch("/api/admin/images")
      .then((r) => r.json())
      .then((data) => {
        const images = data.images || [];
        setStats({
          total: images.length,
          live: images.filter((i: any) => i.publishedAt).length,
          draft: images.filter((i: any) => !i.publishedAt).length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-[#1D1448]">Dashboard</h1>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Gesamt</p>
          <p className="mt-1 text-3xl font-bold text-[#1D1448]">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Live</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{stats.live}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Entwurf</p>
          <p className="mt-1 text-3xl font-bold text-amber-500">{stats.draft}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/admin/upload"
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E8490F]/30 bg-white p-8 transition-colors hover:border-[#E8490F] hover:bg-[#E8490F]/5"
        >
          <svg
            className="mb-3 h-10 w-10 text-[#E8490F]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <span className="text-sm font-semibold text-[#1D1448]">
            Bilder hochladen
          </span>
        </Link>

        <Link
          href="/admin/images"
          className="flex flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <svg
            className="mb-3 h-10 w-10 text-[#1D1448]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
          <span className="text-sm font-semibold text-[#1D1448]">
            Bilder verwalten
          </span>
        </Link>
      </div>
    </div>
  );
}
