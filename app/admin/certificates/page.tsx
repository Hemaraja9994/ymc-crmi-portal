"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Award, Filter, CheckCircle2, AlertCircle, Pause, Play, RefreshCcw, Download, FileText } from "lucide-react";
import { buildAssignments } from "@/lib/rotation";
import {
  getStudentPostings, enrichPosting, computeCertificateStatus,
  loadCertificateRecords, releaseCertificate, holdCertificate, clearCertificateOverride,
  type PostingPeriod, type CertificateStatus, type CertificateRecord,
} from "@/lib/certificates";
import { loadLeaves } from "@/lib/leaves";

type Row = { posting: PostingPeriod; status: CertificateStatus };
type Filter = "all" | "ready" | "released" | "ongoing" | "hold";

export default function AdminCertificatesPage() {
  const [records, setRecords] = useState<CertificateRecord[]>([]);
  const [filter, setFilter] = useState<Filter>("ready");
  const [q, setQ] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => { setRecords(loadCertificateRecords()); }, [refresh]);

  // Build all (student × posting) rows
  const rows = useMemo<Row[]>(() => {
    const assignments = buildAssignments();
    const leaves = loadLeaves();
    const recs = loadCertificateRecords();
    const out: Row[] = [];
    for (const a of assignments) {
      for (const p of getStudentPostings(a)) {
        const enriched = enrichPosting(p, leaves);
        out.push({ posting: enriched, status: computeCertificateStatus(enriched, new Date(), leaves, recs) });
      }
    }
    return out;
  }, [refresh]);

  const filtered = rows.filter((r) => {
    const matchQ = q
      ? r.posting.regNo.toLowerCase().includes(q.toLowerCase()) ||
        r.posting.studentName.toLowerCase().includes(q.toLowerCase()) ||
        r.posting.deptName.toLowerCase().includes(q.toLowerCase())
      : true;
    if (!matchQ) return false;
    if (filter === "all") return true;
    if (filter === "released") return r.status.kind === "released";
    if (filter === "ongoing") return r.status.kind === "ongoing";
    if (filter === "hold") return r.status.kind === "on-hold";
    if (filter === "ready") {
      return r.status.kind === "released" && (r.status as any).auto === true;
    }
    return true;
  });

  // Aggregates
  const stats = useMemo(() => {
    let released = 0, ongoing = 0, hold = 0, auto = 0;
    for (const r of rows) {
      if (r.status.kind === "released") {
        released++;
        if ((r.status as any).auto) auto++;
      }
      else if (r.status.kind === "ongoing") ongoing++;
      else if (r.status.kind === "on-hold") hold++;
    }
    return { total: rows.length, released, ongoing, hold, auto };
  }, [rows]);

  function bump() { setRefresh((r) => r + 1); }

  function onRelease(p: PostingPeriod) {
    releaseCertificate(p.key, "admin");
    bump();
  }
  function onHold(p: PostingPeriod) {
    const reason = window.prompt("Reason for hold (e.g. logbook pending):") || "";
    holdCertificate(p.key, reason);
    bump();
  }
  function onClear(p: PostingPeriod) {
    clearCertificateOverride(p.key);
    bump();
  }

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="card overflow-hidden">
        <div className="brand-panel relative p-6 text-white md:p-7">
          <div className="geo-overlay absolute inset-0 opacity-50" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-teal-100">
                <Award size={12} /> Certificate Management
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
                Department-wise Posting Completion Certificates
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-teal-50/80">
                Auto-released the day after posting end + approved leave days.
                Override individually using Hold or Force-Release.
              </p>
            </div>
            <button onClick={bump} className="btn bg-white/10 ring-1 ring-white/20 text-white hover:bg-white/15">
              <RefreshCcw size={14} /> Refresh
            </button>
          </div>
        </div>
        <div className="grid gap-3 border-t border-slate-200/70 bg-white/90 p-4 text-sm sm:grid-cols-4">
          <Stat label="Total postings" value={stats.total} />
          <Stat label="Released" value={stats.released} sub={`incl. ${stats.auto} auto`} good />
          <Stat label="In progress" value={stats.ongoing} />
          <Stat label="On hold" value={stats.hold} warn />
        </div>
      </section>

      {/* Toolbar */}
      <section className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 flex-1 min-w-[240px]">
            <Filter size={14} className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by roll no, name or department"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-wrap gap-1 text-xs">
            {(["all", "ready", "released", "ongoing", "hold"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  filter === f
                    ? "bg-xcel-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "ready" ? "Auto-released" : f === "hold" ? "On hold" : f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Reg No</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Effective End</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No certificates match.</td></tr>
              ) : filtered.slice(0, 200).map((r) => (
                <tr key={r.posting.key} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-2 font-mono text-xs">{r.posting.regNo}</td>
                  <td className="px-4 py-2">{r.posting.studentName}</td>
                  <td className="px-4 py-2">
                    <span className={`dept-chip mr-2 ${r.posting.deptColor}`}>{r.posting.deptShort}</span>
                    <span className="text-slate-700">{r.posting.deptName}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500 whitespace-nowrap">
                    {fmt(r.posting.startDate)} → {fmt(r.posting.endDate)}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-700 whitespace-nowrap">
                    {fmt(r.posting.effectiveEndDate)}
                    {r.posting.approvedLeaveDays > 0 && (
                      <span className="ml-1 text-amber-700">+{r.posting.approvedLeaveDays}d leave</span>
                    )}
                  </td>
                  <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <RowActions row={r} onRelease={onRelease} onHold={onHold} onClear={onClear} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 200 && (
          <div className="border-t border-slate-100 bg-slate-50 p-3 text-center text-xs text-slate-500">
            Showing first 200 of {filtered.length} — narrow the search to refine.
          </div>
        )}
      </section>

      {/* Records summary */}
      {records.length > 0 && (
        <section className="card p-4 text-xs text-slate-500">
          <strong className="text-slate-700">{records.length}</strong> manual override(s) recorded.
          These are persisted in browser storage and take precedence over the auto-release logic.
        </section>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CertificateStatus }) {
  if (status.kind === "released") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 size={11} /> Released {status.auto ? "(auto)" : ""}
      </span>
    );
  }
  if (status.kind === "ongoing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200">
        In progress
      </span>
    );
  }
  if (status.kind === "on-hold") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200">
        <Pause size={11} /> On hold
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
      <AlertCircle size={11} /> Pending
    </span>
  );
}

function RowActions({
  row, onRelease, onHold, onClear,
}: {
  row: Row;
  onRelease: (p: PostingPeriod) => void;
  onHold: (p: PostingPeriod) => void;
  onClear: (p: PostingPeriod) => void;
}) {
  const released = row.status.kind === "released";
  const isAuto = released && (row.status as any).auto === true;
  const onHoldState = row.status.kind === "on-hold";
  const ongoing = row.status.kind === "ongoing";

  return (
    <div className="inline-flex items-center gap-1.5">
      <Link
        href={`/certificate/${encodeURIComponent(row.posting.regNo)}/${encodeURIComponent(row.posting.key)}`}
        target="_blank"
        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ring-1 transition ${
          released
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100"
            : "bg-slate-50 text-slate-400 ring-slate-200 cursor-not-allowed pointer-events-none"
        }`}
        title={released ? "Open PDF" : "Not released yet"}
      >
        <FileText size={11} /> PDF
      </Link>
      {!released && !ongoing && (
        <button
          onClick={() => onRelease(row.posting)}
          className="rounded-md bg-xcel-600 px-2 py-1 text-xs font-semibold text-white hover:bg-xcel-500"
        >
          Force release
        </button>
      )}
      {!onHoldState && !ongoing && (
        <button
          onClick={() => onHold(row.posting)}
          className="rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
          title="Hold this certificate"
        >
          <Pause size={11} />
        </button>
      )}
      {(onHoldState || (released && !isAuto)) && (
        <button
          onClick={() => onClear(row.posting)}
          className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          title="Clear override (back to auto)"
        >
          <Play size={11} />
        </button>
      )}
    </div>
  );
}

function Stat({ label, value, sub, good, warn }: { label: string; value: number; sub?: string; good?: boolean; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`mt-1 text-xl font-extrabold ${good ? "text-emerald-700" : warn ? "text-rose-700" : "text-slate-900"}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
    </div>
  );
}

function fmt(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
