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
import { attendanceFor, ATTENDANCE_THRESHOLD } from "@/lib/attendance";
import { loadLeaves, LeaveRecord } from "@/lib/leaves";
import { Send, BedDouble, ShieldAlert, Download, Pause, X, BookOpen, ExternalLink, Library } from "lucide-react";
import { getStudentCertificateStatuses, type CertificateStatus, type PostingPeriod } from "@/lib/certificates";
import { LOGBOOKS, LEARNING_RESOURCES, type LogbookObjective } from "@/lib/logbook";

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
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
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

      <MilestoneProgressMap
        segments={segments}
        currentWeekIdx={currentWeek.idx}
        lifecycle={lifecycle}
        preLaunch={preLaunch}
      />

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

      {/* Leave record — read-only. Students cannot apply themselves;
          leaves are recorded by the Coordination Cell per committee decision. */}
      <LeaveRecordView leaves={leaves} regNo={assignment.student.regNo} />

      {/* Logbook objectives for the CURRENT posting + learning resources */}
      {!preLaunch && currentWeek?.cell && (
        <CurrentPostingLogbook deptCode={currentWeek.cell.deptCode} />
      )}
      <LearningResourcesCard />

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
  const safe = !deficient && pct >= ATTENDANCE_THRESHOLD;
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

type RoadmapStatus = "done" | "current" | "upcoming";
type RoadmapPoint = { x: number; y: number };

function MilestoneProgressMap({
  segments,
  currentWeekIdx,
  lifecycle,
  preLaunch,
}: {
  segments: Seg[];
  currentWeekIdx: number;
  lifecycle: "pre-launch" | "active" | "completed";
  preLaunch: boolean;
}) {
  const desktopPoints = milestonePoints(segments.length);
  const statuses = segments.map((seg) => segmentMilestoneStatus(seg, currentWeekIdx, lifecycle, preLaunch));

  return (
    <section className="card p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
            <Trophy size={12} /> Milestone Progress Map
          </div>
          <h2 className="mt-2 text-lg font-extrabold text-slate-900">Posting Roadmap</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            Follow each posting as a quest node. Completed levels glow with an official seal, the current
            posting pulses, and upcoming postings remain locked until their rotation window opens.
          </p>
        </div>
        <Link
          href="/postings-overview"
          className="inline-flex items-center gap-1 rounded-full border border-xcel-200 bg-xcel-50 px-3 py-1.5 text-xs font-semibold text-xcel-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-xcel-100"
        >
          Full posting list <ChevronRight size={13} />
        </Link>
      </div>

      <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#f0fdfa,transparent_34%),linear-gradient(135deg,#f8fafc,#ffffff_48%,#fff7ed)] p-3 shadow-inner md:p-5">
        <div className="relative hidden h-[430px] md:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {desktopPoints.slice(0, -1).map((point, index) => (
              <path
                key={`desktop-track-${index}`}
                d={connectorPath(point, desktopPoints[index + 1], index)}
                fill="none"
                stroke={connectorColor(statuses[index], statuses[index + 1])}
                strokeWidth={statuses[index] === "done" || statuses[index + 1] === "current" ? 1.25 : 0.9}
                strokeLinecap="round"
                strokeDasharray={statuses[index] === "done" || statuses[index + 1] === "current" ? undefined : "2.4 2.4"}
                opacity={statuses[index] === "upcoming" ? 0.52 : 0.9}
              />
            ))}
          </svg>

          {segments.map((seg, index) => {
            const point = desktopPoints[index];
            return (
              <div
                key={`${seg.deptCode}-${seg.startWeek}-map`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 hover:z-30 focus-within:z-30"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <MilestoneNode
                  seg={seg}
                  status={statuses[index]}
                  index={index}
                  tooltipPlacement={point.y > 55 ? "top" : "bottom"}
                />
              </div>
            );
          })}
        </div>

        <div className="relative md:hidden">
          {segments.map((seg, index) => {
            const status = statuses[index];
            const isRight = index % 2 === 1;
            return (
              <div
                key={`${seg.deptCode}-${seg.startWeek}-mobile-map`}
                className={`relative flex min-h-[132px] ${isRight ? "justify-end pr-2" : "justify-start pl-2"}`}
              >
                {index < segments.length - 1 && (
                  <svg
                    className="pointer-events-none absolute left-0 top-[66px] z-0 h-[124px] w-full"
                    viewBox="0 0 100 120"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d={isRight ? "M 74 0 C 74 42 26 72 26 120" : "M 26 0 C 26 42 74 72 74 120"}
                      fill="none"
                      stroke={connectorColor(status, statuses[index + 1])}
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeDasharray={status === "done" || statuses[index + 1] === "current" ? undefined : "7 8"}
                      opacity={status === "upcoming" ? 0.5 : 0.9}
                    />
                  </svg>
                )}
                <div className="relative z-10 hover:z-30 focus-within:z-30">
                  <MilestoneNode
                    seg={seg}
                    status={status}
                    index={index}
                    compact
                    tooltipPlacement={index < segments.length - 2 ? "bottom" : "top"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600" /> Completed seal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500" />
          </span>
          Current level
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock size={12} className="text-slate-400" /> Locked upcoming
        </span>
      </div>
    </section>
  );
}

function MilestoneNode({
  seg,
  status,
  index,
  compact = false,
  tooltipPlacement,
}: {
  seg: Seg;
  status: RoadmapStatus;
  index: number;
  compact?: boolean;
  tooltipPlacement: "top" | "bottom";
}) {
  const nodeSize =
    status === "current"
      ? compact
        ? "h-24 w-24"
        : "h-28 w-28"
      : compact
      ? "h-20 w-20"
      : "h-[5.5rem] w-[5.5rem]";
  const statusClass =
    status === "done"
      ? "border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-emerald-950 shadow-[0_0_26px_rgba(16,185,129,0.32)]"
      : status === "current"
      ? "border-cyan-400 bg-gradient-to-br from-white via-cyan-50 to-amber-50 text-slate-950 shadow-[0_0_38px_rgba(6,182,212,0.45)]"
      : "border-slate-200 bg-gradient-to-br from-slate-100 to-white text-slate-500 opacity-75 shadow-sm";
  const tooltipPosition =
    tooltipPlacement === "top"
      ? "bottom-[calc(100%+0.75rem)]"
      : "top-[calc(100%+0.75rem)]";

  return (
    <div className="group relative flex flex-col items-center">
      {status === "current" && (
        <span className="absolute inset-1 z-0 animate-ping rounded-full border-2 border-cyan-400/55 motion-reduce:hidden" />
      )}
      <button
        type="button"
        aria-label={`${seg.deptName}, ${seg.weeks} weeks, ${seg.startLabel} to ${seg.endLabel}`}
        className={`${nodeSize} relative z-10 grid place-items-center rounded-full border-2 ${statusClass} transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100`}
      >
        <span className="absolute left-2 top-2 rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-black text-slate-400 ring-1 ring-slate-200">
          {String(index + 1).padStart(2, "0")}
        </span>
        {status === "done" && (
          <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-white">
            <CheckCircle2 size={16} />
          </span>
        )}
        {status === "upcoming" && (
          <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-slate-700 text-white shadow-md ring-4 ring-white">
            <Lock size={14} />
          </span>
        )}
        <span className="flex flex-col items-center text-center leading-none">
          <span className="max-w-[4.4rem] text-[11px] font-black leading-tight tracking-tight">{seg.deptShort}</span>
          <span className="mt-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
            {seg.weeks}w
          </span>
        </span>
      </button>
      {status === "current" && (
        <span className="relative z-20 -mt-2 rounded-full bg-cyan-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
          Current
        </span>
      )}
      <div
        className={`pointer-events-none absolute left-1/2 ${tooltipPosition} z-30 w-64 -translate-x-1/2 scale-95 rounded-2xl border border-slate-200 bg-white/95 p-3 text-left opacity-0 shadow-xl shadow-slate-200/70 backdrop-blur transition-[transform,opacity] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 motion-reduce:transition-none`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</div>
            <div className="mt-0.5 text-sm font-extrabold leading-tight text-slate-900">{seg.deptName}</div>
          </div>
          <span className={`dept-chip ${seg.color}`}>{seg.deptShort}</span>
        </div>
        <div className="mt-3 grid gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays size={13} className="text-xcel-600" />
            <span>{seg.startLabel} to {seg.endLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-amber-500" />
            <span>{seg.weeks} Week{seg.weeks === 1 ? "" : "s"} target XP</span>
          </div>
          <div className="flex items-center gap-2">
            {status === "done" ? (
              <CheckCircle2 size={13} className="text-emerald-600" />
            ) : status === "current" ? (
              <Clock size={13} className="text-cyan-600" />
            ) : (
              <Lock size={13} className="text-slate-400" />
            )}
            <span className="capitalize">{status === "done" ? "completed" : status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function milestonePoints(count: number): RoadmapPoint[] {
  if (count <= 1) return [{ x: 50, y: 50 }];
  const yPattern = [72, 42, 58, 30, 48, 68, 38, 54];
  return Array.from({ length: count }, (_, index) => ({
    x: 7 + (86 * index) / (count - 1),
    y: yPattern[index % yPattern.length],
  }));
}

function segmentMilestoneStatus(
  seg: Seg,
  currentWeekIdx: number,
  lifecycle: "pre-launch" | "active" | "completed",
  preLaunch: boolean
): RoadmapStatus {
  if (lifecycle === "completed") return "done";
  if (preLaunch) return "upcoming";
  if (seg.endWeek < currentWeekIdx) return "done";
  if (seg.startWeek <= currentWeekIdx && seg.endWeek >= currentWeekIdx) return "current";
  return "upcoming";
}

function connectorPath(from: RoadmapPoint, to: RoadmapPoint, index: number) {
  const controlX = (from.x + to.x) / 2;
  const lift = index % 2 === 0 ? -9 : 9;
  const controlY = (from.y + to.y) / 2 + lift;
  return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
}

function connectorColor(status: RoadmapStatus, nextStatus?: RoadmapStatus) {
  if (status === "done") return "#10b981";
  if (status === "current" || nextStatus === "current") return "#06b6d4";
  return "#94a3b8";
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

// Read-only leave history. Per CRMI committee decision (Mar 2026), students
// can no longer self-apply — leaves are recorded by the Coordination Cell.
// Students still see their own record here.
function LeaveRecordView({ leaves, regNo }: { leaves: LeaveRecord[]; regNo: string }) {
  const mine = leaves
    .filter((l) => l.regNo === regNo)
    .sort((a, b) => (b.from || "").localeCompare(a.from || ""));

  const counted = mine.filter((l) => l.status === "Approved");
  const cl = counted.filter((l) => l.type === "CL").length;
  const adl = counted.filter((l) => l.type === "Ad.L").length;
  const absent = counted.filter((l) => l.type === "Absent").length;

  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/60 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900">My Leave Record</h2>
            <p className="text-xs text-slate-500">
              Maintained by the CRMI Coordination Cell. Contact Dr. Imaad (attendance &amp; leaves)
              for corrections or new entries.
            </p>
          </div>
          <div className="flex gap-2 text-[11px]">
            <span className="rounded-full bg-sky-100 px-2 py-1 font-semibold text-sky-800">CL · {cl}</span>
            <span className="rounded-full bg-amber-100 px-2 py-1 font-semibold text-amber-800">Ad.L · {adl}</span>
            <span className="rounded-full bg-rose-100 px-2 py-1 font-semibold text-rose-800">Absent · {absent}</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5">
        {mine.length === 0 ? (
          <div className="text-sm text-slate-500 italic text-center py-6">
            No leave records yet. Days you don't attend will appear here once entered by the
            Coordination Cell.
          </div>
        ) : (
          <ul className="space-y-2 text-sm">
            {mine.map((l) => (
              <li key={l.id} className="border border-slate-200 rounded-lg p-3 flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="font-medium">
                    {l.from} → {l.to}{" "}
                    <span className={`ml-1 badge ring-1 ${
                      l.type === "CL" ? "bg-sky-100 text-sky-800 ring-sky-200" :
                      l.type === "Ad.L" ? "bg-amber-100 text-amber-800 ring-amber-200" :
                      "bg-rose-100 text-rose-800 ring-rose-200"
                    }`}>{l.type}</span>
                  </div>
                  {l.reason && <div className="text-xs text-slate-500 mt-1">{l.reason}</div>}
                  {l.type === "Ad.L" && l.status === "Approved" && (
                    <div className="text-[11px] text-amber-700 mt-1">Posting extended by 1× these days.</div>
                  )}
                  {l.type === "Absent" && l.status === "Approved" && (
                    <div className="text-[11px] text-rose-700 mt-1">Posting extended by 2× these days (unauthorised absence).</div>
                  )}
                </div>
                <StatusBadge status={l.status as any} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  const map = {
    Pending:  "bg-amber-100 text-amber-800 ring-amber-200",
    Approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    Rejected: "bg-rose-100 text-rose-800 ring-rose-200",
  } as const;
  const Icon = status === "Approved" ? CheckCircle2 : status === "Rejected" ? AlertCircle : Clock;
  return <span className={`badge ring-1 ${map[status]}`}><Icon size={12} /> {status}</span>;
}

// ─── Removed (committee decision Mar 2026): AdvanceLeaveForm, RetroLeaveForm,
// TabBtn, MyLeaves, DropZone. Students no longer self-apply for leave.

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


// ─── Current Posting Logbook ──────────────────────────────────────────────
function CurrentPostingLogbook({ deptCode }: { deptCode: string }) {
  const lb = LOGBOOKS[deptCode];
  if (!lb) return null;

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const STORAGE_KEY = `ymc_logbook_${deptCode}`;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]));
    } catch { /* ignore */ }
  }, [STORAGE_KEY]);

  function toggle(id: string) {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompleted(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
  }

  const total = lb.objectives.length;
  const done = lb.objectives.filter((o) => completed.has(o.id)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const kindIcon: Record<LogbookObjective["kind"], string> = {
    skill: "🎯",
    procedure: "🩺",
    case: "📋",
    knowledge: "📚",
    "log-entry": "📝",
  };

  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-gradient-to-r from-xcel-50 to-white p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-xcel-700" />
              <h2 className="font-bold text-slate-900">Current Posting Logbook</h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              <strong>{lb.deptName}</strong> · {lb.weeks} week{lb.weeks > 1 ? "s" : ""} ·
              <span className="ml-1">{done} of {total} objectives ticked</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-500 italic max-w-2xl">{lb.introduction}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-xcel-700">{pct}%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Progress</div>
          </div>
        </div>
        {/* progress bar */}
        <div style={{ marginTop: 10, height: 6, borderRadius: 999, background: "#E5E7EB", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#4338CA", transition: "width 0.4s ease" }} />
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {lb.objectives.map((obj) => {
          const isDone = completed.has(obj.id);
          return (
            <li key={obj.id} className="px-4 py-2.5 hover:bg-slate-50 flex items-start gap-3">
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => toggle(obj.id)}
                className="mt-1 h-4 w-4 accent-accent-600 shrink-0 cursor-pointer"
                aria-label={obj.title}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm">{kindIcon[obj.kind]}</span>
                  <span className={`text-sm ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {obj.title}
                  </span>
                  {obj.mandatory && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded ring-1 ring-rose-100">
                      Mandatory
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {(lb.recommendedReading?.length || lb.externalLinks?.length) ? (
        <div className="border-t border-slate-100 bg-slate-50/60 p-4 text-xs space-y-1">
          {lb.recommendedReading && (
            <div>
              <strong className="text-slate-700">Recommended reading:</strong>{" "}
              <span className="text-slate-600">{lb.recommendedReading.join(" · ")}</span>
            </div>
          )}
        </div>
      ) : null}

      <div className="border-t border-slate-100 bg-amber-50/40 p-3 text-[11px] text-amber-900">
        ⚠️ Objectives shown above are sourced from public NMC 2021 guidance and require HOD sign-off
        in the official Yenepoya logbook before they count for completion.
      </div>
    </section>
  );
}

// ─── Learning Resources ─────────────────────────────────────────────────────
function LearningResourcesCard() {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/60 p-4 flex items-center gap-2">
        <Library size={16} className="text-accent-600" />
        <div>
          <h2 className="font-bold text-slate-900">Learning Resources</h2>
          <p className="text-xs text-slate-500">Curated regulatory + clinical references for the internship year.</p>
        </div>
      </div>
      <ul className="divide-y divide-slate-100">
        {LEARNING_RESOURCES.map((r) => {
          const isExternal = r.url.startsWith("http");
          return (
            <li key={r.title} className="p-4 hover:bg-xcel-50/40">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge bg-xcel-100 text-xcel-800 ring-1 ring-xcel-200">{r.tag}</span>
                    <span className="font-semibold text-sm text-slate-900">{r.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{r.description}</p>
                </div>
                {isExternal ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs shrink-0"
                  >
                    <ExternalLink size={12} /> Open
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 shrink-0 italic">Available offline</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
