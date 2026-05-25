"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarRange,
  Search,
  Download,
  ChevronLeft,
  Users,
  Sparkles,
} from "lucide-react";

type WeekRow = {
  idx: number;
  start: string;
  end: string;
  label: string;
  students: { regNo: string; name: string; blockId: number; subBatch: string }[];
  subBatches: string[];
};

export default function DeptYearView({
  dept,
  weeks,
  currentWeek,
}: {
  dept: any;
  weeks: WeekRow[];
  currentWeek: number;
}) {
  const [q, setQ] = useState("");
  const [showCompact, setShowCompact] = useState(true);

  const filtered = useMemo(() => {
    if (!q) return weeks;
    const s = q.toLowerCase();
    return weeks.filter((w) =>
      w.students.some(
        (st) =>
          st.regNo.toLowerCase().includes(s) ||
          st.name.toLowerCase().includes(s) ||
          st.subBatch.toLowerCase().includes(s)
      )
    );
  }, [weeks, q]);

  const totalUnique = useMemo(() => {
    const set = new Set<string>();
    weeks.forEach((w) => w.students.forEach((s) => set.add(s.regNo)));
    return set.size;
  }, [weeks]);

  function exportCsv() {
    const lines = ["Week,Dates,SubBatch,RollNo,Name,Block"];
    weeks.forEach((w) => {
      w.students.forEach((s) => {
        lines.push(
          [
            `W${w.idx + 1}`,
            `"${w.label}"`,
            s.subBatch,
            s.regNo,
            `"${s.name}"`,
            s.blockId,
          ].join(",")
        );
      });
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dept.code}_year_postings.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <Link
        href="/postings-overview"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-xcel-700"
      >
        <ChevronLeft size={14} /> Back to all departments
      </Link>

      {/* Hero */}
      <header className="card overflow-hidden">
        <div className="bg-gradient-to-br from-xcel-600 via-xcel-700 to-xcel-900 text-white p-6 md:p-8 relative">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-xcel-100">
                <Sparkles size={14} /> Department · Year View
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">{dept.name}</h1>
              <div className="text-sm text-xcel-100/80 mt-1">
                {dept.weeks}-week NMC posting · {totalUnique} unique interns rotate through across the year
              </div>
            </div>
            <button
              onClick={exportCsv}
              className="btn bg-white/15 hover:bg-white/25 text-white text-sm"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="card p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a name, roll number or sub-batch (e.g. A3)…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-xcel-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowCompact(!showCompact)}
          className="btn-outline text-sm"
        >
          {showCompact ? "Show full names" : "Compact view"}
        </button>
      </div>

      {/* Year grid — one row per posting window */}
      <div className="card">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <CalendarRange className="text-xcel-600" size={16} />
          <h2 className="font-semibold">52-week schedule</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((w) => {
            const empty = w.students.length === 0;
            const isNow = w.idx === currentWeek;
            return (
              <div
                key={w.idx}
                className={`px-4 py-3 ${
                  isNow ? "bg-xcel-50" : empty ? "bg-slate-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 shrink-0">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      Week
                    </div>
                    <div className="font-bold text-lg">{w.idx + 1}</div>
                    {isNow && (
                      <span className="text-[10px] text-xcel-700 font-semibold uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="w-44 shrink-0 hidden sm:block">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      Window
                    </div>
                    <div className="text-sm font-mono text-slate-600">{w.label}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      Interns posted ({w.students.length})
                      {w.subBatches.length > 0 && (
                        <span className="ml-2 text-slate-500 normal-case font-medium">
                          Sub-batches: {w.subBatches.join(", ")}
                        </span>
                      )}
                    </div>
                    {empty ? (
                      <div className="text-sm text-slate-400 italic mt-0.5">
                        No interns assigned this week.
                      </div>
                    ) : showCompact ? (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {w.students.map((s) => (
                          <Link
                            key={s.regNo}
                            href={`/student/${s.regNo}`}
                            className="text-xs font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-xcel-400 hover:text-xcel-700"
                            title={`${s.name} · Block ${s.blockId} · ${s.subBatch}`}
                          >
                            {s.regNo}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <ul className="mt-1.5 grid sm:grid-cols-2 md:grid-cols-3 gap-1.5 text-sm">
                        {w.students.map((s) => (
                          <li
                            key={s.regNo}
                            className="flex items-center justify-between gap-2 px-2 py-1 rounded-md bg-white border border-slate-200"
                          >
                            <div className="min-w-0">
                              <Link
                                href={`/student/${s.regNo}`}
                                className="font-medium text-sm hover:text-xcel-700 truncate block"
                              >
                                {s.name}
                              </Link>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {s.regNo} · {s.subBatch}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              B{s.blockId}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-500">
              No matches for "{q}".
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold flex items-center gap-2">
          <Users size={16} className="text-xcel-600" /> Need to log a leave for an intern in {dept.short}?
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          HODs and unit heads can record dept-scoped leaves directly without
          coordinator access.
        </p>
        <Link
          href={`/hod/${dept.code}`}
          className="btn-primary mt-3"
        >
          Open HOD / Unit Head console →
        </Link>
      </div>
    </div>
  );
}
