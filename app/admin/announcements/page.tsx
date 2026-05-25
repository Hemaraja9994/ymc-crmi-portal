import { ANNOUNCEMENTS, CATEGORY_STYLES } from "@/lib/announcements";
import { Megaphone, TrendingUp } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Announcements & Live Updates</h1>
        <p className="text-sm text-slate-500">Push policy changes, schedule notices and alerts to all interns.</p>
      </header>

      <div className="card p-3 bg-gradient-to-r from-rose-50 via-amber-50 to-xcel-50">
        <div className="flex items-center gap-2 text-xs text-rose-700">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          LIVE — highlighted items appear on every student dashboard.
        </div>
      </div>

      <ul className="space-y-3">
        {ANNOUNCEMENTS.map((a) => (
          <li key={a.id} className={`card p-5 ${a.highlight ? "ring-2 ring-rose-300/60" : ""}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge ring-1 ${CATEGORY_STYLES[a.category]}`}>
                    {a.category === "Rule" ? <Megaphone size={11} /> : <TrendingUp size={11} />}
                    {a.category}
                  </span>
                  {a.highlight && (
                    <span className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200 animate-pulse">
                      Highlighted
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{a.date}</span>
                </div>
                <h2 className="mt-2 font-semibold">{a.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{a.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
