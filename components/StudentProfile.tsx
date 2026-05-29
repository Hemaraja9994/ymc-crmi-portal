"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CircleDashed,
  Clock,
  Mail,
  MessageCircle,
  CalendarRange,
  AlertCircle,
  IdCard,
} from "lucide-react";
import { LeaveRecord, LEAVE_TYPE_COLORS, loadLeaves } from "@/lib/leaves";
import { attendanceFor, ATTENDANCE_THRESHOLD } from "@/lib/attendance";
import { ShieldAlert } from "lucide-react";

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

export default function StudentProfile({
  assignment,
  completed,
  current,
  upcoming,
  allSegments,
  week,
}: {
  assignment: any;
  completed: Seg[];
  current: Seg | null;
  upcoming: Seg[];
  allSegments: Seg[];
  week: { idx: number; label: string };
}) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  useEffect(() => setLeaves(loadLeaves()), []);
  const myLeaves = leaves.filter((l) => l.regNo === assignment.student.regNo);
  const attendance = attendanceFor(assignment.student.regNo, leaves);

  const initials = assignment.student.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");

  const totalWeeksCompleted = completed.reduce((s, c) => s + c.weeks, 0);
  const progress = Math.round((totalWeeksCompleted / 52) * 100);

  const waText = useMemo(() => {
    const lines = [
      `*YMC CRMI · ${assignment.student.name}*`,
      `Reg No: ${assignment.student.regNo} · Block ${assignment.blockId} · ${assignment.subBatch}`,
      ``,
      `Current: ${current?.deptName || "—"}`,
      `Window: ${current?.startLabel} → ${current?.endLabel}`,
      ``,
      `Completed (${completed.length}):`,
      ...completed.map((c) => `  ✓ ${c.deptShort} (${c.weeks}w)`),
      `Upcoming (${upcoming.length}):`,
      ...upcoming.slice(0, 5).map((c) => `  ○ ${c.deptShort} (${c.weeks}w)`),
    ];
    return encodeURIComponent(lines.join("\n"));
  }, [assignment, current, completed, upcoming]);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <header className="card overflow-hidden">
        <div className="bg-gradient-to-br from-xcel-600 via-xcel-700 to-xcel-900 text-white p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/15 ring-1 ring-white/20 grid place-items-center text-2xl font-bold backdrop-blur">
                {initials}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-xcel-100">Intern Profile</div>
                <h1 className="text-2xl md:text-3xl font-bold mt-0.5">{assignment.student.name}</h1>
                <div className="mt-1 text-sm text-xcel-100/90 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1"><IdCard size={14} /> {assignment.student.regNo}</span>
                  <span>Block {assignment.blockId}</span>
                  <span>Sub-batch <span className="font-mono">{assignment.subBatch}</span></span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/?text=${waText}`}
                target="_blank"
                className="btn bg-accent-600 hover:bg-accent-700 text-white"
              >
                <MessageCircle size={14} /> WhatsApp schedule
              </a>
              <button className="btn bg-white/10 hover:bg-white/20 text-white">
                <Mail size={14} /> Email schedule
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-xcel-100">Internship progress · {totalWeeksCompleted}/52 weeks</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div
              style={{
                marginTop: 6,
                height: 8,
                borderRadius: 999,
                background: "rgba(255,255,255,0.18)",
                overflow: "hidden",
                WebkitTransform: "translateZ(0)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "#34d399",
                  borderRadius: 999,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 text-sm">
          <Stat label="Completed postings" value={completed.length} icon={<CheckCircle2 size={14} className="text-emerald-600" />} />
          <Stat label="Current posting" value={current?.deptShort || "—"} icon={<Clock size={14} className="text-xcel-600" />} />
          <Stat label="Upcoming postings" value={upcoming.length} icon={<CircleDashed size={14} className="text-slate-500" />} />
          <Stat label="Leaves on file" value={myLeaves.length} icon={<CalendarRange size={14} className="text-rose-600" />} />
        </div>
      </header>

      {/* Attendance status */}
      {!attendance.preLaunch && (
        <section className={`card p-5 ring-1 ${attendance.deficient ? "bg-rose-50 ring-rose-200" : attendance.attendancePct >= ATTENDANCE_THRESHOLD ? "bg-emerald-50 ring-emerald-200" : "bg-amber-50 ring-amber-200"}`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9155" className="fill-none stroke-white" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9155"
                    className={`fill-none ${attendance.deficient ? "stroke-rose-500" : attendance.attendancePct >= ATTENDANCE_THRESHOLD ? "stroke-emerald-500" : "stroke-amber-500"}`}
                    strokeWidth="3"
                    strokeDasharray={`${Math.min(100, attendance.attendancePct)} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center text-sm font-bold">{attendance.attendancePct}%</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Attendance</div>
                <div className="text-lg font-bold">
                  {attendance.deficient ? "Below NMC threshold" : attendance.attendancePct >= ATTENDANCE_THRESHOLD ? "On track" : "Approaching threshold"}
                </div>
                <div className="text-xs text-slate-500">
                  {attendance.daysAttended}/{attendance.daysElapsed} days · {attendance.daysOnLeave} on approved leave · minimum {ATTENDANCE_THRESHOLD}%
                </div>
              </div>
            </div>
            {attendance.deficient && (
              <div className="inline-flex items-center gap-2 text-rose-700 text-sm font-medium">
                <ShieldAlert size={16} /> Repeat-posting risk
              </div>
            )}
          </div>
        </section>
      )}

      {/* Current posting */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 md:col-span-2 ring-2 ring-xcel-500/30">
          <div className="text-xs uppercase tracking-wide text-xcel-700">Now posted in</div>
          {current ? (
            <>
              <div className="mt-1 text-2xl font-bold">{current.deptName}</div>
              <div className="mt-1 text-sm text-slate-600">
                Week {current.startWeek + 1}–{current.endWeek + 1} · {current.startLabel} → {current.endLabel} · {current.weeks} weeks
              </div>
              <div className="mt-3">
                <span className={`dept-chip ${current.color}`}>{current.deptShort}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500 mt-2">No active posting this week.</div>
          )}
        </div>

        <div className="card p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">Up next</div>
          {upcoming[0] ? (
            <>
              <div className="mt-1 text-lg font-semibold">{upcoming[0].deptName}</div>
              <div className="text-sm text-slate-600 mt-1">
                {upcoming[0].startLabel} → {upcoming[0].endLabel}
              </div>
              <div className="mt-3">
                <span className={`dept-chip ${upcoming[0].color}`}>{upcoming[0].deptShort}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500 mt-2">All postings complete.</div>
          )}
        </div>
      </section>

      {/* Timeline (segments) */}
      <section className="card p-5">
        <h2 className="font-semibold">Posting Timeline</h2>
        <p className="text-xs text-slate-500">
          Compact view of all postings across the year. Hover for details.
        </p>
        <div className="mt-4 flex h-9 rounded-xl overflow-hidden ring-1 ring-slate-200">
          {allSegments.map((s) => {
            const isDone = s.endWeek < week.idx;
            const isNow = s.startWeek <= week.idx && s.endWeek >= week.idx;
            return (
              <div
                key={`${s.deptCode}-${s.startWeek}`}
                title={`${s.deptName} · ${s.startLabel} → ${s.endLabel}`}
                className={`relative flex items-center justify-center text-[10px] font-semibold ${s.color} ${
                  isDone ? "opacity-50" : ""
                } ${isNow ? "ring-2 ring-xcel-600 ring-inset z-10" : ""}`}
                style={{ flex: s.weeks }}
              >
                {s.deptShort}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 opacity-50" /> Completed</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-xcel-600" /> Current</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> Upcoming</span>
        </div>
      </section>

      {/* Completed + Upcoming detail */}
      <section className="grid md:grid-cols-2 gap-4">
        <PostingList title={`Completed (${completed.length})`} icon={<CheckCircle2 className="text-emerald-600" size={16} />} items={completed} tone="done" />
        <PostingList title={`Upcoming (${upcoming.length})`} icon={<CircleDashed className="text-slate-500" size={16} />} items={upcoming} tone="upcoming" />
      </section>

      {/* Leaves */}
      <section className="card">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <CalendarRange size={16} className="text-xcel-600" />
          <h2 className="font-semibold">Leave History</h2>
        </div>
        {myLeaves.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No leave applications on file.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myLeaves.map((l) => (
              <div key={l.id} className="px-4 py-3 flex items-center justify-between text-sm gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[l.type]}`}>{l.type}</span>
                  <div>
                    <div className="font-medium">
                      {l.from} → {l.to}
                    </div>
                    {l.reason && <div className="text-xs text-slate-500">{l.reason}</div>}
                  </div>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div>
        <Link href="/admin/roster" className="text-sm text-xcel-700 hover:underline">
          ← Back to roster
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: any; icon: React.ReactNode }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wide">
        {icon} {label}
      </div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

function PostingList({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: Seg[];
  tone: "done" | "upcoming";
}) {
  return (
    <div className="card">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      {items.length === 0 ? (
        <div className="p-5 text-sm text-slate-500">None.</div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((s) => (
            <li key={`${s.deptCode}-${s.startWeek}`} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`dept-chip ${s.color}`}>{s.deptShort}</span>
                  <span className="font-medium">{s.deptName}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  W{s.startWeek + 1}–W{s.endWeek + 1} · {s.startLabel} → {s.endLabel}
                </div>
              </div>
              <span className="text-sm font-mono text-slate-600">{s.weeks}w</span>
            </li>
          ))}
        </ul>
      )}
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
  return (
    <span className={`badge ring-1 ${map[status]}`}>
      <Icon size={12} /> {status}
    </span>
  );
}
