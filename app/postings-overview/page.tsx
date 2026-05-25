import Link from "next/link";
import { BLOCKS } from "@/lib/rotation";
import { ArrowUpRight, CalendarRange } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl overflow-hidden brand-panel text-white p-6 md:p-10 relative">
        <div className="geo-overlay absolute inset-0 opacity-60" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-xcel-100">
            <CalendarRange size={14} /> Department · Year View
          </div>
          <h1 className="mt-2 text-2xl md:text-4xl font-bold tracking-tight">
            Postings across the academic year
          </h1>
          <p className="mt-2 text-xcel-100/90 max-w-2xl text-sm md:text-base">
            Click any department to see exactly which sub-batches and interns are posted there
            in each of the 52 weeks. Visible to students, coordinators, HODs and unit heads.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {BLOCKS.flatMap((b) =>
          b.depts.map((d) => (
            <Link
              key={d.code}
              href={`/postings-overview/${d.code}`}
              className="card p-4 hover:shadow-lg hover:border-xcel-400 transition relative group"
            >
              <div className="flex items-center justify-between">
                <span className={`dept-chip ${d.color}`}>{d.short}</span>
                <span className="text-[10px] text-slate-400">Block {b.id}</span>
              </div>
              <div className="mt-2 font-semibold leading-tight">{d.name}</div>
              <div className="text-[11px] text-slate-500 mt-1">{d.weeks} week posting · NMC mandated</div>
              <div className="mt-3 text-xs text-xcel-600 inline-flex items-center gap-1 opacity-70 group-hover:opacity-100">
                Open year view <ArrowUpRight size={12} />
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
