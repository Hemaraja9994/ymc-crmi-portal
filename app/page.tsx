import Link from "next/link";
import { GraduationCap, ShieldCheck, CalendarRange, FileCheck2 } from "lucide-react";
import { STUDENTS } from "@/lib/students";
import { BLOCKS } from "@/lib/rotation";

export default function LandingPage() {
  const totalWeeks = BLOCKS.reduce((s, b) => s + b.depts.reduce((x, d) => x + d.weeks, 0), 0);
  return (
    <div className="space-y-8">
      <section className="card p-6 md:p-10 bg-gradient-to-br from-brand-50 via-white to-white">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="badge bg-brand-100 text-brand-700">w.e.f. 01.06.2026</span>
            <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight">
              Compulsory Rotatory Medical Internship Portal
            </h1>
            <p className="mt-3 text-slate-600">
              Official internship management system for the <strong>MBBS 2021 CBME Batch</strong> at
              Yenepoya Medical College, Mangalore. View postings, manage leave, and stay on schedule
              — all in one place.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/student" className="btn-primary">
                <GraduationCap size={16} /> Student Login
              </Link>
              <Link href="/admin" className="btn-ghost border border-slate-300">
                <ShieldCheck size={16} /> Admin / Coordinator
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={<GraduationCap />} label="Interns" value={STUDENTS.length} />
            <Stat icon={<CalendarRange />} label="Total Weeks" value={52} />
            <Stat icon={<FileCheck2 />} label="Departments" value={BLOCKS.reduce((s, b) => s + b.depts.length, 0)} />
            <Stat icon={<ShieldCheck />} label="Blocks" value={4} />
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BLOCKS.map((b) => (
          <div key={b.id} className="card p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">{b.title}</div>
            <div className="mt-1 font-semibold">
              {b.depts.reduce((s, d) => s + d.weeks, 0)} weeks · {b.depts.length} departments
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {b.depts.map((d) => (
                <li key={d.code} className="flex justify-between gap-2">
                  <span className={`dept-chip ${d.color}`}>{d.short}</span>
                  <span className="text-slate-500">{d.weeks}w</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-slate-500 text-xs">
        <span className="text-brand-600">{icon}</span> {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
