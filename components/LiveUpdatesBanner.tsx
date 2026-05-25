"use client";

import { Megaphone, Radio } from "lucide-react";
import { ANNOUNCEMENTS, CATEGORY_STYLES } from "@/lib/announcements";

export default function LiveUpdatesBanner() {
  const items = [...ANNOUNCEMENTS].sort((a, b) =>
    a.highlight === b.highlight ? 0 : a.highlight ? -1 : 1
  );

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-500 ring-1 ring-rose-100">
            <Megaphone size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-slate-950">Live Updates - Rules & Notices</h2>
            <p className="text-xs text-slate-500">Hover over the ticker to pause important notices.</p>
          </div>
        </div>
        <span className="badge border border-rose-100 bg-rose-50 text-rose-600">
          <Radio size={12} /> LIVE
        </span>
      </div>

      <div className="ymc-ticker overflow-hidden whitespace-nowrap bg-gradient-to-r from-rose-50 via-amber-50 to-cyan-50 px-4 py-3 text-sm">
        {/* Slower marquee keeps compliance notices readable; hover pauses it instantly. */}
        <div className="ymc-marquee inline-flex gap-8 pr-8 will-change-transform hover:[animation-play-state:paused]">
          {[...items, ...items].map((announcement, index) => (
            <span key={index} className="inline-flex items-center gap-2">
              <span className={`badge ring-1 ${CATEGORY_STYLES[announcement.category]}`}>
                {announcement.category}
              </span>
              <strong className="text-slate-950">{announcement.title}</strong>
              <span className="text-slate-500">- {announcement.body}</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
