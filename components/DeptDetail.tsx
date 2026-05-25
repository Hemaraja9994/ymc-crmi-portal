"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users,
  AlertCircle,
  CheckCircle2,
  Calendar,
  PlusCircle,
  CalendarRange,
  ExternalLink,
} from "lucide-react";
import {
  LeaveRecord,
  LeaveType,
  LEAVE_TYPE_COLORS,
  loadLeaves,
  isOnLeave,
  saveLeaves,
} from "@/lib/leaves";

export default function DeptDetail({
  dept,
  currentWeek,
  roster,
  history,
  totalWeeks,
}: {
  dept: any;
  currentWeek: { idx: number; label: string };
  roster: any[];
  history: number[];
  totalWeeks: number;
}) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  useEffect(() => setLeaves(loadLeaves()), []);

  const onLeaveNow = roster.filter((s) => isOnLeave(s.student.regNo, leaves));
  const onDuty = roster.filter((s) => !isOnLeave(s.student.regNo, leaves));
  const maxH = Math.max(1, ...history);

  // Quick "Mark on leave" form state
  const [qaReg, setQaReg] = useState("");
  const [qaType, setQaType] = useState<LeaveType>("Casual");
  const [qaFrom, setQaFrom] = useState("");
  const [qaTo, setQaTo] = useState("");
  const [qaReason, setQaReason] = useState("");
  const [qaOk, setQaOk] = useState("");

  function quickAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!qaReg || !qaFrom || !qaTo) return;
    const rec: LeaveRecord = {
      id: `qa_${Date.now()}`,
      regNo: qaReg,
      type: qaType,
      from: qaFrom,
      to: qaTo,
      reason: qaReason || "Logged by coordinator",
      status: "Approved",
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    const next = [...leaves, rec];
    setLeaves(next);
    saveLeaves(next);
    setQaOk(`Recorded ${qaType} leave for ${qaReg}.`);
    setQaReg(""); setQaFrom(""); setQaTo(""); setQaReason(""); setQaType("Casual");
    setTimeout(() => setQaOk(""), 3000);
  }

  return (
    <div className="space-y-5">
      <header className="card p-6 bg-gradient-to-br from-xcel-600 via-xcel-700 to-xcel-900 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-xcel-100">Department</div>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{dept.name}</h1>
            <p className="text-sm text-xcel-100/80 mt-1">
              {dept.weeks} week{dept.weeks > 1 ? "s" : ""} · Casual leave{" "}
              {typeof dept.casualLeaveDays === "number" ? `${dept.casualLeaveDays} days` : "Nil"}
            </p>
            <p className="text-xs text-xcel-100/70 mt-2">
              W{currentWeek.idx + 1} · {currentWeek.label}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 min-w-[280px]">
            <Stat label="Posted" value={roster.length} />
            <Stat label="On Duty" value={onDuty.length} tone="emerald" />
            <Stat label="On Leave" value={onLeaveNow.length} tone="rose" />
          </div>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-3">
        <Link
          href={`/postings-overview/${dept.code}`}
          className="card p-4 hover:shadow-md hover:border-xcel-400 transition flex items-center gap-3"
        >
          <CalendarRange className="text-xcel-600" />
          <div className="min-w-0">
            <div className="font-semibold text-sm">Year view (Dept × 52 weeks)</div>
            <div className="text-xs text-slate-500">Public — students & HODs can view</div>
          </div>
          <ExternalLink size={14} className="ml-auto text-slate-400" />
        </Link>
        <Link
          href={`/hod/${dept.code}`}
          className="card p-4 hover:shadow-md hover:border-xcel-400 transition flex items-center gap-3"
        >
          <PlusCircle className="text-emerald-600" />
          <div className="min-w-0">
            <div className="font-semibold text-sm">HOD / Unit Head console</div>
            <div className="text-xs text-slate-500">Log leaves at unit level</div>
          </div>
          <ExternalLink size={14} className="ml-auto text-slate-400" />
        </Link>
        <div className="card p-4 flex items-center gap-3">
          <AlertCircle className="text-rose-500" />
          <div className="min-w-0">
            <div className="font-semibold text-sm">{onLeaveNow.length} on leave today</div>
            <div className="text-xs text-slate-500">in {dept.short}</div>
          </div>
        </div>
      </section>

      {/* Quick add — coordinator can record leave inline */}
      <section className="card p-5">
        <h2 className="font-semibold flex items-center gap-2">
          <PlusCircle size={18} className="text-xcel-600" /> Quick-add leave for {dept.short}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Record leave for any intern currently posted in {dept.short}. For department-only access without admin login, share <code>/hod/{dept.code}</code> with the unit head.
        </p>
        <form onSubmit={quickAdd} className="mt-4 grid sm:grid-cols-2 md:grid-cols-6 gap-2 text-sm">
          <select
            value={qaReg}
            onChange={(e) => setQaReg(e.target.value)}
            className="md:col-span-2 px-3 py-2 border border-slate-300 rounded-lg"
            required
          >
            <option value="">Intern…</option>
            {roster.map((a: any) => (
              <option key={a.student.regNo} value={a.student.regNo}>
                {a.student.regNo} — {a.student.name}
              </option>
            ))}
          </select>
          <select
            value={qaType}
            onChange={(e) => setQaType(e.target.value as LeaveType)}
            className="px-3 py-2 border border-slate-300 rounded-lg"
          >
            {(["Casual", "Medical", "Emergency", "Bereavement", "Academic"] as LeaveType[]).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input type="date" value={qaFrom} onChange={(e) => setQaFrom(e.target.value)} required className="px-3 py-2 border border-slate-300 rounded-lg" />
          <input type="date" value={qaTo} onChange={(e) => setQaTo(e.target.value)} required className="px-3 py-2 border border-slate-300 rounded-lg" />
          <button className="btn-primary justify-center">Record</button>
          <input
            value={qaReason}
            onChange={(e) => setQaReason(e.target.value)}
            placeholder="Reason / remarks (optional)"
            className="md:col-span-6 px-3 py-2 border border-slate-300 rounded-lg"
          />
        </form>
        {qaOk && (
          <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            {qaOk}
          </div>
        )}
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">52-week intern load</h2>
          <span className="text-xs text-slate-500">Peak: {maxH}</span>
        </div>
        <div className="mt-3 flex items-end gap-[2px] h-20">
          {history.map((v, i) => (
            <div
              key={i}
              title={`W${i + 1}: ${v}`}
              className={`flex-1 rounded-t ${
                i === currentWeek.idx ? "bg-xcel-600" : "bg-xcel-200/70"
              }`}
              style={{ height: `${(v / maxH) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-400">
          <span>W1</span>
          <span>W{Math.round(totalWeeks / 2)}</span>
          <span>W{totalWeeks}</span>
        </div>
      </section>

      <section className="card">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-xcel-600" />
            <h2 className="font-semibold">Current Roster ({roster.length})</h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="badge bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
              <CheckCircle2 size={11} /> {onDuty.length} on duty
            </span>
            <span className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200">
              <AlertCircle size={11} /> {onLeaveNow.length} on leave
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-3 py-2">Roll No</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Block / Sub-batch</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Leave details</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((a) => {
                const leave = isOnLeave(a.student.regNo, leaves);
                return (
                  <tr key={a.student.regNo} className="border-t border-slate-100 hover:bg-xcel-50/40">
                    <td className="px-3 py-2">
                      <Link className="text-xcel-700 hover:underline font-mono" href={`/admin/student/${a.student.regNo}`}>
                        {a.student.regNo}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-medium">{a.student.name}</td>
                    <td className="px-3 py-2 text-slate-600">
                      Block {a.blockId} · <span className="font-mono">{a.subBatch}</span>
                    </td>
                    <td className="px-3 py-2">
                      {leave ? (
                        <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[leave.type]}`}>
                          <AlertCircle size={11} /> {leave.type}
                        </span>
                      ) : (
                        <span className="badge bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                          <CheckCircle2 size={11} /> On duty
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-xs">
                      {leave ? (
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={11} /> {leave.from} → {leave.to}{" "}
                          {leave.reason && <span className="text-slate-400">· {leave.reason}</span>}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "emerald" | "rose";
}) {
  const map = {
    emerald: "bg-emerald-400/20 ring-emerald-300/30",
    rose: "bg-rose-400/20 ring-rose-300/30",
    default: "bg-white/10 ring-white/20",
  };
  const cls = tone ? map[tone] : map.default;
  return (
    <div className={`rounded-xl ${cls} ring-1 p-3 text-center`}>
      <div className="text-xs uppercase tracking-wider text-white/70">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
