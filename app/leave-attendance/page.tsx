import { BLOCKS } from "@/lib/rotation";
import { CalendarDays, ShieldCheck, BookOpen, AlertTriangle, Clock, FileText } from "lucide-react";

export default function LeavePage() {
  const allDepts = BLOCKS.flatMap((b) => b.depts.map((d) => ({ ...d, block: b.id })));
  const totalLeave = allDepts.reduce((s, d) => s + (d.casualLeaveDays === "Nil" ? 0 : Number(d.casualLeaveDays)), 0);

  return (
    <div className="space-y-5">

      {/* Hero */}
      <header className="brand-panel relative overflow-hidden rounded-2xl px-7 py-6 text-white">
        <div className="geo-overlay absolute inset-0 opacity-50" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-100">
            <CalendarDays size={12} /> Leave & Attendance
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
            Leave Provisions & Attendance Criteria
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-teal-50/80">
            Casual leave entitlements per posting are governed by NMC and YMC internship norms.
            Interns must meet mandatory thresholds to be eligible for the completion certificate.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-2 backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-widest text-teal-200">Total CL days / year</div>
              <div className="text-xl font-extrabold">≈ {totalLeave}</div>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-2 backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-widest text-teal-200">Attendance threshold</div>
              <div className="text-xl font-extrabold">80%</div>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-2 backdrop-blur-sm">
              <div className="text-[10px] uppercase tracking-widest text-teal-200">Logbook submission</div>
              <div className="text-xl font-extrabold">100%</div>
            </div>
          </div>
        </div>
      </header>

      {/* Attendance criteria cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border-rose-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 grid place-items-center">
              <ShieldCheck size={18} />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">Min. Overall Attendance</div>
          </div>
          <div className="text-4xl font-extrabold text-rose-600">80%</div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Minimum attendance across all postings to qualify for the completion certificate.
          </p>
        </div>
        <div className="card p-5 border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 grid place-items-center">
              <Clock size={18} />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">Per-Posting Clinical</div>
          </div>
          <div className="text-4xl font-extrabold text-amber-600">≥ 80%</div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Each individual posting requires ≥ 80% attendance. Shortfall means repeat of that posting.
          </p>
        </div>
        <div className="card p-5 border-teal-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 grid place-items-center">
              <BookOpen size={18} />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">Logbook Submission</div>
          </div>
          <div className="text-4xl font-extrabold text-teal-700">100%</div>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            All weekly logbook entries must be submitted and countersigned before moving to the next posting.
          </p>
        </div>
      </section>

      {/* Leave table */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/60">
          <div>
            <h2 className="font-extrabold text-slate-900">Casual Leave Entitlement per Posting</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              As per YMC CRMI circular (Ref: YMC/1269/2025) · Total ≈ {totalLeave} days across the year
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
            <FileText size={12} /> {allDepts.length} Departments
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="text-left px-5 py-3">Department</th>
                <th className="text-left px-4 py-3">Block</th>
                <th className="text-left px-4 py-3">Weeks</th>
                <th className="text-left px-4 py-3">Casual Leave</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allDepts.map((d) => (
                <tr key={d.code} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 flex items-center gap-2">
                    <span className={`dept-chip ${d.color}`}>{d.short}</span>
                    <span className="font-medium text-slate-800">{d.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-teal-50 border border-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                      Block {d.block}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-600">{d.weeks}w</td>
                  <td className="px-4 py-3 font-semibold">
                    {d.casualLeaveDays === "Nil" ? (
                      <span className="badge bg-slate-100 text-slate-500 ring-1 ring-slate-200">Nil</span>
                    ) : (
                      <span className="badge bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                        {d.casualLeaveDays} day{d.casualLeaveDays === 1 ? "" : "s"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Important notes */}
      <section className="card p-5 border-amber-100 bg-amber-50/30">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-amber-600" />
          <h2 className="font-extrabold text-slate-900">Important Notes</h2>
        </div>
        <ul className="space-y-2">
          {[
            "Leave applications must be submitted in advance via the portal.",
            "Medical leave requires a medical certificate uploaded as PDF/JPG.",
            "Unauthorized absence will be treated as breach of internship discipline.",
            "Extension of internship will be applied where attendance criteria are not met.",
          ].map((note, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold grid place-items-center shrink-0">{i + 1}</span>
              {note}
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
