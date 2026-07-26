import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Home,
  Sparkles,
  Users,
} from "lucide-react";
import {
  BATCH_JUL2026,
  JUL2026_CASUAL_LEAVE,
  JUL2026_CASUAL_LEAVE_TOTAL,
  JUL2026_DUTY_HOURS,
  JUL2026_HOSTEL_RULES,
  JUL2026_TIMELINE,
  REGULATIONS_JUL2026,
  STUDENTS_JUL2026,
  buildAssignmentsJul2026,
  currentWeekIndexJul2026,
  daysUntilJul2026Start,
  getWeekDates,
  isPreLaunchJul2026,
} from "@/lib/batch-jul2026";
import { BLOCKS } from "@/lib/rotation";

export const dynamic = "force-dynamic";

export default function BatchJul2026Page() {
  const assignments = buildAssignmentsJul2026();
  const preLaunch = isPreLaunchJul2026();
  const weekIdx = currentWeekIndexJul2026();
  const week = getWeekDates(weekIdx);
  const days = daysUntilJul2026Start();

  const bySubBatch = new Map<string, typeof assignments>();
  for (const a of assignments) {
    if (!bySubBatch.has(a.subBatch)) bySubBatch.set(a.subBatch, []);
    bySubBatch.get(a.subBatch)!.push(a);
  }
  const orderedSubs = Array.from(bySubBatch.keys()).sort((a, b) => {
    const [ga, na] = [a[0], parseInt(a.slice(1))];
    const [gb, nb] = [b[0], parseInt(b.slice(1))];
    if (ga !== gb) return ga.localeCompare(gb);
    return na - nb;
  });

  // Current-week posting per intern (only meaningful once launched)
  const currentPostings = assignments.map((a) => {
    const cell = a.rotation.find((r) => r.weekIdx === weekIdx);
    return { assignment: a, cell };
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-7 py-6 text-white shadow-xl">
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90 hover:bg-white/20"
            >
              <ArrowLeft size={12} /> Back to dashboard
            </Link>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
              {BATCH_JUL2026.label}
            </h1>
            <p className="mt-1 text-sm leading-5 text-white/85 max-w-2xl">
              {BATCH_JUL2026.reference} · Rotation runs {formatDate(BATCH_JUL2026.startDate)} → {formatDate(BATCH_JUL2026.endDate)}.
              Follows the same NMC-compliant Block I–IV structure as the main batch.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-center backdrop-blur-md">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/85">
              {preLaunch ? "Starts in" : "Current week"}
            </div>
            <div className="text-2xl font-extrabold">
              {preLaunch ? `${days} day${days === 1 ? "" : "s"}` : `W${weekIdx + 1}`}
            </div>
            <div className="text-[11px] text-white/75">
              {preLaunch ? formatDate(BATCH_JUL2026.startDate) : week.label}
            </div>
          </div>
        </div>
      </section>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
        <Kpi icon={<Users size={18} />} label="Interns" value={STUDENTS_JUL2026.length} sub="Batch-wise distribution" />
        <Kpi icon={<GraduationCap size={18} />} label="Sub-batches" value={orderedSubs.length} sub="A-groups + B-groups" />
        <Kpi icon={<CalendarDays size={18} />} label="Duration" value="52 wks" sub="27.07.2026 – 26.07.2027" />
        <Kpi icon={<Sparkles size={18} />} label="Blocks" value={BLOCKS.length} sub="NMC Block I–IV" />
      </div>

      {/* Orientation card */}
      <section className="card overflow-hidden ring-1 ring-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50/70 border-b border-amber-100 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">Orientation</div>
              <div className="text-lg font-extrabold text-slate-950">
                {formatDate(BATCH_JUL2026.orientationDate)} · {BATCH_JUL2026.orientationVenue}
              </div>
            </div>
          </div>
          <div className="text-xs text-amber-800">
            Non-attendance ⇒ 10 days extension of internship (per notice dated 24.07.2026)
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="card overflow-hidden">
        <SectionHeader icon={<CalendarDays size={17} />} title="Milestones & Timeline" note="Per meeting dated 24.07.2026" />
        <div className="grid gap-0 md:grid-cols-5">
          {JUL2026_TIMELINE.map((m, i) => (
            <div key={i} className="border-slate-100 md:border-r last:border-r-0 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-xcel-700">Step {i + 1}</div>
              <div className="mt-1 font-extrabold text-slate-900">{m.label}</div>
              <div className="mt-1 font-mono text-sm text-slate-700">{m.date}</div>
              {m.note && <div className="mt-1 text-[11px] text-slate-500">{m.note}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Duty hours + hostel */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card overflow-hidden">
          <SectionHeader icon={<Clock3 size={17} />} title="Duty Hours" />
          <ul className="divide-y divide-slate-100 text-sm">
            {JUL2026_DUTY_HOURS.map((d, i) => (
              <li key={i} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="text-slate-700">{d.duty}</div>
                <div className="font-mono text-slate-900">{d.timings}</div>
              </li>
            ))}
          </ul>
        </section>
        <section className="card overflow-hidden">
          <SectionHeader icon={<Home size={17} />} title="Hostel Accommodation" />
          <ul className="divide-y divide-slate-100 text-sm">
            {JUL2026_HOSTEL_RULES.map((h, i) => (
              <li key={i} className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">{h.window}</div>
                  <div className="font-mono text-xs text-slate-700">{h.dates}</div>
                </div>
                {h.note && <div className="mt-1 text-[11px] text-slate-500">{h.note}</div>}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Batch-wise distribution */}
      <section className="card overflow-hidden">
        <SectionHeader
          icon={<Users size={17} />}
          title="Batch-wise Distribution"
          note={`${STUDENTS_JUL2026.length} interns · ${orderedSubs.length} sub-batches`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Sl No.</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Reg. No.</th>
                <th className="px-4 py-3 text-left">Sub-batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {STUDENTS_JUL2026.map((s) => (
                <tr key={s.regNo} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-500">{s.slNo}</td>
                  <td className="px-4 py-2 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-2 font-mono text-slate-700">{s.regNo}</td>
                  <td className="px-4 py-2">
                    <SubBatchBadge sb={s.subBatch} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* This week's postings */}
      {!preLaunch && (
        <section className="card overflow-hidden">
          <SectionHeader
            icon={<CalendarDays size={17} />}
            title={`Current Week Postings · W${weekIdx + 1}`}
            note={week.label}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Intern</th>
                  <th className="px-4 py-3 text-left">Reg. No.</th>
                  <th className="px-4 py-3 text-left">Sub-batch</th>
                  <th className="px-4 py-3 text-left">Posted at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentPostings.map(({ assignment, cell }) => (
                  <tr key={assignment.student.regNo} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-900">{assignment.student.name}</td>
                    <td className="px-4 py-2 font-mono text-slate-700">{assignment.student.regNo}</td>
                    <td className="px-4 py-2"><SubBatchBadge sb={assignment.subBatch} /></td>
                    <td className="px-4 py-2">
                      {cell ? (
                        <span className={`dept-chip text-[11px] ${cell.color}`}>{cell.deptShort}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Rotation grid — 52-week × sub-batch heatmap */}
      <section className="card overflow-hidden">
        <SectionHeader
          icon={<FileText size={17} />}
          title="52-Week Rotation Grid"
          note="Sub-batch → weekly department (Block I–IV)"
        />
        <div className="overflow-x-auto">
          <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
            <thead>
              <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left">Sub-batch</th>
                {Array.from({ length: 52 }, (_, i) => (
                  <th key={i} className="px-1 py-2 text-center">W{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderedSubs.map((sb) => {
                const example = bySubBatch.get(sb)![0]; // rotation is identical per sub-batch
                return (
                  <tr key={sb}>
                    <th className="sticky left-0 z-10 bg-white border-t border-slate-100 px-3 py-1 text-left">
                      <SubBatchBadge sb={sb} />
                    </th>
                    {example.rotation.map((r) => (
                      <td key={r.weekIdx} className={`border-t border-slate-100 px-0.5 py-1 text-center text-[9px] font-semibold ${r.color}`}>
                        {r.deptShort}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Casual leave distribution — verbatim from CRMS notification 24.07.2026 */}
      <section className="card overflow-hidden">
        <SectionHeader
          icon={<FileText size={17} />}
          title="Casual Leave Distribution"
          note={`As per YMC CRMS notification (Ref YMC/1377/2026, 24.07.2026) · Total ${JUL2026_CASUAL_LEAVE_TOTAL} days`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Posting</th>
                <th className="px-4 py-3 text-right">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {JUL2026_CASUAL_LEAVE.map((row) => (
                <tr key={row.posting} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-700">{row.posting}</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-slate-900">{row.days}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-semibold">
                <td className="px-4 py-2 text-slate-900">Total casual leave</td>
                <td className="px-4 py-2 text-right font-mono text-slate-900">{JUL2026_CASUAL_LEAVE_TOTAL}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Rules & Regulations (separate header + document downloads) ──── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-xcel-900 px-6 py-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
            <BookOpenCheck size={20} />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-xcel-100">Batch-specific</div>
            <h2 className="text-xl font-extrabold tracking-tight">Rules & Regulations — July 2026 Batch</h2>
            <p className="text-[12px] text-white/70">
              Official circulars and notices for this batch. Timeline differs from the main batch — refer to these documents.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {REGULATIONS_JUL2026.map((doc) => (
          <a
            key={doc.file}
            href={doc.file}
            target="_blank"
            rel="noopener noreferrer"
            className="group card flex items-start gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-xcel-300 hover:shadow-lg"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
              <FileText size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900">{doc.title}</h3>
                <span className="badge bg-slate-100 text-slate-600 ring-1 ring-slate-200">{doc.category}</span>
              </div>
              <p className="mt-0.5 text-[13px] leading-snug text-slate-600">{doc.description}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-xcel-800 group-hover:gap-2 transition-all">
                <Download size={14} /> Open PDF
                {doc.dateAdded && <span className="ml-1 text-[11px] text-slate-400">· {doc.dateAdded}</span>}
              </div>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function Kpi({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <span className="text-xcel-700">{icon}</span> {label}
      </div>
      <div className="text-3xl font-extrabold leading-none text-slate-950">{value}</div>
      {sub && <div className="truncate text-[11px] text-slate-400">{sub}</div>}
    </div>
  );
}

function SectionHeader({ icon, title, note }: { icon: React.ReactNode; title: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-xcel-100 text-xcel-800">{icon}</div>
        <div>
          <h2 className="font-extrabold text-slate-900">{title}</h2>
          {note && <p className="text-[11px] text-slate-500">{note}</p>}
        </div>
      </div>
    </div>
  );
}

function SubBatchBadge({ sb }: { sb: string }) {
  const isA = sb.startsWith("A");
  const cls = isA
    ? "bg-amber-100 text-amber-800 ring-amber-200"
    : "bg-sky-100 text-sky-800 ring-sky-200";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${cls}`}>{sb}</span>;
}
