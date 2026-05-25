import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Stethoscope } from "lucide-react";

export const metadata: Metadata = {
  title: "YMC CRMI Portal — MBBS 2021 CBME Batch",
  description:
    "Compulsory Rotatory Medical Internship Programme — Yenepoya Medical College, Mangalore. Effective 01.06.2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-xcel-600 to-xcel-800 text-white grid place-items-center shadow-sm">
                <Stethoscope size={18} />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-sm md:text-base tracking-tight">YMC CRMI Portal</div>
                <div className="text-[11px] text-slate-500">MBBS 2021 CBME · w.e.f. 01.06.2026</div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm">
              <Link className="btn-ghost" href="/student">Student</Link>
              <Link className="btn-ghost" href="/guidelines">Guidelines</Link>
              <Link className="btn-ghost" href="/posting-guidelines">Postings</Link>
              <Link className="btn-ghost" href="/leave-attendance">Leave & Attendance</Link>
              <Link className="btn-ghost" href="/support">Support</Link>
              <Link className="btn-primary ml-2" href="/admin">Coordinator Login</Link>
            </nav>
          </div>
          <div className="md:hidden border-t border-slate-200 px-2 py-2 flex overflow-x-auto gap-1 text-xs">
            <Link className="btn-ghost whitespace-nowrap" href="/student">Student</Link>
            <Link className="btn-ghost whitespace-nowrap" href="/guidelines">Guidelines</Link>
            <Link className="btn-ghost whitespace-nowrap" href="/posting-guidelines">Postings</Link>
            <Link className="btn-ghost whitespace-nowrap" href="/leave-attendance">Leave</Link>
            <Link className="btn-ghost whitespace-nowrap" href="/support">Support</Link>
            <Link className="btn-primary whitespace-nowrap" href="/admin">Coordinator</Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <footer className="max-w-7xl mx-auto px-4 py-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Yenepoya Medical College, Mangalore. CRMI Coordination Cell.
        </footer>
      </body>
    </html>
  );
}
