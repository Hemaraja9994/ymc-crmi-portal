"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/student", label: "Student" },
  { href: "/postings-overview", label: "Postings (Dept – Year)" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/leave-attendance", label: "Leave & Attendance" },
  { href: "/support", label: "Support" },
];

export default function HeaderNav() {
  const path = usePathname();

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 text-sm md:flex">
        <Link
          className="btn-primary mr-3"
          href="/admin"
        >
          Coordinator Login
        </Link>
        <div className="mr-2 h-5 w-px bg-slate-200" />
        {NAV.map((n) => {
          const active = path === n.href || path?.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-teal-700 text-white shadow-sm shadow-teal-900/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile scrollable tabs */}
      <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 text-xs md:hidden">
        <Link className="btn-primary whitespace-nowrap" href="/admin">Coordinator</Link>
        {NAV.map((n) => {
          const active = path === n.href || path?.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition-all ${
                active
                  ? "bg-teal-700 text-white"
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              {n.label.split(" ")[0]}
            </Link>
          );
        })}
      </div>
    </>
  );
}
