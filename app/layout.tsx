import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Stethoscope } from "lucide-react";

export const metadata: Metadata = {
  title: "YMC CRMI Portal - MBBS 2021 CBME Batch",
  description:
    "Compulsory Rotatory Medical Internship Programme - Yenepoya Medical College, Mangalore. Effective 01.06.2026.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#0d9488",
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
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-slate-50/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white shadow-lg shadow-blue-950/10">
                <Stethoscope size={18} />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold tracking-tight md:text-base">YMC CRMI Portal</div>
                <div className="text-[11px] text-slate-500">MBBS 2021 CBME - w.e.f. 01.06.2026</div>
              </div>
            </Link>
            <nav className="hidden items-center gap-1 text-sm md:flex">
              <Link className="btn-primary mr-2" href="/admin">
                Coordinator Login
              </Link>
              <Link className="btn-ghost" href="/student">
                Student
              </Link>
              <Link className="btn-ghost" href="/postings-overview">
                Postings (Dept - Year)
              </Link>
              <Link className="btn-ghost" href="/guidelines">
                Guidelines
              </Link>
              <Link className="btn-ghost" href="/leave-attendance">
                Leave & Attendance
              </Link>
              <Link className="btn-ghost" href="/support">
                Support
              </Link>
            </nav>
          </div>
          <div className="flex gap-1 overflow-x-auto border-t border-white/70 px-2 py-2 text-xs md:hidden">
            <Link className="btn-primary whitespace-nowrap" href="/admin">
              Coordinator
            </Link>
            <Link className="btn-ghost whitespace-nowrap" href="/student">
              Student
            </Link>
            <Link className="btn-ghost whitespace-nowrap" href="/postings-overview">
              Postings
            </Link>
            <Link className="btn-ghost whitespace-nowrap" href="/guidelines">
              Guidelines
            </Link>
            <Link className="btn-ghost whitespace-nowrap" href="/leave-attendance">
              Leave
            </Link>
            <Link className="btn-ghost whitespace-nowrap" href="/support">
              Support
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-7xl px-4 py-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Yenepoya Medical College, Mangalore. CRMI Coordination Cell.
        </footer>
      </body>
    </html>
  );
}
