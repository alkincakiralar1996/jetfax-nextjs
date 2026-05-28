import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/purchases", label: "Purchases" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAFAF7] text-[#0A0A0A]">
      <aside className="flex w-56 flex-col border-r border-[#0F3D2E]/10 bg-white px-4 py-6">
        <div className="px-2 text-lg font-bold tracking-tight">FaxJet Admin</div>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#3F3F46] transition hover:bg-[#E8F5EF] hover:text-[#0F3D2E]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-2">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto px-8 py-8">{children}</main>
    </div>
  );
}
