"use client";

import { ANNOUNCEMENTS } from "@/lib/announcements";

const DARK_BADGE: Record<string, string> = {
  Rule:     "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Alert:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Schedule: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Notice:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function LiveUpdatesBanner() {
  const items = [...ANNOUNCEMENTS].sort((a, b) =>
    a.highlight === b.highlight ? 0 : a.highlight ? -1 : 1
  );

  return (
    <div className="relative flex h-12 items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-inner">

      {/* ── Left anchor chip ── */}
      <div className="z-10 flex h-full shrink-0 items-center gap-1.5 bg-emerald-600 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-[4px_0_16px_rgba(0,0,0,0.35)]">
        <span>⚡</span> CRMI Live
      </div>

      {/* ── Scrolling ticker ── */}
      <div className="ymc-ticker min-w-0 overflow-hidden">
        <div className="ymc-marquee inline-flex items-center gap-0 whitespace-nowrap text-sm hover:[animation-play-state:paused]">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="mx-6 inline-flex items-center gap-2">
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${DARK_BADGE[item.category]}`}>
                  {item.category.toUpperCase()}
                </span>
                <strong className="text-white">{item.title}:</strong>
                <span className="text-slate-300">{item.body}</span>
              </span>
              <span className="text-slate-600">│</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
