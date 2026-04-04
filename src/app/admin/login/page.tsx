"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const redirect = searchParams.get("redirect") || "/admin";
        router.push(redirect);
      } else {
        setError("Falsches Passwort");
      }
    } catch {
      setError("Verbindungsfehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passwort"
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E8490F] focus:outline-none"
        autoFocus
      />

      {error && <p className="mb-4 text-sm text-[#E8490F]">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#E8490F] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "..." : "Anmelden"}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2]">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#1D1448]">
          Admin Login
        </h1>
        <Suspense fallback={<div className="h-24" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
