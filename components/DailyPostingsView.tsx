"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays, ChevronLeft, ChevronRight,
  Users, MapPin, Stethoscope, Search, LayoutGrid, CalendarRange,
} from "lucide-react";

type Assignment = {
  student: { regNo: string; name: string };
  blockId: number;
  subBatch: string;
  rotation: Array<{ weekIdx: number; deptCode: string; deptName: string; deptShort: string; color: string }>;
};

type Dept = { code: string; name: string; short: string; color: string; weeks: number };
type Block = { id: number; depts: Dept[] };

// Week boundaries anchored entirely in UTC-millisecond arithmetic so timezone
// doesn't skew comparisons between server-built assignments and client view.
function msFloor(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

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
  startDateISO: string;
  initialDate?: string;
  initialDeptCode?: string;
  readOnly?: boolean;
}) {
  // Use local-midnight dates throughout so IST/UTC offset never shifts "today".
  const parseLocal = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const startDate  = parseLocal(startDateISO);
  const todayLocal = new Date();
  todayLocal.setHours(0, 0, 0, 0);

  const defaultFocus = initialDate
    ? parseLocal(initialDate)
    : todayLocal < startDate ? startDate : todayLocal;

  const [focus, setFocus]           = useState<Date>(defaultFocus);
  const [granularity, setGranularity] = useState<"day" | "week" | "month">("day");

  const allDepts = useMemo(() => blocks.flatMap((b) => b.depts), [blocks]);
  const [deptCode, setDeptCode]     = useState<string>(initialDeptCode || allDepts[0]?.code || "");
  const [search, setSearch]         = useState("");

  // Compute which CRMI week index the focus date falls in (0-based).
  const focusWeekIdx = useMemo(() => {
    const diffMs = msFloor(focus) - msFloor(startDate);
    return Math.max(0, Math.min(51, Math.floor(diffMs / (7 * 86_400_000))));
  }, [focus, startDate]);

  // Compute the [fromDate, toDate] window for the selected granularity.
  const { fromDate, toDate, label, weekLabel } = useMemo(() => {
    if (granularity === "day") {
      return {
        fromDate: focus,
        toDate: focus,
        label: focus.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }),
        weekLabel: `CRMI Week ${focusWeekIdx + 1}`,
      };
    }
    if (granularity === "week") {
      const wStart = new Date(startDate.getTime() + focusWeekIdx * 7 * 86_400_000);
      const wEnd   = new Date(wStart.getTime() + 6 * 86_400_000);
      return {
        fromDate: wStart,
        toDate: wEnd,
        label: `Week ${focusWeekIdx + 1}  ·  ${wStart.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – ${wEnd.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
        weekLabel: `CRMI Week ${focusWeekIdx + 1}`,
      };
    }
    // Month
    const mStart = new Date(focus.getFullYear(), focus.getMonth(), 1);
    const mEnd   = new Date(focus.getFullYear(), focus.getMonth() + 1, 0);
    return {
      fromDate: mStart,
      toDate: mEnd,
      label: focus.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      weekLabel: "",
    };
  }, [granularity, focus, focusWeekIdx, startDate]);

  // All CRMI week indices overlapping [fromDate, toDate].
  const windowWeekIdxs = useMemo(() => {
    const idxs: number[] = [];
    for (let w = 0; w < 52; w++) {
      const wStart = new Date(startDate.getTime() + w * 7 * 86_400_000);
      const wEnd   = new Date(wStart.getTime() + 6 * 86_400_000);
      if (wEnd >= fromDate && wStart <= toDate) idxs.push(w);
    }
    return idxs;
  }, [fromDate, toDate, startDate]);

  // Dept → unique-intern count across the window.
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

  const selectedDept = allDepts.find((d) => d.code === deptCode);

  // For each intern in the selected dept, collect which window-weeks they appear.
  type InternRow = { regNo: string; name: string; subBatch: string; blockId: number; weekIdxs: number[] };
  const postedInSelected = useMemo((): InternRow[] => {
    if (!selectedDept) return [];
    const rows: InternRow[] = [];
    for (const a of assignments) {
      const weeksPosted = windowWeekIdxs.filter((w) =>
        a.rotation.some((r) => r.weekIdx === w && r.deptCode === selectedDept.code)
      );
      if (weeksPosted.length > 0) {
        rows.push({ regNo: a.student.regNo, name: a.student.name, subBatch: a.subBatch, blockId: a.blockId, weekIdxs: weeksPosted });
      }
    }
    return rows.sort((a, b) => a.subBatch.localeCompare(b.subBatch) || a.regNo.localeCompare(b.regNo));
  }, [selectedDept, assignments, windowWeekIdxs]);

  const filteredPosted = postedInSelected.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return r.name.toLowerCase().includes(s) || r.regNo.toLowerCase().includes(s) || r.subBatch.toLowerCase().includes(s);
  });

  // Group by sub-batch for Month view.
  const grouped = useMemo(() => {
    const g = new Map<string, InternRow[]>();
    for (const r of filteredPosted) {
      if (!g.has(r.subBatch)) g.set(r.subBatch, []);
      g.get(r.subBatch)!.push(r);
    }
    return Array.from(g.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredPosted]);

  function shift(direction: -1 | 1) {
    const d = new Date(focus);
    if (granularity === "day")   d.setDate(d.getDate() + direction);
    else if (granularity === "week") d.setDate(d.getDate() + direction * 7);
    else d.setMonth(d.getMonth() + direction);
    setFocus(d);
  }

  // Scroll selected chip into view.
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-dept="${deptCode}"]`) as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [deptCode]);

  // Week number label within the window (for multi-week month view).
  const weekLabel2 = (w: number) => {
    const d = new Date(startDate.getTime() + w * 7 * 86_400_000);
    return `Wk ${w + 1} · ${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`;
  };

  const totalInWindow = Object.values(deptCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">

      {/* ── Date scrubber + granularity ── */}
      <section className="card p-4">
        {/* Row 1: date navigation */}
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-accent-600 shrink-0" />
          <button
            onClick={() => shift(-1)}
            style={{ touchAction: "manipulation" }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <input
            type="date"
            value={focus.toISOString().slice(0, 10)}
            onChange={(e) => { if (e.target.value) setFocus(parseLocal(e.target.value)); }}
            min={startDateISO}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
            style={{ touchAction: "manipulation" }}
          />
          <button
            onClick={() => shift(1)}
            style={{ touchAction: "manipulation" }}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-200"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => { const d = todayLocal < startDate ? startDate : todayLocal; setFocus(new Date(d)); }}
            style={{ touchAction: "manipulation" }}
            className="hidden sm:flex h-10 items-center px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200"
          >
            Today
          </button>
        </div>

        {/* Row 2: label + granularity tabs */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-slate-800">{label}</div>
            {weekLabel && <div className="text-xs text-slate-500">{weekLabel}</div>}
          </div>

          {/* Granularity toggle — explicit height + touch-action so Android registers taps */}
          <div
            className="inline-flex rounded-xl overflow-hidden border border-slate-200 text-sm font-medium"
            style={{ touchAction: "manipulation" }}
          >
            {([
              { g: "day",   Icon: CalendarDays,  label: "Day"   },
              { g: "week",  Icon: CalendarRange,  label: "Week"  },
              { g: "month", Icon: LayoutGrid,     label: "Month" },
            ] as const).map(({ g, Icon, label: lbl }) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                style={{ touchAction: "manipulation" }}
                className={`flex h-10 items-center gap-1.5 px-4 transition-colors ${
                  granularity === g
                    ? "bg-xcel-700 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                }`}
              >
                <Icon size={13} />
                {lbl}
              </button>
            ))}
          </div>

          <button
            onClick={() => { const d = todayLocal < startDate ? startDate : todayLocal; setFocus(new Date(d)); }}
            style={{ touchAction: "manipulation" }}
            className="flex sm:hidden h-10 items-center px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 active:bg-slate-100"
          >
            Today
          </button>
        </div>

        {/* Week range bar for multi-week windows */}
        {windowWeekIdxs.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {windowWeekIdxs.map((w) => (
              <span key={w} className="rounded-full bg-xcel-50 px-2.5 py-0.5 text-[11px] font-medium text-xcel-700 ring-1 ring-xcel-100">
                {weekLabel2(w)}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── Department strip ── */}
      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Departments
          </p>
          <p className="text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">{totalInWindow}</span> intern-postings in window
          </p>
        </div>
        <div
          ref={stripRef}
          className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {allDepts.map((d) => {
            const count = deptCounts[d.code] || 0;
            const isSelected = d.code === deptCode;
            return (
              <button
                key={d.code}
                data-dept={d.code}
                onClick={() => setDeptCode(d.code)}
                style={{ touchAction: "manipulation" }}
                className={`snap-start shrink-0 rounded-2xl border px-3.5 py-3 text-left transition min-w-[150px] ${
                  isSelected
                    ? "border-accent-500 bg-accent-50 ring-2 ring-accent-200 shadow-sm"
                    : "border-slate-200 bg-white hover:border-xcel-300 hover:bg-xcel-50 active:bg-xcel-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`dept-chip ${d.color} text-[11px] font-bold`}>{d.short}</span>
                  <span className={`text-sm font-bold tabular-nums ${count > 0 ? "text-accent-600" : "text-slate-300"}`}>
                    {count}
                  </span>
                </div>
                <div className="mt-1.5 text-[12.5px] font-semibold leading-snug text-slate-900 line-clamp-1">{d.name}</div>
                <div className="mt-0.5 text-[10px] text-slate-400">{d.weeks}w posting</div>
                {/* Mini count bar */}
                <div className="mt-2 h-1 w-full rounded-full bg-slate-100">
                  <div
                    className="h-1 rounded-full bg-accent-400"
                    style={{ width: `${count > 0 ? Math.min(100, Math.round((count / Math.max(...Object.values(deptCounts), 1)) * 100)) : 0}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Roster ── */}
      <section className="card overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Stethoscope size={18} className="text-accent-600 shrink-0" />
            <div className="min-w-0">
              <h2 className="font-bold text-slate-900 truncate">{selectedDept?.name || "Select a department"}</h2>
              <p className="text-[11px] text-slate-500">
                {filteredPosted.length} intern{filteredPosted.length !== 1 ? "s" : ""} posted in window
                {granularity === "month" && windowWeekIdxs.length > 1 && (
                  <span className="ml-1 text-xcel-600 font-medium">· across {windowWeekIdxs.length} weeks</span>
                )}
                {selectedDept?.code === "COM" && <span className="ml-1 text-amber-700">· may be at PHC / outreach</span>}
              </p>
            </div>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / roll"
              className="pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg w-44"
              style={{ touchAction: "manipulation" }}
            />
          </div>
        </div>

        {filteredPosted.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No interns posted in <strong>{selectedDept?.short || "this department"}</strong> during the selected {granularity}.
          </div>
        ) : granularity === "month" && grouped.length > 0 ? (
          // Month view: grouped by sub-batch
          <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100">
            {grouped.map(([subBatch, rows]) => (
              <div key={subBatch}>
                <div className="sticky top-0 z-10 flex items-center gap-2 bg-xcel-50/90 px-4 py-2 backdrop-blur-sm">
                  <span className="rounded-full bg-xcel-700 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Sub-batch {subBatch}
                  </span>
                  <span className="text-[11px] text-slate-500">{rows.length} intern{rows.length !== 1 ? "s" : ""}</span>
                  <div className="ml-auto flex flex-wrap gap-1">
                    {rows[0].weekIdxs.map((w) => (
                      <span key={w} className="text-[10px] text-xcel-600 font-medium">{weekLabel2(w)}</span>
                    ))}
                  </div>
                </div>
                {rows.map((r) => (
                  <InternRow key={r.regNo} r={r} readOnly={readOnly} showWeeks={false} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Day / Week view: flat list
          <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
            {filteredPosted.map((r) => (
              <InternRow key={r.regNo} r={r} readOnly={readOnly} showWeeks={granularity === "week"} />
            ))}
          </div>
        )}
      </section>

      {/* Community Medicine note */}
      {selectedDept?.code === "COM" && (
        <section className="card border-amber-200 bg-amber-50/40 p-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-amber-700 mt-0.5 shrink-0" />
            <div>
              <strong className="text-amber-900">Community Medicine — outreach deputation:</strong>
              <div className="text-amber-800 text-xs mt-1">
                During Community Medicine postings, interns are deputed to Primary Health Centres and outreach
                health centres on a rotational basis. Confirm sub-batch deputation with the department's posting coordinator.
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function InternRow({ r, readOnly, showWeeks }: {
  r: { regNo: string; name: string; subBatch: string; blockId: number; weekIdxs: number[] };
  readOnly: boolean;
  showWeeks: boolean;
}) {
  return (
    <div className="px-4 py-3 hover:bg-xcel-50/40 flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {readOnly ? (
            <span className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{r.regNo}</span>
          ) : (
            <Link href={`/admin/student/${r.regNo}`} className="font-mono text-xs text-xcel-700 hover:underline bg-xcel-50 px-1.5 py-0.5 rounded">
              {r.regNo}
            </Link>
          )}
          <span className="font-medium text-sm text-slate-900 truncate">{r.name}</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          Block {r.blockId} · Sub-batch <strong>{r.subBatch}</strong>
          {showWeeks && r.weekIdxs.length > 0 && (
            <span className="ml-1 text-xcel-600">· Week {r.weekIdxs[0] + 1}</span>
          )}
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200 shrink-0">
        <Users size={10} /> On posting
      </span>
    </div>
  );
}
