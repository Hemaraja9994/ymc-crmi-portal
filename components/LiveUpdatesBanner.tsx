"use client";

import { ANNOUNCEMENTS, type Announcement } from "@/lib/announcements";

const BADGE: Record<Announcement["category"], string> = {
  Rule:       "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Attendance: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Notice:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Schedule:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Alert:      "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

// Shorten title to a punchy label (everything before em-dash or first comma)
function shortTitle(title: string) {
  return title.split(/[—,]/)[0].trim();
}

export default function LiveUpdatesBanner() {
  const items = [...ANNOUNCEMENTS].sort((a, b) =>
    a.highlight === b.highlight ? 0 : a.highlight ? -1 : 1
  );

  // Each item stays visible for 4 s; total cycle = 4 × n seconds
  const ITEM_SEC = 4;
  const cycleSec = ITEM_SEC * items.length;

  return (
    <div className="relative my-4 flex h-14 items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">

      {/* ── Left anchor chip ── */}
      <div className="z-10 flex h-full shrink-0 items-center gap-1.5 bg-teal-600 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-[4px_0_12px_rgba(0,0,0,0.4)]">
        ⚡ Live Updates
      </div>

      {/* ── Stacked fade items ── */}
      <div className="relative h-full flex-1 overflow-hidden px-6">
        {items.map((item, i) => (
          <div
            key={item.id}
            aria-hidden={i > 0}
            className="animate-ticker-fade absolute inset-x-6 top-0 flex h-full items-center text-sm text-slate-200 hover:[animation-play-state:paused]"
            style={{
              "--ticker-cycle": `${cycleSec}s`,
              animationDelay: `${i * ITEM_SEC}s`,
              // First item starts visible; others start hidden and slide in after delay
              opacity: i === 0 ? undefined : "0",
            } as React.CSSProperties}
          >
            <span className={`mr-3 shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-bold ${BADGE[item.category]}`}>
              {item.category.toUpperCase()}
            </span>
            <span className="min-w-0 truncate">
              <strong className="mr-1 font-medium text-white">{shortTitle(item.title)}:</strong>
              {item.body}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
