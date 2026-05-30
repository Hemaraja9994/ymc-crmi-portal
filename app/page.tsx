import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BellRing,
  CalendarRange,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Layers3,
  LogIn,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TimerReset,
  UsersRound,
} from "lucide-react";
import { STUDENTS } from "@/lib/students";
import { BLOCKS } from "@/lib/rotation";
import LiveUpdatesBanner from "@/components/LiveUpdatesBanner";
import RegulationsCard from "@/components/RegulationsCard";
import KeyDates from "@/components/KeyDates";
import MandatoryRequirements from "@/components/MandatoryRequirements";

const featureHighlights = [
  {
    icon: CalendarRange,
    title: "Automated 52-week rotations",
    body: "Block-wise schedules stay readable across the full internship year.",
  },
  {
    icon: FileCheck2,
    title: "Leave and certificate workflows",
    body: "Department-aware approvals keep absence tracking crisp and auditable.",
  },
  {
    icon: UsersRound,
    title: "Live department rosters",
    body: "Coordinators and HODs can scan current postings without spreadsheet hunting.",
  },
  {
    icon: BellRing,
    title: "Priority announcements",
    body: "Rules and notices can surface instantly across intern dashboards.",
  },
];

// Landing-page specific tones keep department tags vivid without leaking design logic into rotation data.
const departmentVisuals: Record<
  string,
  { row: string; badge: string; tracker: string; bar: string }
> = {
  GMED: {
    row: "border-rose-100 bg-rose-50/80",
    badge: "border-rose-200 bg-white text-rose-700",
    tracker: "bg-rose-600 text-white",
    bar: "bg-rose-500",
  },
  ENT: {
    row: "border-amber-100 bg-amber-50/80",
    badge: "border-amber-200 bg-white text-amber-700",
    tracker: "bg-amber-500 text-white",
    bar: "bg-amber-400",
  },
  OPH: {
    row: "border-emerald-100 bg-emerald-50/80",
    badge: "border-emerald-200 bg-white text-emerald-700",
    tracker: "bg-emerald-600 text-white",
    bar: "bg-emerald-500",
  },
  PSY: {
    row: "border-violet-100 bg-violet-50/80",
    badge: "border-violet-200 bg-white text-violet-700",
    tracker: "bg-violet-600 text-white",
    bar: "bg-violet-500",
  },
  GER: {
    row: "border-slate-200 bg-slate-50/90",
    badge: "border-slate-200 bg-white text-slate-700",
    tracker: "bg-slate-700 text-white",
    bar: "bg-slate-500",
  },
  GSUR: {
    row: "border-blue-100 bg-blue-50/80",
    badge: "border-blue-200 bg-white text-blue-700",
    tracker: "bg-blue-600 text-white",
    bar: "bg-blue-500",
  },
  ANAE: {
    row: "border-cyan-100 bg-cyan-50/80",
    badge: "border-cyan-200 bg-white text-cyan-700",
    tracker: "bg-cyan-600 text-white",
    bar: "bg-cyan-500",
  },
  ORTH: {
    row: "border-orange-100 bg-orange-50/80",
    badge: "border-orange-200 bg-white text-orange-700",
    tracker: "bg-orange-500 text-white",
    bar: "bg-orange-400",
  },
  EMED: {
    row: "border-red-100 bg-red-50/80",
    badge: "border-red-200 bg-white text-red-700",
    tracker: "bg-red-600 text-white",
    bar: "bg-red-500",
  },
  RAD: {
    row: "border-stone-200 bg-stone-50/90",
    badge: "border-stone-200 bg-white text-stone-700",
    tracker: "bg-stone-700 text-white",
    bar: "bg-stone-500",
  },
  COM: {
    row: "border-xcel-200 bg-xcel-100/80",
    badge: "border-xcel-200 bg-white text-xcel-800",
    tracker: "bg-xcel-600 text-white",
    bar: "bg-xcel-600",
  },
  RES: {
    row: "border-sky-100 bg-sky-50/80",
    badge: "border-sky-200 bg-white text-sky-700",
    tracker: "bg-sky-600 text-white",
    bar: "bg-sky-500",
  },
  OBG: {
    row: "border-pink-100 bg-pink-50/80",
    badge: "border-pink-200 bg-white text-pink-700",
    tracker: "bg-pink-600 text-white",
    bar: "bg-pink-500",
  },
  PED: {
    row: "border-indigo-100 bg-indigo-50/80",
    badge: "border-indigo-200 bg-white text-indigo-700",
    tracker: "bg-indigo-600 text-white",
    bar: "bg-indigo-500",
  },
  DVL: {
    row: "border-fuchsia-100 bg-fuchsia-50/80",
    badge: "border-fuchsia-200 bg-white text-fuchsia-700",
    tracker: "bg-fuchsia-600 text-white",
    bar: "bg-fuchsia-500",
  },
  FOR: {
    row: "border-yellow-100 bg-yellow-50/80",
    badge: "border-yellow-200 bg-white text-yellow-700",
    tracker: "bg-yellow-500 text-white",
    bar: "bg-yellow-400",
  },
  LAB: {
    row: "border-lime-100 bg-lime-50/80",
    badge: "border-lime-200 bg-white text-lime-700",
    tracker: "bg-lime-600 text-white",
    bar: "bg-lime-500",
  },
};

const fallbackDepartmentVisual = {
  row: "border-slate-200 bg-slate-50/90",
  badge: "border-slate-200 bg-white text-slate-700",
  tracker: "bg-slate-700 text-white",
  bar: "bg-slate-500",
};

export default function Landing() {
  return (
    <div className="space-y-8">
      <LiveUpdatesBanner />

      {/* Unified hero dashboard: brand narrative and operational summary share one premium surface. */}
      <section className="max-w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-md">
        <div className="grid min-w-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="brand-panel relative min-h-[420px] min-w-0 overflow-hidden p-7 text-white md:p-10">
            <div className="geo-overlay absolute inset-0 opacity-70" />
            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-100 backdrop-blur sm:text-xs">
                  <Sparkles size={14} className="shrink-0" />
                  <span className="min-w-0 truncate">Yenepoya Medical College - Mangalore</span>
                </div>
                <h1 className="mt-5 max-w-full text-4xl font-extrabold leading-tight tracking-tight sm:max-w-xl md:text-5xl">
                  CRMI Management Platform
                </h1>
                <p className="mt-4 max-w-full text-sm leading-6 text-blue-50/90 sm:max-w-xl md:text-base">
                  Manage interns, postings, leave approvals and CBME compliance for the
                  MBBS 2021 batch in one polished command center.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/admin"
                    className="btn bg-xcel-600 text-white shadow-lg shadow-xcel-900/20 hover:bg-xcel-500"
                  >
                    <ShieldCheck size={17} /> Coordinator Login <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/student"
                    className="btn border border-white/25 bg-white/10 text-white shadow-lg shadow-blue-950/10 hover:bg-white/15"
                  >
                    <GraduationCap size={17} /> Student Login
                  </Link>
                </div>
              </div>

              <div className="grid min-w-0 max-w-xl grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                <Mini icon={<UsersRound size={16} />} label="Interns" value={STUDENTS.length} />
                <Mini icon={<TimerReset size={16} />} label="Weeks" value={52} />
                <Mini icon={<Layers3 size={16} />} label="Blocks" value={4} />
              </div>
            </div>
          </div>

          <div className="relative flex min-w-0 flex-col justify-center bg-white/85 p-7 md:p-10">
            <div className="absolute inset-y-10 left-0 hidden w-px bg-gradient-to-b from-transparent via-cyan-200 to-transparent lg:block" />
            <span className="badge self-start border border-xcel-200 bg-xcel-100 text-xcel-800">
              <span className="h-1.5 w-1.5 rounded-full bg-xcel-600 animate-pulse" /> Effective 01 June 2026
            </span>
            <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight text-slate-950">
              One portal for the entire internship year
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              A cleaner operational layer for posting schedules, department approvals,
              guideline visibility and coordinator analytics.
            </p>

            {/* Thin line icons make the feature list scan like a dashboard, not a document. */}
            <div className="mt-6 grid gap-3 xl:grid-cols-2">
              {featureHighlights.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">{feature.title}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">{feature.body}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link href="/guidelines" className="btn-outline">
                <ClipboardCheck size={16} /> Read guidelines
              </Link>
              <Link href="/support" className="btn-ghost">
                <LogIn size={16} /> Need help?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Regulations & Circulars — public, no login required */}
      <RegulationsCard />

      {/* Key dates / timeline + mandatory requirements (from the circulars) */}
      <KeyDates />
      <MandatoryRequirements />

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="badge border border-cyan-100 bg-cyan-50 text-cyan-700">Rotation dashboard</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">Rotation Blocks</h2>
          </div>
          <Link href="/guidelines" className="btn-ghost self-start sm:self-auto">
            View full guidelines <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BLOCKS.map((block) => {
            const totalWeeks = block.depts.reduce((sum, dept) => sum + dept.weeks, 0);

            return (
              <article
                key={block.id}
                className="card group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-900/10"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 opacity-90" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {block.title}
                    </div>
                    <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
                      {totalWeeks} weeks
                    </div>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white shadow-lg shadow-blue-950/20 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
                    <Stethoscope size={19} />
                  </div>
                </div>

                {/* Each department row pairs a color-coded pill with a duration badge and visual tracker. */}
                <ul className="mt-5 space-y-2.5">
                  {block.depts.map((dept) => {
                    const visual = departmentVisuals[dept.code] ?? fallbackDepartmentVisual;
                    const width = Math.max(8, Math.round((dept.weeks / totalWeeks) * 100));

                    return (
                      <li key={dept.code} className={`rounded-2xl border p-3 ${visual.row}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${visual.badge}`}>
                              {dept.short}
                            </span>
                            <p className="mt-1 truncate text-xs font-medium text-slate-500">{dept.name}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold ${visual.tracker}`}>
                            {dept.weeks}w
                          </span>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/80 ring-1 ring-black/5">
                          <div
                            className={`h-full rounded-full ${visual.bar}`}
                            style={{ width: `${width}%` }}
                            aria-label={`${dept.name} duration ${dept.weeks} weeks`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Mini({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 sm:p-3">
      <div className="mb-2 inline-grid h-8 w-8 place-items-center rounded-xl bg-white/15 text-cyan-100">
        {icon}
      </div>
      <div className="truncate text-[9px] font-semibold uppercase tracking-wider text-cyan-100/90 sm:text-[10px]">
        {label}
      </div>
      <div className="text-xl font-extrabold leading-none sm:text-2xl">{value}</div>
    </div>
  );
}
