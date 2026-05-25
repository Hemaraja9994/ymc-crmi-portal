"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  PlusCircle,
  Trash2,
  ShieldCheck,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  LeaveRecord,
  LeaveType,
  LEAVE_TYPE_COLORS,
  loadLeaves,
  saveLeaves,
  isOnLeave,
} from "@/lib/leaves";

const TYPES: LeaveType[] = ["Casual", "Medical", "Emergency", "Bereavement", "Academic"];

export default function HodConsole({
  dept,
  roster,
  currentWeek,
  preLaunch,
}: {
  dept: any;
  roster: any[];
  currentWeek: { idx: number; label: string };
  preLaunch: boolean;
}) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [regNo, setRegNo] = useState("");
  const [type, setType] = useState<LeaveType>("Casual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [hod, setHod] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => setLeaves(loadLeaves()), []);

  const myLeaves = leaves.filter((l) =>
    roster.some((s) => s.student.regNo === l.regNo)
  );

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!regNo || !from || !to) return;
    if (!hod.trim()) return;
    const rec: LeaveRecord = {
      id: `hod_${Date.now()}`,
      regNo,
      type,
      from,
      to,
      reason: reason ? `${reason} (Logged by ${hod})` : `Logged by ${hod}`,
      status: "Approved", // HOD has already approved at unit level
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    const next = [...leaves, rec];
    setLeaves(next);
    saveLeaves(next);
    setSuccess(`Recorded leave for ${regNo} — ${type}, ${from} → ${to}.`);
    setRegNo("");
    setFrom("");
    setTo("");
    setReason("");
    setType("Casual");
    setTimeout(() => setSuccess(""), 3500);
  }

  function remove(id: string) {
    const next = leaves.filter((l) => l.id !== id);
    setLeaves(next);
    saveLeaves(next);
  }

  return (
    <div className="space-y-5">
      <Link
        href="/postings-overview"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-xcel-700"
      >
        <ChevronLeft size={14} /> Back to department directory
      </Link>

      {/* Hero */}
      <header className="card overflow-hidden">
        <div className="bg-gradient-to-br from-xcel-600 via-xcel-700 to-xcel-900 text-white p-6 md:p-8 relative">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-xcel-100">
              <Stethoscope size={14} /> HOD / Unit Head Console
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{dept.name}</h1>
            <p className="text-sm text-xcel-100/90 mt-1 max-w-2xl">
              Use this console to log leaves for interns posted to your department. Records are
              instantly visible to the central coordinator dashboard.
            </p>
            <div className="mt-3 text-xs text-xcel-100/80">
              W{currentWeek.idx + 1} · {currentWeek.label}
              {preLaunch && " · Pre-launch (internship begins 01.06.2026)"}
            </div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Leave entry form */}
        <div className="card p-5">
          <h2 className="font-semibold flex items-center gap-2">
            <PlusCircle size={18} className="text-xcel-600" /> Record a leave
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            HODs / unit heads enter leaves here. Each record is auto-marked as Approved at
            unit level; coordinators see the entry and can override.
          </p>
          <form onSubmit={add} className="mt-4 space-y-3 text-sm">
            <label className="block">
              <span className="text-xs text-slate-500">Intern (Roll No)</span>
              <select
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              >
                <option value="">Select intern in {dept.short}…</option>
                {roster.map((a: any) => (
                  <option key={a.student.regNo} value={a.student.regNo}>
                    {a.student.regNo} — {a.student.name} ({a.subBatch})
                  </option>
                ))}
              </select>
              {roster.length === 0 && (
                <div className="text-[11px] text-slate-400 mt-1">
                  No interns currently posted (this week). Records can still be added once
                  postings begin.
                </div>
              )}
            </label>

            <label className="block">
              <span className="text-xs text-slate-500">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as LeaveType)}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-slate-500">From</span>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">To</span>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs text-slate-500">Reason / Remarks</span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="e.g. Viral fever, MC attached. Resumed duty after fitness check."
              />
            </label>

            <label className="block">
              <span className="text-xs text-slate-500">Your name / designation</span>
              <input
                value={hod}
                onChange={(e) => setHod(e.target.value)}
                placeholder="e.g. Dr. R. Kumar, Unit Head — Gen Med Unit 2"
                required
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </label>

            <button className="btn-primary w-full justify-center">
              <PlusCircle size={14} /> Record leave
            </button>
            {success && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1">
                <CheckCircle2 size={14} /> {success}
              </div>
            )}
          </form>
        </div>

        {/* Current dept leave register */}
        <div className="card p-5">
          <h2 className="font-semibold flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" /> Department leave register
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            All leaves recorded against {dept.short} interns.
          </p>
          {myLeaves.length === 0 ? (
            <div className="mt-4 text-sm text-slate-500 italic">No records yet.</div>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {myLeaves.map((l) => {
                const stu = roster.find((s) => s.student.regNo === l.regNo);
                return (
                  <li key={l.id} className="py-2.5 flex items-start justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {stu?.student.name || l.regNo}{" "}
                        <span className="text-xs text-slate-400 font-mono">({l.regNo})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {l.from} → {l.to} · {l.reason}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[l.type]}`}>{l.type}</span>
                      <button
                        onClick={() => remove(l.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        title="Remove (mistake)"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Current roster (for reference) */}
      <div className="card">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold">
            Current roster — {dept.short} ({roster.length} intern{roster.length === 1 ? "" : "s"})
          </h2>
          <p className="text-xs text-slate-500">
            Tap any roll number to view full intern profile.
          </p>
        </div>
        {roster.length === 0 ? (
          <div className="p-6 text-sm text-slate-500 italic">
            No interns in {dept.short} this week.
            {preLaunch && " — postings begin on 01.06.2026."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="text-left px-3 py-2">Roll No</th>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Block / Sub-batch</th>
                  <th className="text-left px-3 py-2">Today</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((a) => {
                  const lv = isOnLeave(a.student.regNo, leaves);
                  return (
                    <tr key={a.student.regNo} className="border-t border-slate-100 hover:bg-xcel-50/40">
                      <td className="px-3 py-2">
                        <Link
                          href={`/student/${a.student.regNo}`}
                          className="text-xcel-700 hover:underline font-mono"
                        >
                          {a.student.regNo}
                        </Link>
                      </td>
                      <td className="px-3 py-2 font-medium">{a.student.name}</td>
                      <td className="px-3 py-2 text-slate-600">
                        Block {a.blockId} · <span className="font-mono">{a.subBatch}</span>
                      </td>
                      <td className="px-3 py-2">
                        {lv ? (
                          <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[lv.type]}`}>
                            <AlertCircle size={11} /> {lv.type}
                          </span>
                        ) : (
                          <span className="badge bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                            <CheckCircle2 size={11} /> On duty
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
