"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Activity,
  ClipboardCheck,
  Building2,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { ANNOUNCEMENTS, CATEGORY_STYLES } from "@/lib/announcements";
import { LeaveRecord, loadLeaves, LEAVE_TYPE_COLORS, isOnLeave } from "@/lib/leaves";
import { Hourglass, ShieldAlert } from "lucide-react";
import { isPreLaunch, daysUntilStart, START_DATE } from "@/lib/rotation";
import { attendanceFor, ATTENDANCE_THRESHOLD } from "@/lib/attendance";

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
  const todayLeaveCount = useMemo(
    () => (preLaunch ? 0 : assignments.filter((a) => isOnLeave(a.student.regNo, leaves)).length),
    [assignments, leaves, preLaunch]
  );
  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;

  const totalDeptsActive = preLaunch ? 0 : Object.values(dist).filter((v) => v > 0).length;
  const maxDept = Object.entries(dist).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])[0];
  const deficientCount = useMemo(
    () => (preLaunch ? 0 : assignments.filter((a) => attendanceFor(a.student.regNo, leaves).deficient).length),
    [assignments, leaves, preLaunch]
  );

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 text-white p-6 md:p-8">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-brand-100 text-xs uppercase tracking-wider">
            <Sparkles size={14} /> Coordinator Console
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">
            CRMI Oversight — MBBS 2021 CBME
          </h1>
          <p className="text-brand-100/80 text-sm mt-1">
            Live operational view · Week <strong>W{currentWeek.idx + 1}</strong> · {currentWeek.label}
          </p>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3">
            <GlassKPI icon={<Users size={16} />} label="Total Interns" value={assignments.length} sub="Active roster" />
            <GlassKPI icon={<Building2 size={16} />} label="Depts Live" value={totalDeptsActive} sub={maxDept ? `${maxDept[0]} (${maxDept[1]})` : ""} />
            <GlassKPI icon={<ClipboardCheck size={16} />} label="Pending Leaves" value={pending} sub={`${approved} approved`} accent="amber" />
            <GlassKPI icon={<Activity size={16} />} label="On Leave Today" value={todayLeaveCount} sub="Across all depts" accent="rose" />
            <GlassKPI icon={<ShieldAlert size={16} />} label={`< ${ATTENDANCE_THRESHOLD}% Attendance`} value={deficientCount} sub="Deficiency alerts" accent="rose" />
          </div>
        </div>
      </section>

      {/* Pre-launch countdown */}
      {preLaunch && (
        <section className="card p-5 bg-gradient-to-r from-amber-50 via-white to-xcel-50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 grid place-items-center">
                <Hourglass size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-700">Pre-launch</div>
                <div className="text-lg font-bold">
                  Internship begins in {days} day{days === 1 ? "" : "s"}
                </div>
                <div className="text-xs text-slate-500">
                  Start date: {START_DATE.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}.
                  All counters reset to zero until then.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Live announcements ticker */}
      <Announcements />

      {/* Department distribution heatmap */}
      <section className="card p-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-semibold">Live Department Distribution</h2>
            <p className="text-xs text-slate-500">
              Click any tile to view the dept roster and live leave status.
            </p>
          </div>
          <Link href="/admin/departments" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {blocks.flatMap((b: any) =>
            b.depts.map((d: any) => {
              const count = dist[d.code] || 0;
              const onLeave = leaves.filter(
                (l) =>
                  l.status === "Approved" &&
                  assignments
                    .find((a) => a.student.regNo === l.regNo)
                    ?.rotation.some((r: any) => r.weekIdx === currentWeek.idx && r.deptCode === d.code) &&
                  l.from <= new Date().toISOString().slice(0, 10) &&
                  l.to >= new Date().toISOString().slice(0, 10)
              ).length;
              return (
                <Link
                  key={d.code}
                  href={`/admin/departments/${d.code}`}
                  className="group rounded-xl border border-slate-200 p-3 hover:border-brand-400 hover:shadow-md transition relative bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className={`dept-chip ${d.color}`}>{d.short}</span>
                    <span className="text-[10px] text-slate-400">Block {b.id}</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{count}</div>
                  <div className="text-[11px] text-slate-500 truncate">{d.name}</div>
                  {onLeave > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 ring-1 ring-rose-200 px-1.5 py-0.5 rounded-full">
                      <AlertTriangle size={10} /> {onLeave} on leave
                    </span>
                  )}
                  <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-500"
                      style={{ width: `${Math.min(100, count * 15)}%` }}
                    />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Block summary cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {blocks.map((b: any) => {
          const inBlock = assignments.filter((a) => a.blockId === b.id).length;
          return (
            <Link
              key={b.id}
              href={`/admin/blocks/${b.id}`}
              className="card p-5 hover:shadow-md transition group relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-brand-50 group-hover:bg-brand-100 transition" />
              <div className="relative">
                <div className="text-xs text-slate-500">{b.title}</div>
                <div className="text-3xl font-bold mt-1">{inBlock}</div>
                <div className="text-xs text-slate-500">interns assigned</div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {b.depts.slice(0, 4).map((d: any) => (
                    <span key={d.code} className={`dept-chip ${d.color}`}>{d.short}</span>
                  ))}
                  {b.depts.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">+{b.depts.length - 4}</span>
                  )}
                </div>
                <div className="mt-3 text-xs text-brand-600 flex items-center gap-1">
                  Open block <ArrowUpRight size={12} />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Deficiency alerts */}
      {!preLaunch && deficientCount > 0 && (
        <section className="card overflow-hidden ring-1 ring-rose-200">
          <div className="p-4 border-b border-rose-200 bg-rose-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-rose-600" size={18} />
              <h2 className="font-semibold text-rose-800">
                Attendance Deficiency Alerts ({deficientCount})
              </h2>
            </div>
            <Link href="/admin/roster" className="text-sm text-rose-700 hover:underline">
              View all in roster →
            </Link>
          </div>
          <ul className="divide-y divide-rose-100">
            {assignments
              .map((a: any) => ({ a, att: attendanceFor(a.student.regNo, leaves) }))
              .filter(({ att }) => att.deficient)
              .sort((x: any, y: any) => x.att.attendancePct - y.att.attendancePct)
              .slice(0, 8)
              .map(({ a, att }: any) => (
                <li key={a.student.regNo} className="px-4 py-3 flex items-center justify-between text-sm gap-3">
                  <div className="min-w-0">
                    <Link href={`/admin/student/${a.student.regNo}`} className="font-medium hover:text-xcel-700">
                      {a.student.name}
                    </Link>
                    <div className="text-xs text-slate-500 font-mono">
                      {a.student.regNo} · Block {a.blockId} · {a.subBatch}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {att.daysOnLeave}d leave / {att.daysElapsed}d
                    </span>
                    <span className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200">
                      <ShieldAlert size={11} /> {att.attendancePct}%
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* Recent leaves */}
      <section className="card">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-brand-600" />
            <h2 className="font-semibold">Recent Leave Activity</h2>
          </div>
          <Link href="/admin/leaves" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            Manage <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {leaves.slice(0, 5).map((l) => {
            const stu = assignments.find((a) => a.student.regNo === l.regNo);
            return (
              <div key={l.id} className="px-4 py-3 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="font-medium truncate">{stu?.student.name || l.regNo}</div>
                  <div className="text-xs text-slate-500">
                    {l.from} → {l.to} · {l.reason || "—"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[l.type]}`}>{l.type}</span>
                  <StatusBadge status={l.status} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
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
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  accent?: "amber" | "rose";
}) {
  const accentRing = accent === "amber" ? "ring-amber-300/30" : accent === "rose" ? "ring-rose-300/30" : "ring-white/10";
  return (
    <div className={`rounded-xl bg-white/10 backdrop-blur-sm ring-1 ${accentRing} p-3`}>
      <div className="flex items-center gap-2 text-brand-100 text-[11px] uppercase tracking-wide">
        {icon} {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub && <div className="text-[11px] text-brand-100/70 mt-0.5 truncate">{sub}</div>}
    </div>
  );
}

function Announcements() {
  const highlights = ANNOUNCEMENTS.filter((a) => a.highlight);
  return (
    <section className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-rose-500" />
          <h2 className="font-semibold">Live Updates · Rules & Notices</h2>
          <span className="inline-flex items-center gap-1 text-[10px] text-rose-600">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> LIVE
          </span>
        </div>
        <Link href="/admin/announcements" className="text-sm text-brand-600 hover:underline">
          View all
        </Link>
      </div>
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-brand-50 px-4 py-2 text-sm overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-8 animate-[marquee_30s_linear_infinite]">
          {[...highlights, ...highlights].map((a, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <span className={`badge ring-1 ${CATEGORY_STYLES[a.category]}`}>{a.category}</span>
              <strong>{a.title}</strong>
              <span className="text-slate-500">— {a.body}</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
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
