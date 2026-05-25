import Link from "next/link";
import { GraduationCap, ShieldCheck, CalendarRange, FileCheck2, ArrowRight, Sparkles } from "lucide-react";
import { STUDENTS } from "@/lib/students";
import { BLOCKS } from "@/lib/rotation";

export default function Landing() {
  return (
    <div className="space-y-10">
      {/* Hero split */}
      <section className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Brand panel */}
        <div className="brand-panel rounded-3xl text-white p-8 md:p-10 relative overflow-hidden">
          <div className="geo-overlay absolute inset-0 opacity-60" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-xcel-100">
              <Sparkles size={14} /> Yenepoya Medical College · Mangalore
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight tracking-tight">
              CRMI Management Platform
            </h1>
            <p className="mt-3 text-xcel-100/90 text-sm md:text-base max-w-md">
              Manage all interns, postings, leaves and CBME compliance for the
              MBBS 2021 batch — in one premium portal.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/student" className="btn bg-white text-xcel-700 hover:bg-xcel-50 shadow-sm">
                <GraduationCap size={16} /> Student Login
              </Link>
              <Link href="/admin" className="btn border border-white/30 text-white hover:bg-white/10">
                <ShieldCheck size={16} /> Coordinator Login <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              <Mini label="Interns" value={STUDENTS.length} />
              <Mini label="Weeks" value={52} />
              <Mini label="Blocks" value={4} />
            </div>
          </div>
        </div>

        {/* Right card */}
        <div className="card p-8 md:p-10 flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 self-start badge bg-xcel-50 text-xcel-700 ring-1 ring-xcel-100">
            <span className="w-1.5 h-1.5 rounded-full bg-xcel-600 animate-pulse" /> Effective 01 June 2026
          </span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
            One portal for the entire internship year
          </h2>
          <p className="mt-2 text-slate-600 text-sm md:text-base">
            Real-time posting schedules, leave management with department-aware approvals,
            CBME guideline compliance, and HR-style analytics for coordinators.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              "Automated 52-week rotation across 4 blocks",
              "Drag-and-drop leave & medical certificate uploads",
              "Per-department live roster + leave overview",
              "Push announcements to every intern dashboard",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <FileCheck2 size={16} className="text-xcel-600 mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/guidelines" className="btn-outline">Read guidelines</Link>
            <Link href="/support" className="btn-ghost">Need help?</Link>
          </div>
        </div>
      </section>

      {/* Block summary */}
      <section>
        <div className="flex items-end justify-between gap-2 mb-3">
          <h2 className="text-xl font-bold">Rotation Blocks</h2>
          <Link href="/guidelines" className="text-sm text-xcel-700 hover:underline">View full guidelines →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BLOCKS.map((b) => (
            <div key={b.id} className="card p-5 hover:shadow-lg transition relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-xcel-50 group-hover:bg-xcel-100 transition" />
              <div className="relative">
                <div className="text-xs uppercase tracking-wider text-slate-500">{b.title}</div>
                <div className="mt-1 text-xl font-bold">
                  {b.depts.reduce((s, d) => s + d.weeks, 0)} weeks
                </div>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {b.depts.map((d) => (
                    <li key={d.code} className="flex justify-between gap-2">
                      <span className={`dept-chip ${d.color}`}>{d.short}</span>
                      <span className="text-slate-500 font-mono text-xs">{d.weeks}w</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/10 ring-1 ring-white/15 p-3 backdrop-blur">
      <div className="text-[10px] uppercase tracking-wider text-xcel-100">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
