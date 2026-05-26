"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { ANNOUNCEMENTS, type Announcement } from "@/lib/announcements";

// Explicit rgba (comma syntax) for old-Android-WebKit safety (Vivo V60 etc.).
// Tailwind 3 emits `rgb(R G B / A)` which can fail on older WebKit builds.
const BADGE: Record<Announcement["category"], { bg: string; color: string; border: string }> = {
  Rule:       { bg: "rgba(244, 63, 94, 0.12)",  color: "#fb7185", border: "rgba(244, 63, 94, 0.28)"  },
  Attendance: { bg: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.28)" },
  Notice:     { bg: "rgba(59, 130, 246, 0.12)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.28)" },
  Schedule:   { bg: "rgba(16, 185, 129, 0.14)", color: "#34d399", border: "rgba(16, 185, 129, 0.30)" },
  Alert:      { bg: "rgba(244, 63, 94, 0.12)",  color: "#fb7185", border: "rgba(244, 63, 94, 0.28)"  },
};

const INTERVAL_MS = 5000;

export default function LiveUpdatesBanner() {
  const items = [...ANNOUNCEMENTS].sort((a, b) =>
    a.highlight === b.highlight ? 0 : a.highlight ? -1 : 1
  );

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0); // bump to re-trigger fade-in animation
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const advance = useCallback((to?: number) => {
    setIdx(i => {
      const next = to !== undefined ? to : (i + 1) % items.length;
      return next;
    });
    setKey(k => k + 1);
  }, [items.length]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => advance(), INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, advance]);

  const item = items[idx];

  return (
    <div
      className="relative my-4 flex h-14 items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Left anchor chip ── */}
      <div className="z-10 flex h-full shrink-0 items-center gap-1.5 bg-accent-600 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-[4px_0_12px_rgba(0,0,0,0.4)]">
        ⚡ Live Updates
      </div>

      {/* ── Current item (re-keyed to replay animation) ── */}
      <div key={key} className="animate-ticker-in flex min-w-0 flex-1 items-center gap-3 px-5 text-sm text-slate-200">
        <span
          className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold"
          style={{
            backgroundColor: BADGE[item.category].bg,
            color: BADGE[item.category].color,
            border: `1px solid ${BADGE[item.category].border}`,
          }}
        >
          {item.category.toUpperCase()}
        </span>
        <span className="min-w-0 truncate">
          <strong className="mr-1 font-medium text-white">
            {item.title.split(/[—,]/)[0].trim()}:
          </strong>
          {item.body}
        </span>
      </div>

      {/* ── Right: progress dots + next button ── */}
      <div className="flex shrink-0 items-center gap-2 pr-3">
        <div className="flex items-center gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => advance(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx
                  ? "w-4 bg-accent-400"
                  : "w-1.5 bg-slate-600 hover:bg-slate-400"
              }`}
              aria-label={`Go to notice ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => advance()}
          className="grid h-7 w-7 place-items-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
          aria-label="Next notice"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
