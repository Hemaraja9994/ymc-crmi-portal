"use client";

import { Megaphone, Star } from "lucide-react";
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

// Seconds of scroll per announcement — keeps speed readable regardless of count.
const SECONDS_PER_ITEM = 8;

function AnnouncementItem({ item }: { item: Announcement }) {
  const badge = BADGE[item.category];
  return (
    <div className="flex shrink-0 items-center gap-3 px-6 text-sm text-slate-200">
      {item.highlight && (
        <Star size={13} className="shrink-0 fill-accent-400 text-accent-400" aria-hidden />
      )}
      <span
        className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold"
        style={{
          backgroundColor: badge.bg,
          color: badge.color,
          border: `1px solid ${badge.border}`,
        }}
      >
        {item.category.toUpperCase()}
      </span>
      <span className="whitespace-nowrap">
        <strong className="mr-1 font-medium text-white">
          {item.title.split(/[—,]/)[0].trim()}:
        </strong>
        {item.body}
      </span>
      {/* Separator dot between consecutive items */}
      <span className="ml-3 text-slate-600" aria-hidden>•</span>
    </div>
  );
}

export default function LiveUpdatesBanner() {
  // Highlighted items first, then the rest (order within the scroll).
  const items = [...ANNOUNCEMENTS].sort((a, b) =>
    a.highlight === b.highlight ? 0 : a.highlight ? -1 : 1
  );

  // Duplicate the list so the track can scroll -50% and loop seamlessly.
  const track = [...items, ...items];
  const duration = `${items.length * SECONDS_PER_ITEM}s`;

  return (
    <div className="group relative my-4 flex h-14 items-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
      {/* ── Left anchor chip ── */}
      <div className="z-20 flex h-full shrink-0 items-center gap-1.5 bg-accent-600 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-[4px_0_12px_rgba(0,0,0,0.4)]">
        <Megaphone size={14} /> Live Updates
      </div>

      {/* ── Fade mask on the left edge (after the chip) ── */}
      <div
        className="pointer-events-none absolute left-[7.5rem] top-0 z-10 h-full w-10"
        style={{ background: "linear-gradient(to right, #020617, rgba(2,6,23,0))" }}
        aria-hidden
      />

      {/* ── Marquee track: two copies, pauses on hover ── */}
      <div className="relative flex flex-1 overflow-hidden">
        <div
          className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]"
          style={{ animationDuration: duration }}
        >
          {track.map((item, i) => (
            <AnnouncementItem key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* ── Fade mask on the right edge ── */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12"
        style={{ background: "linear-gradient(to left, #020617, rgba(2,6,23,0))" }}
        aria-hidden
      />
    </div>
  );
}
