"use client";

import { Megaphone, Radio } from "lucide-react";
import { ANNOUNCEMENTS, CATEGORY_STYLES } from "@/lib/announcements";

export default function LiveUpdatesBanner() {
  const items = [...ANNOUNCEMENTS].sort((a, b) =>
    a.highlight === b.highlight ? 0 : a.highlight ? -1 : 1
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b-2 border-teal-600/10 bg-gradient-to-r from-teal-700 to-teal-800 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/15 text-white">
            <Megaphone size={14} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white">Live Updates – Rules & Notices</h2>
            <p className="text-[11px] text-teal-200">Hover over the ticker to pause.</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          <Radio size={11} /> LIVE
        </span>
      </div>

      <div className="ymc-ticker overflow-hidden whitespace-nowrap border-t border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50 px-4 py-2.5 text-sm">
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
