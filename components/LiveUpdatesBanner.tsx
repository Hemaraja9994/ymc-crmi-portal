"use client";
import { Megaphone } from "lucide-react";
import { ANNOUNCEMENTS, CATEGORY_STYLES } from "@/lib/announcements";

export default function LiveUpdatesBanner() {
  const items = [...ANNOUNCEMENTS].sort((a, b) => (a.highlight === b.highlight ? 0 : a.highlight ? -1 : 1));
  return (
    <section className="card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone size={16} className="text-rose-500" />
          <h2 className="font-semibold text-sm">Live Updates · Rules & Notices</h2>
          <span className="inline-flex items-center gap-1 text-[10px] text-rose-600">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> LIVE
          </span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-xcel-50 px-4 py-2 text-sm overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-8 animate-[ymcMarquee_40s_linear_infinite]">
          {[...items, ...items].map((a, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <span className={`badge ring-1 ${CATEGORY_STYLES[a.category]}`}>{a.category}</span>
              <strong>{a.title}</strong>
              <span className="text-slate-500">— {a.body}</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes ymcMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
