"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarRange,
  ClipboardList,
  Megaphone,
  LogOut,
  Search,
  Bell,
  Settings,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SESSION_KEY } from "@/lib/auth";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const isLogin = path === "/admin/login";
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    router.replace("/admin/login");
  }

  if (isLogin) return <>{children}</>;

  const nav = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/blocks", icon: Building2, label: "Blocks" },
    { href: "/admin/departments", icon: ClipboardList, label: "Departments" },
    { href: "/admin/roster", icon: Users, label: "Roster" },
    { href: "/admin/leaves", icon: CalendarRange, label: "Leaves" },
    { href: "/admin/reports", icon: FileText, label: "Reports" },
    { href: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  ];

  return (
    <div className="-mx-4 md:flex md:gap-4">
      {/* Sidebar (desktop) */}
      <aside className="no-print hidden md:block w-56 shrink-0 sticky top-20 self-start">
        <div className="card p-2">
          {nav.map((n) => {
            const active = path === n.href || (n.href !== "/admin" && path?.startsWith(n.href));
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-gradient-to-r from-blue-700 to-indigo-900 text-white shadow-lg shadow-blue-950/10"
                    : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-800"
                }`}
              >
                <Icon size={16} /> {n.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
        <div className="mt-3 text-[11px] text-slate-400 px-1">
          Live clock <span className="font-mono">{now}</span>
        </div>
      </aside>

      {/* Mobile top tabs */}
      <div className="no-print md:hidden px-4 pb-2 overflow-x-auto flex gap-1 text-xs">
        {nav.map((n) => {
          const active = path === n.href;
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full border ${
                active
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white border-slate-200"
              }`}
            >
              <Icon size={12} /> {n.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 whitespace-nowrap"
        >
          <LogOut size={12} /> Sign out
        </button>
      </div>

      <section className="flex-1 px-4 md:px-0 pb-28 print:px-0 print:pb-0">{children}</section>

      {/* Floating action bar */}
      <FloatingBar />
    </div>
  );
}

function FloatingBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/admin/student/${encodeURIComponent(q.trim())}`);
  }

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-40 w-[min(720px,calc(100%-1rem))]"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="no-print rounded-2xl bg-slate-900/95 backdrop-blur text-white shadow-2xl ring-1 ring-white/10 flex items-center gap-2 px-3 py-2">
        <form onSubmit={go} className="flex items-center gap-2 flex-1">
          <Search size={16} className="text-slate-300" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to roll no (e.g. 21M001) or name…"
            className="bg-transparent flex-1 outline-none placeholder:text-slate-400 text-sm"
          />
          <button className="text-xs bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-md">Go</button>
        </form>
        <span className="hidden sm:inline w-px h-5 bg-white/15" />
        <Link href="/admin/announcements" className="p-2 rounded-lg hover:bg-white/10 relative" title="Announcements">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        </Link>
        <Link href="/admin/leaves" className="p-2 rounded-lg hover:bg-white/10" title="Leave Inbox">
          <ClipboardList size={16} />
        </Link>
        <button className="p-2 rounded-lg hover:bg-white/10" title="Settings">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
