"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Users, MapPin, Stethoscope, Search } from "lucide-react";

// Per-CRMI-committee feedback (Mar 2026): department-wise drill-down with
// daily/weekly/monthly granularity, mobile-first horizontal layout, accessible
// to both Principal/HODs and students.
//
// Layout:
//   Top   : date scrubber + granularity toggle (Day / Week / Month)
//   Middle: horizontally-scrollable strip of department chips (count badge)
//   Below : selected department's intern roster for the picked window

type Assignment = {
  student: { regNo: string; name: string };
  blockId: number;
  subBatch: string;
  rotation: Array<{ weekIdx: number; deptCode: string; deptName: string; deptShort: string; color: string }>;
};

type Dept = { code: string; name: string; short: string; color: string; weeks: number };
type Block = { id: number; depts: Dept[] };

export default function DailyPostingsView({
  assignments,
  blocks,
  startDateISO,
  initialDate,
  initialDeptCode,
  readOnly = false,
}: {
  assignments: Assignment[];
  blocks: Block[];
  startDateISO: string;         // internship start date ISO (yyyy-mm-dd)
  initialDate?: string;         // ISO date to focus on (defaults to today or start)
  initialDeptCode?: string;
  readOnly?: boolean;            // when true (student view), hide jump-to-admin links
}) {
  const startDate = new Date(startDateISO);
  const today = new Date();
  const defaultFocus = initialDate
    ? new Date(initialDate)
    : (today.getTime() < startDate.getTime() ? startDate : today);

  const [focus, setFocus] = useState<Date>(defaultFocus);
  const [granularity, setGranularity] = useState<"day" | "week" | "month">("day");

  const allDepts = useMemo(() => blocks.flatMap((b) => b.depts), [blocks]);
  const [deptCode, setDeptCode] = useState<string>(initialDeptCode || allDepts[0]?.code || "");
  const [search, setSearch] = useState("");

  // Compute the week index that contains the focus date.
  const focusWeekIdx = useMemo(() => {
    const ms = focus.getTime() - startDate.getTime();
    return Math.max(0, Math.min(51, Math.floor(ms / (1000 * 60 * 60 * 24 * 7))));
  }, [focus, startDate]);

  // Compute the inclusive [from, to] window for the chosen granularity.
  const { fromDate, toDate, label } = useMemo(() => {
    if (granularity === "day") {
      return {
        fromDate: focus,
        toDate: focus,
        label: focus.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }),
      };
    }
    if (granularity === "week") {
      const start = new Date(startDate.getTime() + focusWeekIdx * 7 * 86_400_000);
      const end = new Date(start.getTime() + 6 * 86_400_000);
      return {
        fromDate: start,
        toDate: end,
        label: `Week ${focusWeekIdx + 1} · ${start.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – ${end.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
      };
    }
    // Month
    const start = new Date(focus.getFullYear(), focus.getMonth(), 1);
    const end = new Date(focus.getFullYear(), focus.getMonth() + 1, 0);
    return {
      fromDate: start,
      toDate: end,
      label: focus.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    };
  }, [granularity, focus, focusWeekIdx, startDate]);

  // Compute the week indices that overlap the chosen window.
  const windowWeekIdxs = useMemo(() => {
    const idxs: number[] = [];
    for (let w = 0; w < 52; w++) {
      const wStart = new Date(startDate.getTime() + w * 7 * 86_400_000);
      const wEnd = new Date(wStart.getTime() + 6 * 86_400_000);
      if (wEnd >= fromDate && wStart <= toDate) idxs.push(w);
    }
    return idxs;
  }, [fromDate, toDate, startDate]);

  // For each dept, count unique interns posted across the window.
  const deptCounts = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const d of allDepts) m.set(d.code, new Set<string>());
    for (const a of assignments) {
      for (const w of windowWeekIdxs) {
        const cell = a.rotation.find((r) => r.weekIdx === w);
        if (cell) m.get(cell.deptCode)?.add(a.student.regNo);
      }
    }
    const out: Record<string, number> = {};
    for (const [k, v] of m) out[k] = v.size;
    return out;
  }, [assignments, windowWeekIdxs, allDepts]);

  // Interns posted in the selected dept across the window (with sub-batch + week).
  const selectedDept = allDepts.find((d) => d.code === deptCode);
  const postedInSelected = useMemo(() => {
    if (!selectedDept) return [];
    const rows: Array<{ regNo: string; name: string; subBatch: string; blockId: number; weeks: number[] }> = [];
    for (const a of assignments) {
      const weeksPosted: number[] = [];
      for (const w of windowWeekIdxs) {
        const cell = a.rotation.find((r) => r.weekIdx === w);
        if (cell && cell.deptCode === selectedDept.code) weeksPosted.push(w);
      }
      if (weeksPosted.length > 0) {
        rows.push({
          regNo: a.student.regNo,
          name: a.student.name,
          subBatch: a.subBatch,
          blockId: a.blockId,
          weeks: weeksPosted,
        });
      }
    }
    return rows.sort((a, b) => a.subBatch.localeCompare(b.subBatch) || a.regNo.localeCompare(b.regNo));
  }, [selectedDept, assignments, windowWeekIdxs]);

  const filteredPosted = postedInSelected.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return r.name.toLowerCase().includes(s) || r.regNo.toLowerCase().includes(s) || r.subBatch.toLowerCase().includes(s);
  });

  // Step helpers
  function shift(direction: -1 | 1) {
    const newDate = new Date(focus);
    if (granularity === "day") newDate.setDate(newDate.getDate() + direction);
    else if (granularity === "week") newDate.setDate(newDate.getDate() + direction * 7);
    else newDate.setMonth(newDate.getMonth() + direction);
    setFocus(newDate);
  }

  // Scroll selected dept chip into view when it changes
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-dept="${deptCode}"]`) as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [deptCode]);

  return (
    <div className="space-y-4">
      {/* ── Date scrubber + granularity toggle ── */}
      <section className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <CalendarDays size={16} className="text-accent-600 shrink-0" />
            <button onClick={() => shift(-1)} className="p-1.5 rounded-md hover:bg-slate-100" aria-label="Previous">
              <ChevronLeft size={16} />
            </button>
            <input
              type="date"
              value={focus.toISOString().slice(0, 10)}
              onChange={(e) => setFocus(new Date(e.target.value))}
              min={startDateISO}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
            />
            <button onClick={() => shift(1)} className="p-1.5 rounded-md hover:bg-slate-100" aria-label="Next">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-sm">
            {(["day", "week", "month"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-3 py-2 capitalize transition ${granularity === g ? "bg-xcel-700 text-white" : "bg-white text-slate-700 hover:bg-slate-50"}`}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFocus(today.getTime() < startDate.getTime() ? startDate : today)}
            className="btn-outline text-xs"
          >
            Today
          </button>
        </div>
        <div className="mt-2 text-[13px] text-slate-600">{label}</div>
      </section>

      {/* ── Horizontal department strip ── */}
      <section>
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">
          Departments · {Object.values(deptCounts).reduce((a, b) => a + b, 0)} student-postings in window
        </div>
        <div
          ref={stripRef}
          className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {allDepts.map((d) => {
            const count = deptCounts[d.code] || 0;
            const isSelected = d.code === deptCode;
            return (
              <button
                key={d.code}
                data-dept={d.code}
                onClick={() => setDeptCode(d.code)}
                className={`snap-start shrink-0 rounded-xl border px-3 py-2.5 text-left transition min-w-[140px] ${
                  isSelected
                    ? "border-accent-600 bg-accent-50 ring-2 ring-accent-200"
                    : "border-slate-200 bg-white hover:border-xcel-300 hover:bg-xcel-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`dept-chip ${d.color}`}>{d.short}</span>
                  <span className={`text-[11px] font-bold ${count > 0 ? "text-accent-700" : "text-slate-400"}`}>
                    {count}
                  </span>
                </div>
                <div className="mt-1 text-[12px] font-semibold text-slate-900 truncate">{d.name}</div>
                <div className="text-[10px] text-slate-400">{d.weeks}w posting</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Selected dept roster ── */}
      <section className="card overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/60 p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Stethoscope size={18} className="text-accent-600 shrink-0" />
            <div className="min-w-0">
              <h2 className="font-bold text-slate-900 truncate">{selectedDept?.name || "Select a department"}</h2>
              <p className="text-[11px] text-slate-500">
                {filteredPosted.length} intern{filteredPosted.length !== 1 ? "s" : ""} posted in window
                {selectedDept?.code === "COM" && <span className="ml-1 text-amber-700">· may be at PHC / outreach</span>}
              </p>
            </div>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / roll"
              className="pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-md w-44"
            />
          </div>
        </div>

        {filteredPosted.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No interns posted in {selectedDept?.short || "this department"} during the selected {granularity}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
            {filteredPosted.map((r) => (
              <div key={r.regNo} className="px-4 py-2.5 hover:bg-xcel-50/40 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {readOnly ? (
                      <span className="font-mono text-xs text-slate-500">{r.regNo}</span>
                    ) : (
                      <Link href={`/admin/student/${r.regNo}`} className="font-mono text-xs text-xcel-700 hover:underline">
                        {r.regNo}
                      </Link>
                    )}
                    <span className="font-medium text-sm text-slate-900 truncate">{r.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Block {r.blockId} · Sub-batch <strong>{r.subBatch}</strong>
                    {granularity !== "day" && r.weeks.length > 1 && (
                      <span className="ml-1">· {r.weeks.length} week{r.weeks.length > 1 ? "s" : ""} this window</span>
                    )}
                  </div>
                </div>
                <span className="badge bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 shrink-0">
                  <Users size={10} /> On posting
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PHC outreach note for Community Medicine */}
      {selectedDept?.code === "COM" && (
        <section className="card border-amber-200 bg-amber-50/40 p-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-amber-700 mt-0.5 shrink-0" />
            <div>
              <strong className="text-amber-900">Community Medicine — outreach deputation:</strong>
              <div className="text-amber-800 text-xs mt-1">
                During Community Medicine postings, interns are deputed to Primary Health Centres (PHCs)
                and outreach health centres on a rotational basis. The PHC roster is maintained by the
                Community Medicine HOD's office — please confirm sub-batch deputation with the
                department's posting coordinator.
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
