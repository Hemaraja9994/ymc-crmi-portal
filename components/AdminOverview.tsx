"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Hourglass,
  Printer,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { ANNOUNCEMENTS, CATEGORY_STYLES } from "@/lib/announcements";
import { attendanceFor, ATTENDANCE_THRESHOLD } from "@/lib/attendance";
import { LeaveRecord, LEAVE_TYPE_COLORS, isOnLeave, loadLeaves } from "@/lib/leaves";
import { START_DATE, daysUntilStart, isPreLaunch } from "@/lib/rotation";

export default function AdminOverview({
  assignments,
  dist,
  blocks,
  currentWeek,
}: {
  assignments: any[];
  dist: Record<string, number>;
  blocks: any[];
  currentWeek: { idx: number; label: string };
}) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);

  useEffect(() => setLeaves(loadLeaves()), []);

  const preLaunch = isPreLaunch();
  const days = daysUntilStart();
  const today = new Date().toISOString().slice(0, 10);

  const pending = leaves.filter((leave) => leave.status === "Pending").length;
  const approved = leaves.filter((leave) => leave.status === "Approved").length;
  const todayLeaveCount = useMemo(
    () => (preLaunch ? 0 : assignments.filter((a) => isOnLeave(a.student.regNo, leaves)).length),
    [assignments, leaves, preLaunch]
  );
  const deficientCount = useMemo(
    () => (preLaunch ? 0 : assignments.filter((a) => attendanceFor(a.student.regNo, leaves).deficient).length),
    [assignments, leaves, preLaunch]
  );

  const activeDeptCount = preLaunch ? 0 : Object.values(dist).filter((count) => count > 0).length;
  const activeLeader = Object.entries(dist)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])[0];

  const deptTiles = blocks.flatMap((block: any) =>
    block.depts.map((dept: any) => {
      const count = dist[dept.code] || 0;
      const onLeave = leaves.filter(
        (leave) =>
          leave.status === "Approved" &&
          leave.from <= today &&
          leave.to >= today &&
          assignments
            .find((a) => a.student.regNo === leave.regNo)
            ?.rotation.some((r: any) => r.weekIdx === currentWeek.idx && r.deptCode === dept.code)
      ).length;

      return { block, dept, count, onLeave };
    })
  );

  return (
    <div className="space-y-6">
      <section className="brand-panel relative overflow-hidden rounded-[2rem] p-6 text-white shadow-2xl shadow-blue-950/10 md:p-8">
        <div className="geo-overlay absolute inset-0 opacity-70" />
        <div className="relative grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-100 backdrop-blur">
              <Sparkles size={14} /> Coordinator Console
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
              CRMI Operations Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-50/90 md:text-base">
              MBBS 2021 CBME live overview for postings, leave approvals, attendance alerts,
              report exports and principal-ready documentation.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <GlassKPI icon={<Users size={16} />} label="Total Interns" value={assignments.length} sub="Active roster" />
              <GlassKPI icon={<Building2 size={16} />} label="Depts Live" value={activeDeptCount} sub={activeLeader ? `${activeLeader[0]} (${activeLeader[1]})` : "Pre-launch"} />
              <GlassKPI icon={<ClipboardCheck size={16} />} label="Pending Leaves" value={pending} sub={`${approved} approved`} accent="amber" />
              <GlassKPI icon={<Activity size={16} />} label="On Leave Today" value={todayLeaveCount} sub="Across all postings" accent="rose" />
              <GlassKPI icon={<ShieldAlert size={16} />} label={`Below ${ATTENDANCE_THRESHOLD}%`} value={deficientCount} sub="Attendance alerts" accent="rose" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-100">This week</div>
            <div className="mt-2 text-2xl font-extrabold">W{currentWeek.idx + 1}</div>
            <p className="mt-1 text-sm text-blue-50/80">{currentWeek.label}</p>
            <div className="mt-4 grid gap-2">
              <QuickAction href="/admin/reports" icon={<FileText size={16} />} label="PDF reports" />
              <QuickAction href="/admin/leaves" icon={<ClipboardCheck size={16} />} label="Review leave inbox" />
              <QuickAction href="/admin/roster" icon={<Users size={16} />} label="Open full roster" />
            </div>
          </div>
        </div>
      </section>

      {preLaunch && (
        <section className="card overflow-hidden border-amber-100 bg-gradient-to-r from-amber-50 via-white to-cyan-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                <Hourglass size={19} />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-amber-700">Pre-launch</div>
                <div className="text-xl font-extrabold text-slate-950">
                  Internship begins in {days} day{days === 1 ? "" : "s"}
                </div>
                <div className="text-xs text-slate-500">
                  Start date: {START_DATE.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}.
                  Live counters activate once postings begin.
                </div>
              </div>
            </div>
            <Link href="/admin/reports" className="btn-outline">
              <Printer size={16} /> Prepare report pack
            </Link>
          </div>
        </section>
      )}

      <Announcements />

      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="badge border border-cyan-100 bg-cyan-50 text-cyan-700">Live allocation map</div>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-950">Department Distribution</h2>
            <p className="text-xs text-slate-500">Click a tile for roster details, leave status and HOD actions.</p>
          </div>
          <Link href="/admin/departments" className="btn-ghost">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
          {deptTiles.map(({ block, dept, count, onLeave }: any) => {
            const width = count ? Math.min(100, Math.round((count / Math.max(1, assignments.length / 4)) * 100)) : 4;
            return (
              <Link
                key={dept.code}
                href={`/admin/departments/${dept.code}`}
                className="group rounded-2xl border border-slate-200 bg-white/90 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`dept-chip ${dept.color}`}>{dept.short}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    Block {block.id}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-3xl font-extrabold leading-none text-slate-950">{count}</div>
                    <div className="mt-1 text-[11px] font-medium text-slate-500">students posted</div>
                  </div>
                  {onLeave > 0 ? (
                    <span className="badge bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                      <ShieldAlert size={11} /> {onLeave} leave
                    </span>
                  ) : (
                    <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <CheckCircle2 size={11} /> clear
                    </span>
                  )}
                </div>
                <div className="mt-3 truncate text-xs text-slate-600">{dept.name}</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: `${width}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{dept.weeks} week posting</span>
                  <span>CL: {dept.casualLeaveDays === "Nil" ? "Nil" : `${dept.casualLeaveDays}d`}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {blocks.map((block: any) => {
          const inBlock = assignments.filter((a) => a.blockId === block.id).length;
          const totalWeeks = block.depts.reduce((sum: number, dept: any) => sum + dept.weeks, 0);
          return (
            <Link
              key={block.id}
              href={`/admin/blocks/${block.id}`}
              className="card group overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-900/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{block.title}</div>
                  <div className="mt-1 text-3xl font-extrabold text-slate-950">{inBlock}</div>
                  <div className="text-xs text-slate-500">interns assigned</div>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white shadow-lg shadow-blue-950/10">
                  <BarChart3 size={18} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {block.depts.map((dept: any) => (
                  <span key={dept.code} className={`dept-chip ${dept.color}`}>{dept.short}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{totalWeeks} weeks</span>
                <span className="inline-flex items-center gap-1 text-cyan-700">
                  Open block <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {!preLaunch && deficientCount > 0 && <DeficiencyAlerts assignments={assignments} leaves={leaves} />}

      <RecentLeaves assignments={assignments} leaves={leaves} />
    </div>
  );
}

function GlassKPI({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  accent?: "amber" | "rose";
}) {
  const tone =
    accent === "amber"
      ? "border-amber-200/25 bg-amber-300/10"
      : accent === "rose"
        ? "border-rose-200/25 bg-rose-300/10"
        : "border-white/15 bg-white/10";

  return (
    <div className={`rounded-2xl border p-3 backdrop-blur-md ${tone}`}>
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-cyan-100">
        {icon} {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold leading-none">{value}</div>
      {sub && <div className="mt-1 truncate text-[11px] text-blue-50/70">{sub}</div>}
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15"
    >
      <span className="inline-flex items-center gap-2">{icon} {label}</span>
      <ArrowUpRight size={14} />
    </Link>
  );
}

function Announcements() {
  const highlights = ANNOUNCEMENTS.filter((announcement) => announcement.highlight);
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-rose-500" />
          <h2 className="font-semibold">Live Updates - Rules & Notices</h2>
          <span className="badge bg-rose-50 text-rose-600 ring-1 ring-rose-100">LIVE</span>
        </div>
        <Link href="/admin/announcements" className="text-sm font-medium text-cyan-700 hover:underline">
          View all
        </Link>
      </div>
      <div className="ymc-ticker overflow-hidden whitespace-nowrap bg-gradient-to-r from-rose-50 via-amber-50 to-cyan-50 px-4 py-2 text-sm">
        <div className="ymc-marquee inline-flex gap-8 pr-8">
          {[...highlights, ...highlights].map((announcement, index) => (
            <span key={index} className="inline-flex items-center gap-2">
              <span className={`badge ring-1 ${CATEGORY_STYLES[announcement.category]}`}>
                {announcement.category}
              </span>
              <strong>{announcement.title}</strong>
              <span className="text-slate-500">- {announcement.body}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeficiencyAlerts({ assignments, leaves }: { assignments: any[]; leaves: LeaveRecord[] }) {
  const rows = assignments
    .map((assignment) => ({ assignment, attendance: attendanceFor(assignment.student.regNo, leaves) }))
    .filter(({ attendance }) => attendance.deficient)
    .sort((a, b) => a.attendance.attendancePct - b.attendance.attendancePct)
    .slice(0, 8);

  return (
    <section className="card overflow-hidden ring-1 ring-rose-200">
      <div className="flex items-center justify-between border-b border-rose-200 bg-rose-50/70 p-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-rose-600" size={18} />
          <h2 className="font-semibold text-rose-800">Attendance Deficiency Alerts ({rows.length})</h2>
        </div>
        <Link href="/admin/roster" className="text-sm text-rose-700 hover:underline">View roster</Link>
      </div>
      <ul className="divide-y divide-rose-100">
        {rows.map(({ assignment, attendance }: any) => (
          <li key={assignment.student.regNo} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <div className="min-w-0">
              <Link href={`/admin/student/${assignment.student.regNo}`} className="font-medium hover:text-cyan-700">
                {assignment.student.name}
              </Link>
              <div className="font-mono text-xs text-slate-500">
                {assignment.student.regNo} - Block {assignment.blockId} - {assignment.subBatch}
              </div>
            </div>
            <span className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200">{attendance.attendancePct}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecentLeaves({ assignments, leaves }: { assignments: any[]; leaves: LeaveRecord[] }) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200/70 p-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-cyan-600" size={18} />
          <h2 className="font-semibold">Recent Leave Activity</h2>
        </div>
        <Link href="/admin/leaves" className="text-sm font-medium text-cyan-700 hover:underline">Manage</Link>
      </div>
      <div className="divide-y divide-slate-100">
        {leaves.slice(0, 5).map((leave) => {
          const student = assignments.find((assignment) => assignment.student.regNo === leave.regNo);
          return (
            <div key={leave.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <div className="min-w-0">
                <div className="truncate font-medium">{student?.student.name || leave.regNo}</div>
                <div className="text-xs text-slate-500">{leave.from} to {leave.to} - {leave.reason || "No reason recorded"}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[leave.type]}`}>{leave.type}</span>
                <StatusBadge status={leave.status} />
              </div>
            </div>
          );
        })}
        {leaves.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No leave activity recorded yet.</div>
        )}
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

  return <span className={`badge ring-1 ${map[status]}`}>{status}</span>;
}
