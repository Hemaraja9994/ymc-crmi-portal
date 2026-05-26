import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";

export const metadata: Metadata = {
  title: "YMC CRMI Portal - MBBS 2021 CBME Batch",
  description:
    "Compulsory Rotatory Medical Internship Programme - Yenepoya Medical College, Mangalore. Effective 01.06.2026.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#2E1065",
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
        {/* ── Top accent line ── */}
        <div className="h-0.5 w-full bg-gradient-to-r from-xcel-950 via-accent-500 to-xcel-950" />

        <header className="no-print sticky top-0 z-30 bg-white/95 shadow-sm shadow-slate-200/60 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
              <img
                src="/images/ymch-logo.png"
                alt="Yenepoya Medical College Logo"
                className="h-12 w-auto object-contain md:h-14 lg:h-16"
                style={{ borderRadius: 0 }}
              />
              <div className="leading-tight">
                <div className="text-sm font-bold tracking-tight text-slate-900 md:text-base lg:text-lg whitespace-nowrap">YMC CRMI Portal</div>
                <div className="hidden text-[11px] text-slate-400 font-medium sm:block">MBBS 2021 CBME · w.e.f. 01.06.2026</div>
              </div>
            </Link>

            {/* Desktop nav rendered by client component */}
            <HeaderNav />
          </div>

          {/* Mobile tabs are inside HeaderNav */}
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>

        <footer className="mx-auto max-w-7xl border-t border-slate-100 px-4 py-8 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} Yenepoya Medical College, Mangalore · CRMI Coordination Cell</span>
            <span className="font-mono text-slate-300">MBBS 2021 CBME · NMC Regulation</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
