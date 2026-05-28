"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-medium text-[#3F3F46] transition hover:border-[#DC2626] hover:text-[#DC2626]"
    >
      Sign out
    </button>
  );
}
