"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { LeaveRecord, LEAVE_TYPE_COLORS, loadLeaves, isOnLeave } from "@/lib/leaves";
import { isPreLaunch } from "@/lib/rotation";
import { attendanceFor, ATTENDANCE_THRESHOLD } from "@/lib/attendance";
import { ShieldAlert } from "lucide-react";

export default function Roster({
  assignments,
  blocks,
  currentWeek,
}: {
  assignments: any[];
  blocks: any[];
  currentWeek: { idx: number; label: string };
}) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  useEffect(() => setLeaves(loadLeaves()), []);
  const [q, setQ] = useState("");
  const [block, setBlock] = useState<string>("all");
  const [dept, setDept] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const allDepts = blocks.flatMap((b: any) => b.depts);

  const rows = useMemo(() => {
    return assignments.filter((a) => {
      if (block !== "all" && String(a.blockId) !== block) return false;
      const cell = a.rotation.find((r: any) => r.weekIdx === currentWeek.idx);
      if (dept !== "all" && cell?.deptCode !== dept) return false;
      const onLeave = isOnLeave(a.student.regNo, leaves);
      if (status === "leave" && !onLeave) return false;
      if (status === "duty" && onLeave) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!a.student.name.toLowerCase().includes(s) && !a.student.regNo.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [assignments, leaves, q, block, dept, status, currentWeek.idx]);

  function exportCsv() {
    const header = "RollNo,Name,Block,SubBatch,CurrentDept,Status,LeaveType,LeaveFrom,LeaveTo";
    const lines = rows.map((a) => {
      const cell = a.rotation.find((r: any) => r.weekIdx === currentWeek.idx);
      const lv = isOnLeave(a.student.regNo, leaves);
      return [
        a.student.regNo,
        `"${a.student.name}"`,
        a.blockId,
        a.subBatch,
        cell?.deptShort || "",
        lv ? "On Leave" : "On Duty",
        lv?.type || "",
        lv?.from || "",
        lv?.to || "",
      ].join(",");
    });
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ymc_roster.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Intern Roster</h1>
          <p className="text-sm text-slate-500">
            {rows.length} of {assignments.length} interns · W{currentWeek.idx + 1} · {currentWeek.label}
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="btn bg-xcel-600 text-white hover:bg-xcel-700 shadow-card"
        >
          <Download size={14} /> Export CSV
        </button>
      </header>

      <div className="card p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or roll number…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-xcel-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Filter size={14} className="text-slate-400" />
          <select value={block} onChange={(e) => setBlock(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
            <option value="all">All blocks</option>
            {blocks.map((b: any) => (
              <option key={b.id} value={b.id}>Block {b.id}</option>
            ))}
          </select>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
            <option value="all">All departments</option>
            {allDepts.map((d: any) => (
              <option key={d.code} value={d.code}>{d.short}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
            <option value="all">All status</option>
            <option value="duty">On duty</option>
            <option value="leave">On leave</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-3 py-2">Roll No</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Block</th>
                <th className="text-left px-3 py-2">Sub-batch</th>
                <th className="text-left px-3 py-2">Current Posting</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const cell = a.rotation.find((r: any) => r.weekIdx === currentWeek.idx);
                const pre = isPreLaunch();
                const lv = pre ? undefined : isOnLeave(a.student.regNo, leaves);
                return (
                  <tr key={a.student.regNo} className="border-t border-slate-100 hover:bg-xcel-50/40">
                    <td className="px-3 py-2 font-mono">
                      <Link className="text-xcel-700 hover:underline" href={`/admin/student/${a.student.regNo}`}>
                        {a.student.regNo}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-medium">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{a.student.name}</span>
                        {!pre && (() => {
                          const att = attendanceFor(a.student.regNo, leaves);
                          return att.deficient ? (
                            <span
                              title={`${att.attendancePct}% — below ${ATTENDANCE_THRESHOLD}% NMC threshold`}
                              className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200"
                            >
                              <ShieldAlert size={10} /> {att.attendancePct}%
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </td>
                    <td className="px-3 py-2">{a.blockId}</td>
                    <td className="px-3 py-2 font-mono text-slate-600">{a.subBatch}</td>
                    <td className="px-3 py-2">
                      {pre
                        ? <span className="text-xs text-slate-400">— pending start —</span>
                        : cell && <span className={`dept-chip ${cell.color}`}>{cell.deptShort}</span>}
                    </td>
                    <td className="px-3 py-2">
                      {pre ? (
                        <span className="badge bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                          Awaiting start
                        </span>
                      ) : lv ? (
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
      </div>
    </div>
  );
}
