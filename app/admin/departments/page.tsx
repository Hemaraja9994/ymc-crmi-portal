import Link from "next/link";
import { BLOCKS, currentWeekIndex, departmentDistribution } from "@/lib/rotation";
import { ArrowUpRight } from "lucide-react";

export default function DeptsPage() {
  const wk = currentWeekIndex();
  const dist = departmentDistribution(wk);
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold">Department-wise View</h1>
        <p className="text-sm text-slate-500">Click any department to view its current intern roster and leave status.</p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {BLOCKS.flatMap((b) =>
          b.depts.map((d) => (
            <Link
              key={d.code}
              href={`/admin/departments/${d.code}`}
              className="card p-4 hover:shadow-md hover:border-brand-400 transition relative group"
            >
              <div className="flex items-center justify-between">
                <span className={`dept-chip ${d.color}`}>{d.short}</span>
                <span className="text-[10px] text-slate-400">Block {b.id}</span>
              </div>
              <div className="mt-2 text-3xl font-bold">{dist[d.code] || 0}</div>
              <div className="text-[11px] text-slate-500 truncate">{d.name}</div>
              <div className="mt-2 text-xs text-brand-600 flex items-center gap-1 opacity-60 group-hover:opacity-100">
                Open <ArrowUpRight size={12} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
