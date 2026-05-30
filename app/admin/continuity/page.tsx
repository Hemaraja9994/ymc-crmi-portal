import { analyzeContinuity } from "@/lib/continuity";
import { CheckCircle2, AlertTriangle, GitMerge, Stethoscope, ShieldCheck } from "lucide-react";

// Always recompute from the live rotation engine.
export const dynamic = "force-dynamic";

export default function ContinuityPage() {
  const r = analyzeContinuity();
  const clear = r.studentsWithAnySplit === 0;
  const gmedCount = r.gmedSplits.length;

  return (
    <div className="space-y-5">
      {/* Header banner */}
      <section className="card overflow-hidden">
        <div className="brand-panel relative px-5 py-4 text-white overflow-hidden">
          <div className="geo-overlay absolute inset-0 opacity-50" />
          <div className="relative flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <GitMerge size={18} />
            </span>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Posting Continuity Check</h1>
              <p className="text-xs text-xcel-100/80">
                Verifies every intern&apos;s department posting is one unbroken block — no 1-week-then-gap splits.
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="p-5">
          {clear ? (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={22} />
              <div>
                <div className="font-bold text-emerald-900">All clear — every posting is continuous.</div>
                <div className="text-sm text-emerald-800">
                  {r.totalStudents} interns checked · 0 split postings · General Medicine: 0 discontinuities.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <AlertTriangle className="mt-0.5 shrink-0 text-rose-600" size={22} />
              <div>
                <div className="font-bold text-rose-900">
                  {r.studentsWithAnySplit} of {r.totalStudents} interns have a split posting.
                </div>
                <div className="text-sm text-rose-800">
                  General Medicine discontinuities: <strong>{gmedCount}</strong>. Details below.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Department-wise breakdown */}
      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-3 flex items-center gap-2">
          <ShieldCheck size={16} className="text-xcel-600" />
          <h2 className="font-bold text-slate-900">Discontinuity by department</h2>
        </div>
        {r.byDept.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No department has any split posting.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-2.5">Department</th>
                  <th className="px-5 py-2.5">Posting</th>
                  <th className="px-5 py-2.5">Students with a split</th>
                </tr>
              </thead>
              <tbody>
                {r.byDept.map((d) => (
                  <tr key={d.code} className="border-t border-slate-100">
                    <td className="px-5 py-2.5 font-semibold text-slate-900">{d.name}</td>
                    <td className="px-5 py-2.5 text-slate-600">{d.weeks}-week</td>
                    <td className="px-5 py-2.5">
                      <span className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200">{d.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* General Medicine focus list */}
      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-3 flex items-center gap-2">
          <Stethoscope size={16} className="text-xcel-600" />
          <div>
            <h2 className="font-bold text-slate-900">General Medicine — posting continuity</h2>
            <p className="text-xs text-slate-500">The department this check was originally raised for.</p>
          </div>
        </div>
        {gmedCount === 0 ? (
          <div className="flex items-center gap-2 p-5 text-sm text-emerald-700">
            <CheckCircle2 size={16} /> Every intern&apos;s General Medicine posting is a single unbroken block.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-2.5">Reg. No.</th>
                  <th className="px-5 py-2.5">Name</th>
                  <th className="px-5 py-2.5">Sub-batch</th>
                  <th className="px-5 py-2.5">Posting segments</th>
                  <th className="px-5 py-2.5">Gap</th>
                </tr>
              </thead>
              <tbody>
                {r.gmedSplits.map((s) => (
                  <tr key={s.regNo} className="border-t border-slate-100 align-top">
                    <td className="px-5 py-2.5 font-mono text-xs text-slate-500">{s.regNo}</td>
                    <td className="px-5 py-2.5 font-semibold text-slate-900 whitespace-nowrap">{s.name}</td>
                    <td className="px-5 py-2.5">
                      <span className="badge bg-xcel-100 text-xcel-800 ring-1 ring-xcel-200">{s.subBatch}</span>
                    </td>
                    <td className="px-5 py-2.5 text-xs text-slate-600">
                      {s.segments.map((g, i) => (
                        <span key={i}>
                          {i > 0 && <span className="text-rose-400"> → gap → </span>}
                          wk {g.startWeek}{g.endWeek !== g.startWeek ? `–${g.endWeek}` : ""} ({g.label})
                        </span>
                      ))}
                    </td>
                    <td className="px-5 py-2.5">
                      <span className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200">{s.gapWeeks}w</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="px-1 text-xs text-slate-400">
        Computed live from the rotation engine each time this page loads. Re-run after any schedule change.
      </p>
    </div>
  );
}
