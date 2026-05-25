import Link from "next/link";
import { BLOCKS, buildAssignments } from "@/lib/rotation";
import { ArrowUpRight } from "lucide-react";

export default function BlocksPage() {
  const all = buildAssignments();
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold">Block-wise View</h1>
        <p className="text-sm text-slate-500">
          Open any block to see assigned interns, current postings and leave status.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {BLOCKS.map((b) => {
          const inBlock = all.filter((a) => a.blockId === b.id);
          return (
            <Link
              key={b.id}
              href={`/admin/blocks/${b.id}`}
              className="card p-5 hover:shadow-lg transition group relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-brand-50 group-hover:bg-brand-100 transition" />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase text-slate-500">{b.title}</div>
                  <div className="text-3xl font-bold mt-1">{inBlock.length}</div>
                  <div className="text-xs text-slate-500">interns</div>
                </div>
                <ArrowUpRight className="text-brand-600 opacity-60 group-hover:opacity-100" />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {b.depts.map((d) => (
                  <span key={d.code} className={`dept-chip ${d.color}`}>
                    {d.short} · {d.weeks}w
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
