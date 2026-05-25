"use client";
import { useMemo, useState } from "react";
import {
  Users,
  Activity,
  ClipboardCheck,
  Search,
  Filter,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboard({
  assignments,
  dist,
  blocks,
  admins,
  currentWeek,
}: {
  assignments: any[];
  dist: Record<string, number>;
  blocks: any[];
  admins: any[];
  currentWeek: { idx: number; label: string };
}) {
  const [search, setSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      if (blockFilter !== "all" && a.blockId !== blockFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!a.student.name.toLowerCase().includes(s) && !a.student.regNo.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [assignments, search, blockFilter]);

  const totals = {
    interns: assignments.length,
    deptsActive: Object.keys(dist).length,
    pendingLeaves: 0,
    attendance: 96.4,
  };

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Coordinator Dashboard</div>
            <h1 className="text-xl md:text-2xl font-bold">CRMI Oversight — MBBS 2021 CBME</h1>
            <p className="text-sm text-slate-600">
              Current week: <strong>W{currentWeek.idx + 1}</strong> · {currentWeek.label}
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-600" /> Logged in as Coordinator (demo)
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI icon={<Users />} label="Total Interns" value={totals.interns} />
        <KPI icon={<Building2 />} label="Active Depts" value={totals.deptsActive} />
        <KPI icon={<ClipboardCheck />} label="Pending Leaves" value={totals.pendingLeaves} />
        <KPI icon={<Activity />} label="Avg Attendance" value={`${totals.attendance}%`} />
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">Live Department Distribution — Week {currentWeek.idx + 1}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {blocks.flatMap((b: any) =>
            b.depts.map((d: any) => {
              const count = dist[d.code] || 0;
              return (
                <div key={d.code} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className={`dept-chip ${d.color}`}>{d.short}</span>
                    <span className="text-sm text-slate-500">B{b.id}</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{count}</div>
                  <div className="text-xs text-slate-500">{d.name}</div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="card">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Intern Roster ({filtered.length})</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name / reg no"
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Filter size={14} className="text-slate-400" />
              <select
                value={blockFilter}
                onChange={(e) =>
                  setBlockFilter(e.target.value === "all" ? "all" : Number(e.target.value))
                }
                className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm"
              >
                <option value="all">All blocks</option>
                {blocks.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-3 py-2">#</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Reg No.</th>
                <th className="text-left px-3 py-2">Block</th>
                <th className="text-left px-3 py-2">Sub-batch</th>
                <th className="text-left px-3 py-2">Current Posting</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const cell = a.rotation.find((r: any) => r.weekIdx === currentWeek.idx);
                return (
                  <tr key={a.student.regNo} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-400">{a.student.slNo}</td>
                    <td className="px-3 py-2 font-medium">{a.student.name}</td>
                    <td className="px-3 py-2 text-slate-600">{a.student.regNo}</td>
                    <td className="px-3 py-2">{a.blockId}</td>
                    <td className="px-3 py-2 font-mono">{a.subBatch}</td>
                    <td className="px-3 py-2">
                      {cell && (
                        <span className={`dept-chip ${cell.color}`}>{cell.deptShort}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">Coordinators</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {admins.map((a) => (
            <li key={a.name} className="border border-slate-200 rounded-xl p-3">
              <div className="font-medium">{a.name}</div>
              <div className="text-xs text-slate-500">{a.role}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function KPI({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-slate-500 text-xs">
        <span className="text-brand-600">{icon}</span> {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
