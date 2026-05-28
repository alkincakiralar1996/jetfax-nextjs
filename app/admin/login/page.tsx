"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setBusy(false);
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F3D2E] px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        <h1 className="text-2xl font-bold tracking-tight text-[#0A0A0A]">
          FaxJet Admin
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">Sign in to continue.</p>

        <label className="mt-6 block text-sm font-semibold text-[#3F3F46]">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          autoComplete="username"
          className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-[#0A0A0A] outline-none focus:border-[#1B5E47]"
        />

        <label className="mt-4 block text-sm font-semibold text-[#3F3F46]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-[#0A0A0A] outline-none focus:border-[#1B5E47]"
        />

        {error ? (
          <p className="mt-3 text-sm font-medium text-[#DC2626]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-lg bg-[#0F3D2E] py-2.5 font-semibold text-white transition hover:bg-[#1B5E47] disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
