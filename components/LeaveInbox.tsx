"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarRange,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import {
  LeaveRecord,
  LEAVE_TYPE_COLORS,
  LEAVE_TYPE_META,
  LeaveStatus,
  LeaveType,
  loadLeaves,
  saveLeaves,
} from "@/lib/leaves";
import { Plus } from "lucide-react";
import { attendanceFor, ATTENDANCE_THRESHOLD } from "@/lib/attendance";
import { ShieldAlert } from "lucide-react";

export default function LeaveInbox({
  assignments,
  blocks,
  currentWeek,
}: {
  assignments: any[];
  blocks: any[];
  currentWeek: number;
}) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  useEffect(() => {
    let cancelled = false;
    async function refreshLeaves() {
      try {
        const response = await fetch("/api/leave", { cache: "no-store" });
        if (!response.ok) throw new Error("Leave API unavailable");
        const result = await response.json();
        if (!cancelled) setLeaves(result.leaves || []);
      } catch {
        if (!cancelled) setLeaves(loadLeaves());
      }
    }
    void refreshLeaves();
    return () => {
      cancelled = true;
    };
  }, []);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeaveStatus>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [recordOpen, setRecordOpen] = useState(false);

  function recordLeave(input: {
    regNo: string; type: LeaveType; from: string; to: string; reason: string; status: LeaveStatus;
  }) {
    const rec: LeaveRecord = {
      id: `leave_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      regNo: input.regNo,
      type: input.type,
      from: input.from,
      to: input.to,
      reason: input.reason,
      status: input.status,
      submittedAt: new Date().toISOString(),
      recordedBy: "coordinator",
    };
    const next = [rec, ...leaves];
    setLeaves(next);
    saveLeaves(next);
    setRecordOpen(false);
  }

  const allDepts = blocks.flatMap((b: any) => b.depts);

  async function decide(id: string, status: LeaveStatus) {
    const next = leaves.map((l) => (l.id === id ? { ...l, status } : l));
    setLeaves(next);
    try {
      const response = await fetch("/api/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-coordinator-id": "coordinator" },
        body: JSON.stringify({ id, status, actor: "coordinator" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Leave decision failed");
      setLeaves((current) => current.map((leave) => (leave.id === id ? result.leave : leave)));
    } catch {
      setLeaves(next);
      saveLeaves(next);
    }
  }

  const enriched = useMemo(
    () =>
      leaves.map((l) => {
        const a = assignments.find((x) => x.student.regNo === l.regNo);
        const cell = a?.rotation.find((r: any) => r.weekIdx === currentWeek);
        return {
          ...l,
          name: a?.student.name || l.regNo,
          deptCode: cell?.deptCode || "",
          deptShort: cell?.deptShort || "",
          deptColor: cell?.color || "bg-slate-100 text-slate-700",
          blockId: a?.blockId,
        };
      }),
    [leaves, assignments, currentWeek]
  );

  const rows = enriched.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (typeFilter !== "all" && l.type !== typeFilter) return false;
    if (deptFilter !== "all" && l.deptCode !== deptFilter) return false;
    if (q) {
      const s = q.toLowerCase();
      if (!l.name.toLowerCase().includes(s) && !l.regNo.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const counts = {
    pending: leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Leave Records</h1>
          <p className="text-sm text-slate-500">
            Coordinator-managed. Students can no longer self-apply — leaves are recorded here against
            departmental entitlement (CL), Additional Leave (Ad.L, posting extended 1×) or Absent
            (unauthorised, posting extended 2×).
          </p>
        </div>
        <button
          onClick={() => setRecordOpen(true)}
          className="btn-primary"
        >
          <Plus size={14} /> Record Leave
        </button>
      </header>

      {recordOpen && (
        <RecordLeaveForm
          assignments={assignments}
          depts={allDepts}
          onSubmit={recordLeave}
          onClose={() => setRecordOpen(false)}
        />
      )}

      <div className="grid grid-cols-3 gap-3">
        <KPI label="Pending" value={counts.pending} tone="amber" icon={<Clock size={14} />} />
        <KPI label="Approved" value={counts.approved} tone="emerald" icon={<CheckCircle2 size={14} />} />
        <KPI label="Rejected" value={counts.rejected} tone="rose" icon={<XCircle size={14} />} />
      </div>

      <div className="card p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or roll number…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-xcel-500 focus:outline-none"
          />
        </div>
        <Filter size={14} className="text-slate-400" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
          <option value="all">All status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
          <option value="all">All types</option>
          {(Object.keys(LEAVE_TYPE_META) as LeaveType[]).map((t) => (
            <option key={t} value={t}>{LEAVE_TYPE_META[t].short} — {LEAVE_TYPE_META[t].label}</option>
          ))}
        </select>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
          <option value="all">All departments</option>
          {allDepts.map((d: any) => (
            <option key={d.code} value={d.code}>{d.short}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-3 py-2">Intern</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2">From → To</th>
                <th className="text-left px-3 py-2">Dept (this week)</th>
                <th className="text-left px-3 py-2">Reason</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-t border-slate-100 hover:bg-xcel-50/40">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link href={`/admin/student/${l.regNo}`} className="font-medium text-xcel-700 hover:underline">
                        {l.name}
                      </Link>
                      {(() => {
                        const att = attendanceFor(l.regNo, leaves);
                        return !att.preLaunch && att.deficient ? (
                          <span
                            title={`${att.attendancePct}% — below ${ATTENDANCE_THRESHOLD}%`}
                            className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200"
                          >
                            <ShieldAlert size={10} /> {att.attendancePct}%
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{l.regNo} · Block {l.blockId}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[l.type]}`}>{l.type}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{l.from} → {l.to}</td>
                  <td className="px-3 py-2">
                    {l.deptShort && <span className={`dept-chip ${l.deptColor}`}>{l.deptShort}</span>}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{l.reason || "—"}</td>
                  <td className="px-3 py-2"><StatusBadge status={l.status} /></td>
                  <td className="px-3 py-2">
                    {l.status === "Pending" ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => decide(l.id, "Approved")}
                          className="btn bg-emerald-600 text-white hover:bg-emerald-700 px-2 py-1 text-xs"
                        >
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button
                          onClick={() => decide(l.id, "Rejected")}
                          className="btn bg-rose-600 text-white hover:bg-rose-700 px-2 py-1 text-xs"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500">
                    No leave requests match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, tone, icon }: { label: string; value: number; tone: "amber" | "emerald" | "rose"; icon: React.ReactNode }) {
  const map = {
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
    rose: "bg-rose-50 border-rose-200 text-rose-800",
  };
  return (
    <div className={`rounded-2xl border p-4 ${map[tone]}`}>
      <div className="flex items-center gap-1 text-xs uppercase tracking-wide">{icon} {label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  const map = {
    Pending: "bg-amber-100 text-amber-800 ring-amber-200",
    Approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    Rejected: "bg-rose-100 text-rose-800 ring-rose-200",
  } as const;
  const Icon = status === "Approved" ? CheckCircle2 : status === "Rejected" ? AlertCircle : Clock;
  return <span className={`badge ring-1 ${map[status]}`}><Icon size={12} /> {status}</span>;
}

function RecordLeaveForm({
  assignments,
  depts,
  onSubmit,
  onClose,
}: {
  assignments: any[];
  depts: any[];
  onSubmit: (i: { regNo: string; type: LeaveType; from: string; to: string; reason: string; status: LeaveStatus }) => void;
  onClose: () => void;
}) {
  const [regNo, setRegNo] = useState("");
  const [type, setType] = useState<LeaveType>("CL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<LeaveStatus>("Approved");

  const matches = assignments.filter((a) =>
    !regNo || a.student.regNo.toLowerCase().includes(regNo.toLowerCase()) ||
    a.student.name.toLowerCase().includes(regNo.toLowerCase())
  ).slice(0, 8);

  const meta = LEAVE_TYPE_META[type];
  const days = from && to && to >= from
    ? Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000) + 1
    : 0;
  const extension = days * meta.extensionFactor;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!regNo || !from || !to) return;
    onSubmit({ regNo: regNo.trim().toUpperCase(), type, from, to, reason, status });
  }

  return (
    <section className="card overflow-hidden border-accent-200">
      <div className="border-b border-slate-200 bg-accent-50/40 px-5 py-3 flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Record Leave on Intern's Behalf</h2>
        <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
      </div>
      <form onSubmit={submit} className="p-5 grid gap-4 md:grid-cols-3">
        {/* Intern picker */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Intern (Roll No. or Name)</label>
          <input
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            placeholder="21M001 or Devika"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 focus:outline-none"
          />
          {regNo && matches.length > 0 && matches.length < assignments.length && (
            <div className="mt-1 flex flex-wrap gap-1">
              {matches.map((m) => (
                <button
                  key={m.student.regNo}
                  type="button"
                  onClick={() => setRegNo(m.student.regNo)}
                  className="text-xs px-2 py-1 rounded-md bg-slate-100 hover:bg-accent-100 text-slate-700"
                >
                  {m.student.regNo} {m.student.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeaveStatus)}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            {(Object.keys(LEAVE_TYPE_META) as LeaveType[]).map((t) => (
              <option key={t} value={t}>{LEAVE_TYPE_META[t].short} — {LEAVE_TYPE_META[t].label}</option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500 leading-snug">{meta.description}</p>
        </div>

        {/* From */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        {/* To */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        <div className="md:col-span-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reason / Notes</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Sister's wedding · Fever (medical certificate attached)"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        {/* Live calc */}
        {days > 0 && (
          <div className="md:col-span-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm flex flex-wrap items-center justify-between gap-2">
            <div><strong>{days}</strong> day(s) of <strong className="text-accent-700">{meta.short}</strong></div>
            <div className="text-slate-600">
              Posting extension applied:
              {" "}<strong className={extension > 0 ? "text-rose-700" : "text-emerald-700"}>
                {extension === 0 ? "None" : `+${extension} day(s)`}
              </strong>
              {meta.extensionFactor === 2 && <span className="text-rose-700 text-xs"> (2× for unauthorised absence)</span>}
            </div>
          </div>
        )}

        <div className="md:col-span-3 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary" disabled={!regNo || !from || !to}>
            <CheckCircle2 size={14} /> Save Record
          </button>
        </div>
      </form>
    </section>
  );
}
