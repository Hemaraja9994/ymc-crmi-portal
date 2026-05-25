"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Clock, Lock } from "lucide-react";

type WeekCell = {
  idx: number;
  start: Date | string;
  end: Date | string;
  label: string;
  cell: { deptCode: string; deptName: string; deptShort: string; color: string };
};

export default function StudentMatrixPreview({
  studentName,
  regNo,
  blockId,
  subBatch,
  weeks,
  currentWeek,
  preLaunch,
  onContinue,
}: {
  studentName: string;
  regNo: string;
  blockId: number;
  subBatch: string;
  weeks: WeekCell[];
  currentWeek: number; // -1 if pre-launch
  preLaunch: boolean;
  onContinue: () => void;
}) {
  const [hover, setHover] = useState<WeekCell | null>(null);

  // Group by month (every 4 weeks)
  const months: WeekCell[][] = [];
  for (let i = 0; i < weeks.length; i += 4) months.push(weeks.slice(i, i + 4));

  return (
    <section className="mt-6 rounded-2xl border border-xcel-200 bg-white shadow-card overflow-hidden">
      <div className="p-4 md:p-5 bg-gradient-to-r from-xcel-50 via-white to-xcel-50 flex items-center justify-between flex-wrap gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-xcel-700 inline-flex items-center gap-1">
            <Sparkles size={12} /> 52-Week Rotation Matrix
          </div>
          <div className="mt-1 font-bold text-lg truncate">{studentName}</div>
          <div className="text-xs text-slate-500">
            Reg No <span className="font-mono">{regNo}</span> · Block {blockId} · Sub-batch{" "}
            <span className="font-mono">{subBatch}</span>
          </div>
        </div>
        <button onClick={onContinue} className="btn-primary text-sm">
          Sign in with OTP <ArrowRight size={14} />
        </button>
      </div>

      {/* Matrix grid */}
      <div className="p-3 md:p-4 overflow-x-auto">
        <div className="min-w-[640px] space-y-2">
          {months.map((m, mi) => (
            <div key={mi} className="grid grid-cols-[60px_repeat(4,1fr)] gap-1.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 self-center">
                M{mi + 1}
              </div>
              {m.map((w) => {
                const status =
                  preLaunch
                    ? "upcoming"
                    : w.idx < currentWeek
                    ? "done"
                    : w.idx === currentWeek
                    ? "current"
                    : "upcoming";
                return (
                  <div
                    key={w.idx}
                    onMouseEnter={() => setHover(w)}
                    onMouseLeave={() => setHover(null)}
                    className={`relative rounded-lg border p-2 text-[11px] cursor-default transition ${
                      status === "current"
                        ? "border-xcel-500 ring-2 ring-xcel-200 bg-white"
                        : status === "done"
                        ? "border-slate-200 bg-slate-50/60 opacity-80"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">W{w.idx + 1}</span>
                      {status === "done" && <CheckCircle2 size={11} className="text-emerald-600" />}
                      {status === "current" && <Clock size={11} className="text-xcel-600" />}
                      {status === "upcoming" && !preLaunch && <Lock size={11} className="text-slate-400" />}
                    </div>
                    <span className={`dept-chip mt-1 ${w.cell.color}`}>{w.cell.deptShort}</span>
                    <div className="mt-1 text-[10px] text-slate-500 font-mono truncate">
                      {w.label.split(" – ")[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Hover detail */}
      <div className="px-4 md:px-5 py-3 border-t border-slate-200 bg-slate-50 text-xs flex flex-wrap items-center gap-3">
        {hover ? (
          <>
            <span className={`dept-chip ${hover.cell.color}`}>{hover.cell.deptShort}</span>
            <span className="font-semibold">{hover.cell.deptName}</span>
            <span className="text-slate-500 font-mono">W{hover.idx + 1} · {hover.label}</span>
          </>
        ) : (
          <span className="text-slate-500">
            Hover or tap any week tile for posting details. Sign in for the full dashboard with
            leave management, WhatsApp share, and certificate stamps.
          </span>
        )}
      </div>

      <div className="px-4 md:px-5 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1"><CheckCircle2 size={11} className="text-emerald-600" /> Completed</span>
        <span className="inline-flex items-center gap-1"><Clock size={11} className="text-xcel-600" /> Current</span>
        <span className="inline-flex items-center gap-1"><Lock size={11} className="text-slate-400" /> Upcoming</span>
        <Link href={`/postings-overview`} className="ml-auto text-xcel-700 hover:underline">
          See who else is in each department →
        </Link>
      </div>
    </section>
  );
}
