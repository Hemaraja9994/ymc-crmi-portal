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
import { stayDutyFor } from "@/lib/stay-duty";
import { attendanceFor, ATTENDANCE_THRESHOLD, projectedDeficitForPlannedLeave } from "@/lib/attendance";
import { loadLeaves, LeaveRecord, LeaveCategory } from "@/lib/leaves";
import { Send, BedDouble, ShieldAlert, Download, Pause, X } from "lucide-react";
import { getStudentCertificateStatuses, type CertificateStatus, type PostingPeriod } from "@/lib/certificates";

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
    { id: string; from: string; to: string; reason: string; type: string; category: LeaveCategory; status: "Pending" | "Approved" | "Rejected"; doc?: string }[]
  >([]);
  const [globalLeaves, setGlobalLeaves] = useState<LeaveRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadPersistedLeaves() {
      try {
        const [mine, all] = await Promise.all([
          fetch(`/api/leave?regNo=${encodeURIComponent(assignment.student.regNo)}`, { cache: "no-store" }),
          fetch("/api/leave", { cache: "no-store" }),
        ]);
        if (!mine.ok || !all.ok) throw new Error("Leave API unavailable");
        const mineJson = await mine.json();
        const allJson = await all.json();
        if (!cancelled) {
          setLeaves(mineJson.leaves || []);
          setGlobalLeaves(allJson.leaves || []);
        }
      } catch {
        if (!cancelled) setGlobalLeaves(loadLeaves());
      }
    }
    void loadPersistedLeaves();
    return () => {
      cancelled = true;
    };
  }, [assignment.student.regNo]);
  const attendance = attendanceFor(assignment.student.regNo, globalLeaves);

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
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-accent-500/25 rounded-full blur-3xl" />
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
                className="btn bg-accent-600 hover:bg-accent-700 text-white text-sm"
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
              {/* Progress bar — refactored for older Android WebKit (Vivo V60 etc.):
                  explicit pixel sizes, solid rgba, no Tailwind opacity utilities,
                  flex-based tick layout instead of absolute-positioned 1px spans. */}
              <div
                style={{
                  position: "relative",
                  marginTop: 8,
                  height: 10,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.18)",
                  overflow: "hidden",
                  WebkitTransform: "translateZ(0)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${overallPct}%`,
                    background: "#34d399",
                    borderRadius: 999,
                    transition: "width 0.4s ease",
                  }}
                />
                {/* Checkpoint ticks — 3px wide, drawn ABOVE the bar via SVG overlay
                    so they render reliably on older WebKit. */}
                <svg
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                  preserveAspectRatio="none"
                  viewBox="0 0 100 10"
                >
                  {[25, 50, 75].map((p) => (
                    <rect key={p} x={p - 0.3} y="1" width="0.6" height="8" fill="rgba(255,255,255,0.55)" />
                  ))}
                </svg>
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
          <CurrentPostingCard
            range={currentSeg ? `${currentSeg.startLabel} → ${currentSeg.endLabel}` : currentWeek.label}
            dept={currentWeek.cell}
            subtitle={currentSeg ? `Week ${currentSeg.startWeek + 1}–${currentSeg.endWeek + 1} · ${currentSeg.weeks} weeks` : undefined}
            student={assignment.student}
            blockId={assignment.blockId}
            subBatch={assignment.subBatch}
          />
          <PostingCard title="Up next" range={nextWeek.label} dept={nextWeek.cell} />
        </section>
      )}

      {/* Attendance status — visible only after launch */}
      {!preLaunch && (
        <AttendanceCard attendance={attendance} />
      )}

      {/* Posting completion reports — visible once any posting has started */}
      {!preLaunch && (
        <CertificatesCard assignment={assignment} />
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
          <Link href="/postings-overview" className="text-xs text-xcel-700 hover:underline inline-flex items-center gap-1">
            See who else is in each dept →
          </Link>
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

      {/* Leave section (two-category) */}
      <LeaveSection
        leaves={leaves}
        setLeaves={setLeaves}
        preLaunch={preLaunch}
        regNo={assignment.student.regNo}
        globalLeaves={globalLeaves}
      />

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

function CurrentPostingCard({
  range,
  dept,
  subtitle,
  student,
  blockId,
  subBatch,
}: {
  range: string;
  dept: WeekRow["cell"];
  subtitle?: string;
  student: { name: string; regNo: string };
  blockId: number;
  subBatch: string;
}) {
  const stay = stayDutyFor(dept.deptCode);
  const message = [
    `*YMC CRMI Posting*`,
    `${student.name} (${student.regNo})`,
    `Block ${blockId} · Sub-batch ${subBatch}`,
    ``,
    `🏥 Department: ${dept.deptName}`,
    `📅 Window: ${range}`,
    subtitle ? `⏳ ${subtitle}` : "",
    ``,
    stay.required
      ? `🛏️ Stay-duty REQUIRED — ${stay.rooms || "room TBA"}${stay.note ? ` · ${stay.note}` : ""}`
      : `🛏️ No stay-duty room${stay.note ? ` · ${stay.note}` : ""}`,
  ]
    .filter(Boolean)
    .join("\n");
  const encoded = encodeURIComponent(message);

  return (
    <div className="card p-5 relative overflow-hidden ring-2 ring-xcel-500/40">
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-xcel-100/60" />
      <div className="relative">
        <div className="text-xs uppercase tracking-wide text-slate-500">Current posting</div>
        <div className="mt-1 text-sm text-slate-600">{range}</div>
        {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`dept-chip ${dept.color}`}>{dept.deptShort}</span>
          <span className="font-semibold">{dept.deptName}</span>
        </div>

        {/* Stay-duty hint */}
        <div className={`mt-3 text-xs rounded-lg px-3 py-2 flex items-start gap-2 ${
          stay.required ? "bg-rose-50 text-rose-800 ring-1 ring-rose-200" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
        }`}>
          <BedDouble size={14} className="mt-0.5 shrink-0" />
          <div>
            {stay.required ? (
              <>
                <strong>Stay-duty required.</strong> {stay.rooms && <span>{stay.rooms}.</span>}{" "}
                {stay.note && <span>{stay.note}</span>}
              </>
            ) : (
              <>
                <strong>No stay-duty room.</strong> {stay.note}
              </>
            )}
          </div>
        </div>

        {/* Send posting to WhatsApp */}
        <a
          href={`whatsapp://send?text=${encoded}`}
          data-fallback={`https://wa.me/?text=${encoded}`}
          onClick={(e) => {
            // Fallback to web wa.me if whatsapp:// is not registered (desktop browsers).
            const target = e.currentTarget as HTMLAnchorElement;
            const fb = target.getAttribute("data-fallback");
            setTimeout(() => {
              if (!document.hidden && fb) window.location.href = fb;
            }, 500);
          }}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg py-2.5 font-medium text-sm transition"
        >
          <Send size={14} /> Send Posting to WhatsApp
        </a>
        <div className="mt-1 text-[10px] text-slate-400 text-center">
          Includes department, dates and stay-duty room
        </div>
      </div>
    </div>
  );
}

function AttendanceCard({ attendance }: { attendance: ReturnType<typeof attendanceFor> }) {
  const pct = attendance.attendancePct;
  const deficient = attendance.deficient;
  const safe = !deficient && pct >= ATTENDANCE_THRESHOLD + 5;
  const ringColor = deficient ? "stroke-rose-500" : safe ? "stroke-emerald-500" : "stroke-amber-500";
  const bg = deficient ? "bg-rose-50 ring-rose-200" : safe ? "bg-emerald-50 ring-emerald-200" : "bg-amber-50 ring-amber-200";

  return (
    <section className={`card p-5 ring-1 ${bg} relative overflow-hidden`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Mini progress ring */}
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.9155" className="fill-none stroke-white" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9155"
                className={`fill-none ${ringColor}`}
                strokeWidth="3"
                strokeDasharray={`${Math.min(100, pct)} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-sm font-bold">
              {pct}%
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500">Attendance</div>
            <div className="text-lg font-bold">
              {deficient ? "Below NMC threshold" : safe ? "On track" : "Approaching threshold"}
            </div>
            <div className="text-xs text-slate-500">
              {attendance.daysAttended}/{attendance.daysElapsed} days · {attendance.daysOnLeave} on approved leave · minimum {ATTENDANCE_THRESHOLD}%
            </div>
          </div>
        </div>
        {deficient && (
          <div className="inline-flex items-center gap-2 text-rose-700 text-sm font-medium">
            <ShieldAlert size={16} /> Repeat posting risk
          </div>
        )}
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
  regNo,
  globalLeaves,
}: {
  leaves: any[];
  setLeaves: (l: any[]) => void;
  preLaunch: boolean;
  regNo: string;
  globalLeaves: LeaveRecord[];
}) {
  const [tab, setTab] = useState<"advance" | "retro">("advance");

  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-200 flex">
        <TabBtn active={tab === "advance"} onClick={() => setTab("advance")}>
          📅 Advance Leave Notification
        </TabBtn>
        <TabBtn active={tab === "retro"} onClick={() => setTab("retro")}>
          🚑 Retroactive / Emergency Leave
        </TabBtn>
      </div>
      <div className="p-5 grid md:grid-cols-2 gap-5">
        {tab === "advance" ? (
          <AdvanceLeaveForm leaves={leaves} setLeaves={setLeaves} regNo={regNo} globalLeaves={globalLeaves} preLaunch={preLaunch} />
        ) : (
          <RetroLeaveForm leaves={leaves} setLeaves={setLeaves} regNo={regNo} />
        )}
        <MyLeaves leaves={leaves} />
      </div>
    </section>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition ${
        active
          ? "border-xcel-600 text-xcel-700 bg-xcel-50/60"
          : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function AdvanceLeaveForm({
  leaves,
  setLeaves,
  regNo,
  globalLeaves,
  preLaunch,
}: {
  leaves: any[];
  setLeaves: (l: any[]) => void;
  regNo: string;
  globalLeaves: LeaveRecord[];
  preLaunch: boolean;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("Casual");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Live projection: if this leave were approved, would the intern fall under 80%?
  const projection = from && to
    ? projectedDeficitForPlannedLeave(regNo, globalLeaves, from, to)
    : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to) return;
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNo, from, to, reason, type, category: "Advance" }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not submit leave request.");
        return;
      }
      setLeaves([...leaves, result.leave]);
      setFrom(""); setTo(""); setReason(""); setType("Casual");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-sm">
      <div>
        <h3 className="font-semibold flex items-center gap-2">
          <Clock size={16} className="text-xcel-600" /> Notify in advance
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Log a planned leave (conference, family event, exam) <em>weeks in advance</em> so the
          coordination cell can adjust the roster.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-slate-500">From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </label>
        <label className="block">
          <span className="text-xs text-slate-500">To</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-slate-500">Type</span>
        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg">
          <option>Casual</option><option>Academic</option><option>Bereavement</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs text-slate-500">Reason / context</span>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="e.g. National conference presentation in Chennai" />
      </label>

      {projection && !preLaunch && projection.deficient && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3 py-2 flex items-start gap-2">
          <ShieldAlert size={14} className="mt-0.5" />
          <div>
            <strong>Heads up.</strong> If approved, your year-end attendance projection drops to{" "}
            <strong>{projection.attendancePct}%</strong> — below the NMC 80% threshold. Coordinators
            will see a deficiency flag.
          </div>
        </div>
      )}

      {error && <div className="text-xs text-rose-600">{error}</div>}
      <button className="btn-primary w-full justify-center" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit advance notification"}
      </button>
    </form>
  );
}

function RetroLeaveForm({
  leaves,
  setLeaves,
  regNo,
}: {
  leaves: any[];
  setLeaves: (l: any[]) => void;
  regNo: string;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("Medical");
  const [reason, setReason] = useState("");
  const [docName, setDocName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to || !docName) return;
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNo, from, to, reason, type, category: "Retroactive", doc: docName }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not submit leave request.");
        return;
      }
      setLeaves([...leaves, result.leave]);
      setFrom(""); setTo(""); setReason(""); setDocName(""); setType("Medical");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-sm">
      <div>
        <h3 className="font-semibold flex items-center gap-2">
          <ShieldAlert size={16} className="text-rose-500" /> After-the-fact / emergency
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload your medical certificate or supporting document for absences that already
          happened. Document upload is mandatory.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-slate-500">From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </label>
        <label className="block">
          <span className="text-xs text-slate-500">To</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-slate-500">Type</span>
        <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg">
          <option>Medical</option><option>Emergency</option><option>Bereavement</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs text-slate-500">Reason</span>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Brief reason — incident, diagnosis, etc." />
      </label>
      <DropZone onFile={(f) => setDocName(f.name)} />
      {docName ? (
        <div className="text-xs text-emerald-700 flex items-center gap-1">
          <CheckCircle2 size={14} /> Attached: {docName}
        </div>
      ) : (
        <div className="text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle size={14} /> A document (MC/letter) is required for retroactive leave.
        </div>
      )}
      {error && <div className="text-xs text-rose-600">{error}</div>}
      <button disabled={!docName || submitting} className={`btn w-full justify-center ${docName ? "btn-primary" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}>
        {submitting ? "Submitting..." : "Submit retroactive request"}
      </button>
    </form>
  );
}

function MyLeaves({ leaves }: { leaves: any[] }) {
  return (
    <div>
      <h3 className="font-semibold">My Leave Requests</h3>
      <p className="text-xs text-slate-500 mt-0.5">Live status from the coordinators.</p>
      <ul className="mt-3 space-y-2 text-sm">
        {leaves.length === 0 && <li className="text-slate-500 italic">No requests yet.</li>}
        {leaves.map((l) => (
          <li key={l.id} className="border border-slate-200 rounded-lg p-3 flex justify-between items-start gap-2">
            <div className="min-w-0">
              <div className="font-medium">
                {l.from} → {l.to}{" "}
                <span className="text-xs text-slate-400">· {l.type}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[10px]">
                {l.category === "Advance" ? (
                  <span className="badge bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200">📅 Advance</span>
                ) : (
                  <span className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200">🚑 Retroactive</span>
                )}
              </div>
              {l.reason && <div className="text-xs text-slate-500 mt-1">{l.reason}</div>}
              {l.doc && <div className="text-xs text-slate-400 mt-0.5">📎 {l.doc}</div>}
            </div>
            <StatusBadge status={l.status} />
          </li>
        ))}
      </ul>
    </div>
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

// ── Posting Completion Certificates ──────────────────────────────────────────
function CertificatesCard({ assignment }: { assignment: { student: { regNo: string; name: string }; blockId: number; subBatch: string; rotation: WeekRow["cell"][] } }) {
  const [rows, setRows] = useState<Array<{ posting: PostingPeriod; status: CertificateStatus }>>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    setRows(getStudentCertificateStatuses(assignment as any));
    try {
      const raw = window.localStorage.getItem("ymc_cert_dismissed_v1");
      setDismissed(raw ? JSON.parse(raw) : []);
    } catch { /* ignore */ }
  }, [assignment]);

  function dismiss(key: string) {
    const next = [...dismissed, key];
    setDismissed(next);
    try { window.localStorage.setItem("ymc_cert_dismissed_v1", JSON.stringify(next)); } catch {}
  }

  // "Newly available" = released but not yet dismissed (acts as notification)
  const newlyReleased = rows.filter(
    (r) => r.status.kind === "released" && !dismissed.includes(r.posting.key)
  );

  if (rows.length === 0) return null;

  return (
    <section className="card overflow-hidden">
      {/* Notification banner for newly available certificates */}
      {newlyReleased.length > 0 && (
        <div className="border-b border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-5 py-3">
          {newlyReleased.slice(0, 1).map((r) => (
            <div key={r.posting.key} className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-emerald-900">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>
                  Your posting completion report for <strong>{r.posting.deptName}</strong> is now available.
                  {newlyReleased.length > 1 && <span className="ml-1 text-emerald-700">(+{newlyReleased.length - 1} more)</span>}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/certificate/${encodeURIComponent(r.posting.regNo)}/${encodeURIComponent(r.posting.key)}`}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  <Download size={12} /> Download PDF
                </Link>
                <button
                  onClick={() => dismiss(r.posting.key)}
                  className="rounded-md p-1 text-emerald-700 hover:bg-emerald-100"
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Posting Completion Reports</div>
            <h2 className="font-bold text-slate-900">Department-wise Completion Reports</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              A PDF report is auto-released after each posting ends (allowing approved leave days).
            </p>
          </div>
          <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            {rows.filter((r) => r.status.kind === "released").length} / {rows.length} ready
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <CertificateTile key={r.posting.key} row={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificateTile({ row }: { row: { posting: PostingPeriod; status: CertificateStatus } }) {
  const { posting, status } = row;
  const released = status.kind === "released";

  let stateColor = "border-slate-200 bg-white";
  let badgeNode: React.ReactNode = null;
  if (status.kind === "released") {
    stateColor = "border-emerald-200 bg-emerald-50/40";
    badgeNode = (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
        <CheckCircle2 size={10} /> Released{status.auto ? " (auto)" : ""}
      </span>
    );
  } else if (status.kind === "ongoing") {
    stateColor = "border-sky-200 bg-sky-50/40";
    badgeNode = (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
        In progress
      </span>
    );
  } else if (status.kind === "on-hold") {
    stateColor = "border-rose-200 bg-rose-50/40";
    badgeNode = (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
        <Pause size={10} /> On hold
      </span>
    );
  } else {
    stateColor = "border-amber-200 bg-amber-50/40";
    badgeNode = (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
        <Hourglass size={10} /> Awaiting release
      </span>
    );
  }

  const endLabel = posting.endDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className={`rounded-2xl border p-3 transition ${stateColor}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className={`dept-chip ${posting.deptColor}`}>{posting.deptShort}</span>
          <div className="mt-1.5 truncate text-sm font-bold text-slate-900">{posting.deptName}</div>
          <div className="text-[11px] text-slate-500">
            Block {posting.blockId} · {posting.weeks} wk{posting.weeks > 1 ? "s" : ""} · ends {endLabel}
          </div>
        </div>
        {badgeNode}
      </div>

      <div className="mt-2.5">
        {released ? (
          <Link
            href={`/certificate/${encodeURIComponent(posting.regNo)}/${encodeURIComponent(posting.key)}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-700"
          >
            <Download size={12} /> Download Completion Report
          </Link>
        ) : status.kind === "ongoing" ? (
          <div className="text-center text-[11px] text-slate-400">Available after posting ends</div>
        ) : status.kind === "on-hold" ? (
          <div className="text-center text-[11px] text-rose-700">
            {status.reason ? `Hold reason: ${status.reason}` : "Contact CRMI office"}
          </div>
        ) : (
          <div className="text-center text-[11px] text-amber-700">Awaiting Coordinator release</div>
        )}
      </div>
    </div>
  );
}

