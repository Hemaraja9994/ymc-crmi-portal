"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MessageCircle,
  Mail,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  Trophy,
  Lock,
  Stamp,
  ChevronRight,
  Hourglass,
  IdCard,
} from "lucide-react";
import LiveUpdatesBanner from "./LiveUpdatesBanner";
import { levelFromWeeks, badges } from "@/lib/gamification";

type WeekRow = {
  idx: number;
  start: string;
  end: string;
  label: string;
  cell: { weekIdx: number; deptCode: string; deptName: string; deptShort: string; color: string };
};
type Seg = {
  deptCode: string;
  deptName: string;
  deptShort: string;
  color: string;
  startWeek: number;
  endWeek: number;
  startLabel: string;
  endLabel: string;
  weeks: number;
};

export default function StudentDashboard({
  assignment,
  weeks,
  currentWeek,
  nextWeek,
  currentDeptName,
  segments,
  completed,
  currentSeg,
  upcoming,
  lifecycle,
  preLaunch,
  daysToStart,
}: {
  assignment: any;
  weeks: WeekRow[];
  currentWeek: WeekRow;
  nextWeek: WeekRow;
  currentDeptName: string;
  segments: Seg[];
  completed: Seg[];
  currentSeg: Seg | null;
  upcoming: Seg[];
  lifecycle: "pre-launch" | "active" | "completed";
  preLaunch: boolean;
  daysToStart: number;
}) {
  const [view, setView] = useState<"year" | "month" | "week">("year");
  const [leaves, setLeaves] = useState<
    { id: number; from: string; to: string; reason: string; type: string; status: "Pending" | "Approved" | "Rejected"; doc?: string }[]
  >([]);

  const totalWeeksCompleted = preLaunch ? 0 : completed.reduce((s, c) => s + c.weeks, 0);
  const overallPct = Math.round((totalWeeksCompleted / 52) * 100);
  const level = levelFromWeeks(totalWeeksCompleted);
  const completedDeptCodes = new Set(completed.map((c) => c.deptCode));
  const earnedBadges = badges(totalWeeksCompleted, completedDeptCodes);

  const initials = assignment.student.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");

  const whatsappText = useMemo(() => {
    const lines = preLaunch
      ? [
          `*YMC CRMI · ${assignment.student.name}*`,
          `Reg No: ${assignment.student.regNo}`,
          `Block ${assignment.blockId} · ${assignment.subBatch}`,
          ``,
          `🗓️ Internship begins ${weeks[0].start} (in ${daysToStart} day${daysToStart === 1 ? "" : "s"})`,
          `First posting: ${weeks[0].cell.deptName}`,
        ]
      : [
          `*YMC CRMI · ${assignment.student.name}*`,
          `Reg No: ${assignment.student.regNo} · Block ${assignment.blockId} · ${assignment.subBatch}`,
          ``,
          `🩺 Current: ${currentSeg?.deptName || currentDeptName}`,
          `Window: ${currentSeg?.startLabel || currentWeek.label.split(" – ")[0]} → ${
            currentSeg?.endLabel || currentWeek.label.split(" – ")[1]
          }`,
          ``,
          `📅 Up next: ${nextWeek.cell.deptName}`,
        ];
    return encodeURIComponent(lines.join("\n"));
  }, [assignment, currentWeek, nextWeek, currentDeptName, currentSeg, preLaunch, daysToStart, weeks]);

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Live updates first — students must see rule changes */}
      <LiveUpdatesBanner />

      {/* Profile hero with XP / level */}
      <section className="card overflow-hidden">
        <div className="bg-gradient-to-br from-xcel-600 via-xcel-700 to-xcel-900 text-white p-5 md:p-8 relative">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 ring-1 ring-white/20 grid place-items-center text-xl md:text-2xl font-bold backdrop-blur">
                {initials}
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-xcel-100">Intern Profile</div>
                <h1 className="text-xl md:text-3xl font-bold mt-0.5 leading-tight">{assignment.student.name}</h1>
                <div className="mt-1 text-xs md:text-sm text-xcel-100/90 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1"><IdCard size={12} /> {assignment.student.regNo}</span>
                  <span>Block {assignment.blockId}</span>
                  <span>Sub-batch <span className="font-mono">{assignment.subBatch}</span></span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white text-sm"
              >
                <MessageCircle size={14} /> WhatsApp schedule
              </a>
              <button className="btn bg-white/15 hover:bg-white/25 text-white text-sm">
                <Mail size={14} /> Email schedule
              </button>
            </div>
          </div>

          {/* Level + XP */}
          <div className="relative mt-6 grid md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/10 ring-1 ring-white/15 p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-xcel-100">
                <Trophy size={12} /> Level {level.level}
              </div>
              <div className="mt-1 text-lg md:text-xl font-bold">{level.title}</div>
              <div className="mt-2 text-[11px] text-xcel-100/80">
                {level.xp.toLocaleString()} / {level.totalXp.toLocaleString()} XP
              </div>
            </div>
            <div className="md:col-span-2 rounded-xl bg-white/10 ring-1 ring-white/15 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-xcel-100 inline-flex items-center gap-1">
                  <Sparkles size={12} /> Internship progress · {totalWeeksCompleted}/52 weeks
                </span>
                <span className="font-semibold">{overallPct}%</span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-white/15 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 transition-all"
                  style={{ width: `${overallPct}%` }}
                />
                {/* checkpoint markers */}
                {[25, 50, 75, 100].map((p) => (
                  <span
                    key={p}
                    className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-white/40"
                    style={{ left: `${p}%` }}
                  />
                ))}
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-xcel-100/70 font-mono">
                <span>Start</span><span>25%</span><span>50%</span><span>75%</span><span>Cert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="px-4 md:px-6 py-4 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 mb-2">
            <Award size={12} /> Achievements
          </div>
          <div className="flex gap-2 md:gap-3 min-w-min pb-1">
            {earnedBadges.map((b) => (
              <div
                key={b.code}
                title={b.description}
                className={`shrink-0 rounded-2xl border px-3 py-2 text-center w-[88px] md:w-[104px] transition ${
                  b.earned
                    ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="text-2xl">{b.earned ? b.icon : "🔒"}</div>
                <div className="text-[10px] md:text-[11px] font-medium leading-tight mt-1">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-launch / active / completed states */}
      {preLaunch ? (
        <PreLaunchCard daysToStart={daysToStart} firstSeg={segments[0]} startDate={weeks[0].start} />
      ) : lifecycle === "completed" ? (
        <CompletedCard segments={segments} />
      ) : (
        <section className="grid md:grid-cols-2 gap-4">
          <PostingCard title="Current posting" range={currentSeg ? `${currentSeg.startLabel} → ${currentSeg.endLabel}` : currentWeek.label} dept={currentWeek.cell} highlight subtitle={currentSeg ? `Week ${currentSeg.startWeek + 1}–${currentSeg.endWeek + 1} · ${currentSeg.weeks} weeks` : undefined} />
          <PostingCard title="Up next" range={nextWeek.label} dept={nextWeek.cell} />
        </section>
      )}

      {/* Posting roadmap with stamps */}
      <section className="card p-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-semibold">Posting Roadmap</h2>
            <p className="text-xs text-slate-500">
              Completed postings carry the official seal · Current is highlighted · Upcoming postings unlock as you progress.
            </p>
          </div>
        </div>

        {/* Compact bar timeline */}
        <div className="mt-4 flex h-8 md:h-9 rounded-xl overflow-hidden ring-1 ring-slate-200 select-none">
          {segments.map((s) => {
            const isDone = !preLaunch && s.endWeek < currentWeek.idx;
            const isNow = !preLaunch && s.startWeek <= currentWeek.idx && s.endWeek >= currentWeek.idx;
            return (
              <div
                key={`${s.deptCode}-${s.startWeek}`}
                title={`${s.deptName} · ${s.startLabel} → ${s.endLabel}`}
                className={`relative flex items-center justify-center text-[10px] font-semibold ${s.color} ${
                  isDone ? "opacity-60" : ""
                } ${isNow ? "ring-2 ring-xcel-600 ring-inset z-10" : ""}`}
                style={{ flex: s.weeks }}
              >
                <span className="hidden sm:inline">{s.deptShort}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
          <span className="inline-flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-600" /> Completed</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-xcel-600" /> Current</span>
          <span className="inline-flex items-center gap-1"><Lock size={11} /> Upcoming</span>
        </div>

        {/* Posting cards with stamps */}
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {segments.map((s) => {
            const status =
              preLaunch
                ? "upcoming"
                : s.endWeek < currentWeek.idx
                ? "done"
                : s.startWeek <= currentWeek.idx && s.endWeek >= currentWeek.idx
                ? "current"
                : "upcoming";
            return <PostingStampCard key={`${s.deptCode}-${s.startWeek}`} seg={s} status={status} />;
          })}
        </div>
      </section>

      {/* Timeline tabs */}
      <section className="card">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-xcel-600" size={18} />
            <h2 className="font-semibold">Timeline</h2>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-sm">
            {(["year", "month", "week"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 capitalize ${view === v ? "bg-xcel-600 text-white" : "bg-white"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "year" && <YearGrid weeks={weeks} currentIdx={preLaunch ? -1 : currentWeek.idx} />}
        {view === "month" && <MonthList weeks={weeks} currentIdx={preLaunch ? -1 : currentWeek.idx} />}
        {view === "week" && <WeekDetail week={weeks[preLaunch ? 0 : currentWeek.idx]} preLaunch={preLaunch} />}
      </section>

      {/* Leave section */}
      <LeaveSection leaves={leaves} setLeaves={setLeaves} preLaunch={preLaunch} />

      {/* Certificate preview (only when completed) */}
      {lifecycle === "completed" && (
        <CertificatePreview student={assignment.student} blockId={assignment.blockId} subBatch={assignment.subBatch} />
      )}
    </div>
  );
}

function PreLaunchCard({ daysToStart, firstSeg, startDate }: { daysToStart: number; firstSeg?: Seg; startDate: string }) {
  return (
    <section className="card overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 via-white to-xcel-50 p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs uppercase tracking-wider">
            <Hourglass size={14} /> Internship Pre-launch
          </div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold">
            Begins in {daysToStart} day{daysToStart === 1 ? "" : "s"}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Start date: <strong>{startDate}</strong>. No postings, attendance or leaves are recorded yet.
          </p>
        </div>
        {firstSeg && (
          <div className="rounded-2xl border border-xcel-200 bg-white p-4 min-w-[220px]">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">First posting</div>
            <div className="mt-1 font-semibold">{firstSeg.deptName}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {firstSeg.startLabel} → {firstSeg.endLabel} · {firstSeg.weeks}w
            </div>
            <span className={`dept-chip ${firstSeg.color} mt-2`}>{firstSeg.deptShort}</span>
          </div>
        )}
      </div>
    </section>
  );
}

function CompletedCard({ segments }: { segments: Seg[] }) {
  return (
    <section className="card overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-50 via-white to-xcel-50 p-5 md:p-6">
        <div className="flex items-center gap-2 text-emerald-700 text-xs uppercase tracking-wider">
          <Trophy size={14} /> Internship Complete
        </div>
        <h2 className="mt-1 text-xl md:text-2xl font-bold">All {segments.length} postings completed.</h2>
        <p className="text-sm text-slate-600 mt-1">
          Your completion certificate preview is shown below. Final issuance after the March/April clinical-skills assessment.
        </p>
      </div>
    </section>
  );
}

function PostingCard({
  title,
  range,
  dept,
  highlight,
  subtitle,
}: {
  title: string;
  range: string;
  dept: WeekRow["cell"];
  highlight?: boolean;
  subtitle?: string;
}) {
  return (
    <div className={`card p-5 relative overflow-hidden ${highlight ? "ring-2 ring-xcel-500/40" : ""}`}>
      {highlight && (
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-xcel-100/60" />
      )}
      <div className="relative">
        <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{range}</div>
        {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`dept-chip ${dept.color}`}>{dept.deptShort}</span>
          <span className="font-semibold">{dept.deptName}</span>
        </div>
      </div>
    </div>
  );
}

function PostingStampCard({ seg, status }: { seg: Seg; status: "done" | "current" | "upcoming" }) {
  const base =
    status === "done"
      ? "bg-emerald-50/40 border-emerald-200"
      : status === "current"
      ? "bg-xcel-50 border-xcel-300 ring-2 ring-xcel-500/30"
      : "bg-white border-slate-200";
  return (
    <div className={`relative rounded-2xl border p-4 overflow-hidden ${base}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className={`dept-chip ${seg.color}`}>{seg.deptShort}</span>
          <div className="mt-2 font-semibold leading-tight">{seg.deptName}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            W{seg.startWeek + 1}–W{seg.endWeek + 1} · {seg.weeks}w
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {seg.startLabel} → {seg.endLabel}
          </div>
        </div>
        <StatusGlyph status={status} />
      </div>
      {/* Stamp / state badge */}
      <div className="mt-3 flex items-center justify-between">
        {status === "done" && (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md ring-1 ring-emerald-200">
            <CheckCircle2 size={11} /> Completed
          </span>
        )}
        {status === "current" && (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-xcel-700 bg-xcel-100 px-2 py-1 rounded-md ring-1 ring-xcel-200 animate-pulse">
            <Clock size={11} /> In Progress
          </span>
        )}
        {status === "upcoming" && (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md ring-1 ring-slate-200">
            <Lock size={11} /> Locked
          </span>
        )}
      </div>
      {status === "done" && <RubberStamp />}
    </div>
  );
}

function StatusGlyph({ status }: { status: "done" | "current" | "upcoming" }) {
  if (status === "done") return <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />;
  if (status === "current") return <Sparkles className="text-xcel-600 shrink-0" size={20} />;
  return <Lock className="text-slate-400 shrink-0" size={20} />;
}

function RubberStamp() {
  return (
    <div className="pointer-events-none absolute -right-3 -bottom-3 rotate-[-12deg] opacity-90">
      <div className="border-[3px] border-emerald-500/70 rounded-xl px-3 py-1.5 text-emerald-700 font-extrabold tracking-widest text-[10px] bg-white/60 backdrop-blur-sm shadow-sm">
        ★ CRMI ★<br />COMPLETED
      </div>
    </div>
  );
}

function YearGrid({ weeks, currentIdx }: { weeks: WeekRow[]; currentIdx: number }) {
  return (
    <div className="p-3 md:p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-13 gap-1.5 md:gap-2">
      {weeks.map((w) => {
        const isDone = currentIdx >= 0 && w.idx < currentIdx;
        const isNow = currentIdx >= 0 && w.idx === currentIdx;
        return (
          <div
            key={w.idx}
            className={`rounded-lg border p-1.5 text-[10px] md:text-[11px] ${
              isNow
                ? "border-xcel-500 ring-2 ring-xcel-200 bg-white"
                : isDone
                ? "border-slate-200 bg-slate-50 opacity-70"
                : "border-slate-200 bg-white"
            }`}
            title={`Week ${w.idx + 1} · ${w.label} · ${w.cell.deptName}`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>W{w.idx + 1}</span>
              {isDone && <CheckCircle2 size={10} className="text-emerald-600" />}
            </div>
            <span className={`dept-chip mt-1 ${w.cell.color}`}>{w.cell.deptShort}</span>
          </div>
        );
      })}
    </div>
  );
}

function MonthList({ weeks, currentIdx }: { weeks: WeekRow[]; currentIdx: number }) {
  const months: WeekRow[][] = [];
  for (let i = 0; i < weeks.length; i += 4) months.push(weeks.slice(i, i + 4));
  return (
    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
      {months.map((m, idx) => (
        <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-3 py-1.5 text-xs uppercase tracking-wide text-slate-600">
            Month {idx + 1}
          </div>
          <table className="w-full text-sm">
            <tbody>
              {m.map((w) => (
                <tr key={w.idx} className={w.idx === currentIdx ? "bg-xcel-50" : ""}>
                  <td className="px-3 py-2 text-slate-500 w-12">W{w.idx + 1}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap text-xs md:text-sm">{w.label}</td>
                  <td className="px-3 py-2">
                    <span className={`dept-chip ${w.cell.color}`}>{w.cell.deptShort}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function WeekDetail({ week, preLaunch }: { week: WeekRow; preLaunch: boolean }) {
  return (
    <div className="p-5 md:p-6">
      <div className="text-xs text-slate-500">Week {week.idx + 1} {preLaunch && "(starts when internship begins)"}</div>
      <div className="text-lg font-semibold">{week.label}</div>
      <div className="mt-4 flex items-center gap-2 text-xl flex-wrap">
        <span className={`dept-chip ${week.cell.color}`}>{week.cell.deptShort}</span>
        <span className="font-semibold">{week.cell.deptName}</span>
      </div>
    </div>
  );
}

function LeaveSection({
  leaves,
  setLeaves,
  preLaunch,
}: {
  leaves: any[];
  setLeaves: (l: any[]) => void;
  preLaunch: boolean;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("Casual");
  const [reason, setReason] = useState("");
  const [docName, setDocName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to) return;
    setLeaves([
      ...leaves,
      { id: Date.now(), from, to, reason, type, status: "Pending", doc: docName },
    ]);
    setFrom(""); setTo(""); setReason(""); setDocName(""); setType("Casual");
  }

  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="card p-5">
        <h2 className="font-semibold flex items-center gap-2">
          <Clock size={18} className="text-xcel-600" /> Submit Leave Request
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {preLaunch
            ? "Advance leave can be planned now — it will route for approval once postings begin."
            : "Notify in advance so the department can plan coverage."}
        </p>
        <form onSubmit={submit} className="mt-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-slate-500">From</span>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" required />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">To</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" required />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-slate-500">Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg">
              <option>Casual</option><option>Medical</option><option>Emergency</option><option>Bereavement</option><option>Academic</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">Reason</span>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Brief reason" />
          </label>
          <DropZone onFile={(f) => setDocName(f.name)} />
          {docName && <div className="text-xs text-emerald-700 flex items-center gap-1"><CheckCircle2 size={14} /> Attached: {docName}</div>}
          <button className="btn-primary w-full justify-center">Submit Request</button>
        </form>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold">My Leave Requests</h2>
        <p className="text-xs text-slate-500 mt-1">Live status from the coordinators.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {leaves.length === 0 && <li className="text-slate-500 italic">No requests yet.</li>}
          {leaves.map((l) => (
            <li key={l.id} className="border border-slate-200 rounded-lg p-3 flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="font-medium">{l.from} → {l.to} <span className="text-xs text-slate-400">· {l.type}</span></div>
                {l.reason && <div className="text-xs text-slate-500 mt-0.5">{l.reason}</div>}
                {l.doc && <div className="text-xs text-slate-400 mt-0.5">📎 {l.doc}</div>}
              </div>
              <StatusBadge status={l.status} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  const map = {
    Pending: "bg-amber-100 text-amber-800 ring-amber-200",
    Approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    Rejected: "bg-rose-100 text-rose-800 ring-rose-200",
  } as const;
  const Icon = status === "Approved" ? CheckCircle2 : status === "Rejected" ? AlertCircle : Clock;
  return <span className={`badge ring-1 ${map[status]}`}><Icon size={12} /> {status}</span>;
}

function DropZone({ onFile }: { onFile: (f: File) => void }) {
  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
      className="block border-2 border-dashed border-slate-300 rounded-xl p-4 text-center text-sm text-slate-500 cursor-pointer hover:bg-slate-50"
    >
      <Upload className="mx-auto mb-1 text-slate-400" />
      Drag & drop leave letter / medical certificate (.pdf, .jpg)
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </label>
  );
}

function CertificatePreview({
  student,
  blockId,
  subBatch,
}: {
  student: { name: string; regNo: string };
  blockId: number;
  subBatch: string;
}) {
  return (
    <section className="card p-6 md:p-10 bg-gradient-to-br from-white via-amber-50/30 to-white border-amber-200 ring-1 ring-amber-200">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-700">
          <Stamp size={14} /> Provisional Completion Preview
        </div>
        <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tight">Certificate of Internship Completion</h2>
        <div className="mt-2 text-sm text-slate-500">Yenepoya Medical College, Mangalore</div>
        <div className="mt-8 text-slate-700">This is to certify that</div>
        <div className="mt-2 text-2xl md:text-3xl font-bold text-xcel-700">{student.name}</div>
        <div className="text-sm text-slate-500 mt-1">
          Reg. No. <span className="font-mono">{student.regNo}</span> · Block {blockId} · Sub-batch {subBatch}
        </div>
        <p className="mt-6 max-w-2xl mx-auto text-slate-600 text-sm leading-relaxed">
          has satisfactorily completed the Compulsory Rotatory Medical Internship Programme as per the NMC
          notification UGMEB/NMC/RULES & REGULATIONS/2021 dated 18.11.2021, including all mandatory postings
          across General Medicine, General Surgery, Community Medicine, OBG, Paediatrics, and allied departments.
        </p>
        <div className="mt-10 flex items-center justify-around flex-wrap gap-6 text-xs text-slate-500">
          <div>
            <div className="h-px bg-slate-300 w-32 mx-auto" />
            <div className="mt-1">Principal, YMC</div>
          </div>
          <div className="relative">
            <div className="border-[3px] border-amber-600/70 rounded-full w-24 h-24 grid place-items-center text-amber-700 font-bold text-[10px] tracking-widest rotate-[-8deg] bg-amber-50/50">
              YMC<br />OFFICIAL<br />SEAL
            </div>
          </div>
          <div>
            <div className="h-px bg-slate-300 w-32 mx-auto" />
            <div className="mt-1">Internship Coordinator</div>
          </div>
        </div>
      </div>
    </section>
  );
}
