"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Download, AlertCircle, CheckCircle2, Printer } from "lucide-react";
import { LeaveRecord, LEAVE_TYPE_COLORS, loadLeaves, isOnLeave } from "@/lib/leaves";
import { isPreLaunch } from "@/lib/rotation";
import { attendanceFor, ATTENDANCE_THRESHOLD } from "@/lib/attendance";
import { ShieldAlert } from "lucide-react";

const INSTITUTION = {
  name:       "Yenepoya Medical College",
  address:    "Deralakatte, Mangalore – 575 018, Karnataka",
  phone:      "+91-824-2204668",
  email:      "principalymc@yenepoya.edu.in",
  emailGeneral: "hospital@yenepoya.org",
  accredited: "NAAC A++ | KMC University",
};

const CRMI_COMMITTEE = [
  { role: "Principal / Dean, YMC",   name: "Dr. Prakash Robert M. Saldanha" },
  { role: "Coordinator (Comm. Med.)",name: "Dr. Imaad M Ismail" },
  { role: "Internship Coordinator",  name: "Dr. Jeevan Pereira" },
  { role: "Internship Coordinator",  name: "Dr. Rohith George" },
];

const REF_NO = "YMC/CRMI/ROSTER/2026-27";

export default function Roster({
  assignments,
  blocks,
  currentWeek,
}: {
  assignments: any[];
  blocks: any[];
  currentWeek: { idx: number; label: string };
}) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  useEffect(() => setLeaves(loadLeaves()), []);
  const [q, setQ] = useState("");
  const [block, setBlock] = useState<string>("all");
  const [dept, setDept] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const allDepts = blocks.flatMap((b: any) => b.depts);

  const rows = useMemo(() => {
    return assignments.filter((a) => {
      if (block !== "all" && String(a.blockId) !== block) return false;
      const cell = a.rotation.find((r: any) => r.weekIdx === currentWeek.idx);
      if (dept !== "all" && cell?.deptCode !== dept) return false;
      const onLeave = isOnLeave(a.student.regNo, leaves);
      if (status === "leave" && !onLeave) return false;
      if (status === "duty" && onLeave) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!a.student.name.toLowerCase().includes(s) && !a.student.regNo.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [assignments, leaves, q, block, dept, status, currentWeek.idx]);

  function exportCsv() {
    const header = "RollNo,Name,Block,SubBatch,CurrentDept,Status,LeaveType,LeaveFrom,LeaveTo";
    const lines = rows.map((a) => {
      const cell = a.rotation.find((r: any) => r.weekIdx === currentWeek.idx);
      const lv = isOnLeave(a.student.regNo, leaves);
      return [
        a.student.regNo,
        `"${a.student.name}"`,
        a.blockId,
        a.subBatch,
        cell?.deptShort || "",
        lv ? "On Leave" : "On Duty",
        lv?.type || "",
        lv?.from || "",
        lv?.to || "",
      ].join(",");
    });
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ymc_roster.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const todayFormal = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const filterSummary = [
    block !== "all" ? `Block ${block}` : "All blocks",
    dept !== "all" ? `Dept ${dept}` : "All depts",
    status !== "all" ? (status === "duty" ? "On duty" : "On leave") : "All status",
    q ? `"${q}"` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="space-y-5 print-page">

      {/* ── Official Letterhead (print only) ───────────────────────── */}
      <div className="print-letterhead hidden">
        <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #1E1B4B", paddingBottom: 8, marginBottom: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ymch-logo.png" alt="YMC Logo" style={{ height: 56, width: "auto", display: "block", flex: "0 0 auto" }} />
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <div style={{ fontSize: "15pt", fontWeight: 800, color: "#1E1B4B", lineHeight: 1.05 }}>
              {INSTITUTION.name}
            </div>
            <div style={{ fontSize: "8.5pt", color: "#444", marginTop: 1 }}>{INSTITUTION.address}</div>
            <div style={{ fontSize: "8.5pt", color: "#444" }}>
              {INSTITUTION.phone} &nbsp;·&nbsp; {INSTITUTION.email} &nbsp;·&nbsp; {INSTITUTION.emailGeneral}
            </div>
            <div style={{ fontSize: "7.5pt", color: "#666", marginTop: 1 }}>{INSTITUTION.accredited}</div>
          </div>
          <div style={{ flex: "0 0 auto", textAlign: "right", fontSize: "8pt", color: "#444", lineHeight: 1.35 }}>
            <div>Ref: <strong>{REF_NO}</strong></div>
            <div>Date: {todayFormal}</div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: "11pt", fontWeight: 700, color: "#1E1B4B", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Intern Duty Roster · CRMI Allotment
          </div>
          <div style={{ fontSize: "8.5pt", color: "#555", marginTop: 2 }}>
            MBBS 2021 CBME Batch · w.e.f. 01.06.2026 · Week {currentWeek.idx + 1}: {currentWeek.label} · {filterSummary}
          </div>
        </div>
      </div>

      <header className="no-print flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Intern Roster</h1>
          <p className="text-sm text-slate-500">
            {rows.length} of {assignments.length} interns · W{currentWeek.idx + 1} · {currentWeek.label}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCsv}
            className="btn-outline"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary"
          >
            <Printer size={14} /> Download PDF
          </button>
        </div>
      </header>

      <div className="no-print card p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or roll number…"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-xcel-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Filter size={14} className="text-slate-400" />
          <select value={block} onChange={(e) => setBlock(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
            <option value="all">All blocks</option>
            {blocks.map((b: any) => (
              <option key={b.id} value={b.id}>Block {b.id}</option>
            ))}
          </select>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
            <option value="all">All departments</option>
            {allDepts.map((d: any) => (
              <option key={d.code} value={d.code}>{d.short}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm">
            <option value="all">All status</option>
            <option value="duty">On duty</option>
            <option value="leave">On leave</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-3 py-2">Roll No</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Block</th>
                <th className="text-left px-3 py-2">Sub-batch</th>
                <th className="text-left px-3 py-2">Current Posting</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const cell = a.rotation.find((r: any) => r.weekIdx === currentWeek.idx);
                const pre = isPreLaunch();
                const lv = pre ? undefined : isOnLeave(a.student.regNo, leaves);
                return (
                  <tr key={a.student.regNo} className="border-t border-slate-100 hover:bg-xcel-50/40">
                    <td className="px-3 py-2 font-mono">
                      <Link className="text-xcel-700 hover:underline" href={`/admin/student/${a.student.regNo}`}>
                        {a.student.regNo}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-medium">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{a.student.name}</span>
                        {!pre && (() => {
                          const att = attendanceFor(a.student.regNo, leaves);
                          return att.deficient ? (
                            <span
                              title={`${att.attendancePct}% — below ${ATTENDANCE_THRESHOLD}% NMC threshold`}
                              className="badge bg-rose-100 text-rose-800 ring-1 ring-rose-200"
                            >
                              <ShieldAlert size={10} /> {att.attendancePct}%
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </td>
                    <td className="px-3 py-2">{a.blockId}</td>
                    <td className="px-3 py-2 font-mono text-slate-600">{a.subBatch}</td>
                    <td className="px-3 py-2">
                      {pre
                        ? <span className="text-xs text-slate-400">— pending start —</span>
                        : cell && <span className={`dept-chip ${cell.color}`}>{cell.deptShort}</span>}
                    </td>
                    <td className="px-3 py-2">
                      {pre ? (
                        <span className="badge bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                          Awaiting start
                        </span>
                      ) : lv ? (
                        <span className={`badge ring-1 ${LEAVE_TYPE_COLORS[lv.type]}`}>
                          <AlertCircle size={11} /> {lv.type}
                        </span>
                      ) : (
                        <span className="badge bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                          <CheckCircle2 size={11} /> On duty
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

      {/* ── CRMI Committee sign-off (print only) ───────────────────── */}
      <div className="print-letterhead hidden" style={{ borderTop: "1px solid #cbd5e1", paddingTop: 14, marginTop: 18 }}>
        <div style={{ fontSize: "8.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", marginBottom: 12 }}>
          CRMI Coordination Cell — Verified & Issued for HOD Circulation
        </div>
        <table style={{ width: "100%", fontSize: "9pt" }}>
          <tbody>
            <tr>
              {CRMI_COMMITTEE.map((m) => (
                <td key={m.name} style={{ width: "25%", textAlign: "center", paddingTop: 38 }}>
                  <div style={{ borderTop: "1.5px solid #334155", paddingTop: 4 }}>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{m.name}</div>
                    <div style={{ color: "#64748B", fontSize: "8pt" }}>{m.role}</div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 14, fontSize: "7.5pt", color: "#94a3b8", textAlign: "center" }}>
          This roster is generated by the YMC CRMI Portal · Ref: {REF_NO} · Generated {todayFormal} ·
          For internal circulation only.
        </p>
      </div>
    </div>
  );
}
