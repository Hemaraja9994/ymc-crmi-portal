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
  LeaveStatus,
  loadLeaves,
  saveLeaves,
} from "@/lib/leaves";

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
  useEffect(() => setLeaves(loadLeaves()), []);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeaveStatus>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const allDepts = blocks.flatMap((b: any) => b.depts);

  function decide(id: string, status: LeaveStatus) {
    const next = leaves.map((l) => (l.id === id ? { ...l, status } : l));
    setLeaves(next);
    saveLeaves(next);
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
          <h1 className="text-2xl font-bold">Leave Requests</h1>
          <p className="text-sm text-slate-500">Approve, reject, or filter by department, type and status.</p>
        </div>
      </header>

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
          <option>Casual</option>
          <option>Medical</option>
          <option>Emergency</option>
          <option>Bereavement</option>
          <option>Academic</option>
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
                    <Link href={`/admin/student/${l.regNo}`} className="font-medium text-xcel-700 hover:underline">
                      {l.name}
                    </Link>
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
