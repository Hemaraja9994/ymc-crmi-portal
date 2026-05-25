"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Users, Filter, AlertCircle } from "lucide-react";
import { LEAVE_TYPE_COLORS, loadLeaves, isOnLeave, LeaveRecord } from "@/lib/leaves";

export default function BlockDetail({
  block,
  students,
  currentWeek,
}: {
  block: any;
  students: any[];
  currentWeek: { idx: number; label: string };
}) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  useEffect(() => setLeaves(loadLeaves()), []);
  const [subBatch, setSubBatch] = useState<string>("all");
  const [search, setSearch] = useState("");

  const subBatches = useMemo(
    () => Array.from(new Set(students.map((s) => s.subBatch))).sort(),
    [students]
  );

  const filtered = students.filter((s) => {
    if (subBatch !== "all" && s.subBatch !== subBatch) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !s.student.name.toLowerCase().includes(q) &&
        !s.student.regNo.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <header className="card p-5 bg-gradient-to-br from-brand-50 via-white to-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase text-brand-700">{block.title}</div>
            <h1 className="text-2xl font-bold mt-1">
              {students.length} Interns · {block.depts.length} Departments
            </h1>
            <p className="text-sm text-slate-500">
              Week W{currentWeek.idx + 1} · {currentWeek.label}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {block.depts.map((d: any) => (
              <span key={d.code} className={`dept-chip ${d.color}`}>
                {d.short} · {d.weeks}w
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="card">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-brand-600" />
            <h2 className="font-semibold">Interns ({filtered.length})</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / reg no"
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
            />
            <div className="flex items-center gap-1 text-sm">
              <Filter size={14} className="text-slate-400" />
              <select
                value={subBatch}
                onChange={(e) => setSubBatch(e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-1.5"
              >
                <option value="all">All sub-batches</option>
                {subBatches.map((sb) => (
                  <option key={sb} value={sb}>{sb}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-3 py-2">Roll No</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Sub-batch</th>
                <th className="text-left px-3 py-2">Current Posting</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const cell = a.rotation.find((r: any) => r.weekIdx === currentWeek.idx);
                const leave = isOnLeave(a.student.regNo, leaves);
                return (
                  <tr key={a.student.regNo} className="border-t border-slate-100 hover:bg-brand-50/40">
                    <td className="px-3 py-2">
                      <Link className="text-brand-700 hover:underline font-mono" href={`/admin/student/${a.student.regNo}`}>
                        {a.student.regNo}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-medium">{a.student.name}</td>
                    <td className="px-3 py-2 font-mono text-slate-600">{a.subBatch}</td>
                    <td className="px-3 py-2">
                      {cell && <span className={`dept-chip ${cell.color}`}>{cell.deptShort}</span>}{" "}
                      <span className="text-slate-600">{cell?.deptName}</span>
                    </td>
                    <td className="px-3 py-2">
                      {leave ? (
                        <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[leave.type]}`}>
                          <AlertCircle size={11} /> {leave.type} leave
                        </span>
                      ) : (
                        <span className="badge bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                          On duty
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
