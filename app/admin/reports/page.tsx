import PrintReportButton from "@/components/PrintReportButton";
import { BLOCKS, START_DATE, buildAssignments, currentWeekIndex, getWeekDates } from "@/lib/rotation";

type DeptCount = { code: string; short: string; name: string; count: number };

// ── Institution constants ─────────────────────────────────────────────────────
const INSTITUTION = {
  name:       "Yenepoya Medical College",
  address:    "Deralakatte, Mangalore – 575 018, Karnataka",
  phone:      "+91-824-2204668",
  email:      "principal@yenepoya.edu.in",
  accredited: "NAAC A++ | KMC University",
};

const CRMI_COMMITTEE = [
  { role: "Principal & Chairman",          name: "Prof. (Dr.) _______________" },
  { role: "CRMI Coordinator",              name: "Prof. (Dr.) _______________" },
  { role: "Member – Academic Affairs",     name: "Prof. (Dr.) _______________" },
  { role: "Member – Student Welfare",      name: "Prof. (Dr.) _______________" },
];

const REF_NO = "YMC/CRMI/2025-26";

export default function ReportsPage() {
  const assignments = buildAssignments();
  const weekIdx = currentWeekIndex();
  const week = getWeekDates(weekIdx);
  const generatedAt = new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const todayFormal = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const deptReports = BLOCKS.flatMap((block) =>
    block.depts.map((dept) => ({
      block,
      dept,
      students: assignments
        .filter((a) => a.rotation.some((p) => p.weekIdx === weekIdx && p.deptCode === dept.code))
        .sort((a, b) => a.student.regNo.localeCompare(b.student.regNo)),
    }))
  );

  const monthReports = buildMonthReports(assignments);

  return (
    <div className="print-page space-y-6">

      {/* ── Running page footer (print only) ─────────────── */}
      <div className="print-running-footer hidden">
        Ref: {REF_NO} · YMC CRMI Portal · Printed {todayFormal} · Confidential — For Internal Circulation Only
      </div>

      {/* ── Screen hero header ─────────────────────────────── */}
      <section className="card screen-only overflow-hidden">
        <div className="brand-panel relative p-6 text-white md:p-8">
          <div className="geo-overlay absolute inset-0 opacity-70" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-cyan-100">
                Yenepoya Medical College — CRMI Coordination Cell
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Report Pack — PDF Export</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-50/90">
                Block-wise, department-wise and month-wise posting reports. Each section can be printed
                individually for HOD letters, principal summaries and official file notes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <PrintReportButton label="Print Full Pack" />
            </div>
          </div>
        </div>
        <div className="grid gap-3 border-t border-slate-200/70 bg-white/90 p-4 text-sm sm:grid-cols-3">
          <ReportMeta label="Batch"        value="MBBS 2021 CBME" />
          <ReportMeta label="Current week" value={`W${weekIdx + 1}: ${week.label}`} />
          <ReportMeta label="Generated"    value={generatedAt} />
        </div>
      </section>

      {/* ── Official Letterhead (visible on print, hidden on screen) ── */}
      <div className="print-letterhead hidden">
        <table style={{ width: "100%", borderBottom: "2.5px solid #0B5345", paddingBottom: "10px", marginBottom: "14px" }}>
          <tbody>
            <tr>
              <td style={{ width: 80 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/ymch-logo.png" alt="YMC Logo" style={{ height: 72, width: "auto" }} />
              </td>
              <td style={{ paddingLeft: 16 }}>
                <div style={{ fontSize: "17pt", fontWeight: 800, color: "#062E25", lineHeight: 1.1 }}>
                  Yenepoya Medical College
                </div>
                <div style={{ fontSize: "9pt", color: "#444", marginTop: 2 }}>{INSTITUTION.address}</div>
                <div style={{ fontSize: "9pt", color: "#444" }}>
                  {INSTITUTION.phone} &nbsp;·&nbsp; {INSTITUTION.email}
                </div>
                <div style={{ fontSize: "8pt", color: "#666", marginTop: 2 }}>{INSTITUTION.accredited}</div>
              </td>
              <td style={{ textAlign: "right", verticalAlign: "top", fontSize: "8.5pt", color: "#444" }}>
                <div>Ref: <strong>{REF_NO}</strong></div>
                <div>Date: {todayFormal}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: "12pt", fontWeight: 700, color: "#0B5345", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Compulsory Rotatory Medical Internship (CRMI)
          </div>
          <div style={{ fontSize: "9pt", color: "#555" }}>
            MBBS 2021 CBME Batch · 01 June 2026 – 31 May 2027 · NMC Regulation 2021
          </div>
        </div>
      </div>

      {/* ── 1. Block-wise Allotment ─────────────────────── */}
      <section className="card print-card overflow-hidden">
        <SectionHeader
          title="Block-wise Student Allotment"
          subtitle="For principal summaries and block letters — lists all interns per rotation block."
          badge={`${assignments.length} interns`}
          badgeColor="bg-cyan-50 text-cyan-700 ring-cyan-100"
          printLabel="Print Block Report"
        />

        <div className="mt-5 grid gap-4 p-5 lg:grid-cols-2">
          {BLOCKS.map((block) => {
            const students = assignments
              .filter((a) => a.blockId === block.id)
              .sort((a, b) => a.subBatch.localeCompare(b.subBatch) || a.student.regNo.localeCompare(b.student.regNo));
            return (
              <div key={block.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rotation</div>
                    <h3 className="font-bold text-slate-950">{block.title}</h3>
                    <p className="text-xs text-slate-500">{students.length} students · {block.depts.length} departments</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    {block.depts.map((d) => (
                      <span key={d.code} className={`dept-chip ${d.color}`}>{d.short}</span>
                    ))}
                  </div>
                </div>
                <ReportTable
                  headers={["Reg No", "Student Name", "Sub-batch"]}
                  rows={students.map((a) => [a.student.regNo, a.student.name, a.subBatch])}
                />
              </div>
            );
          })}
        </div>

        {/* Print-only committee sign-off for block report */}
        <CommitteeBlock title="Block-wise Posting Report" date={todayFormal} />
      </section>

      {/* ── 2. Department-wise Allotment ─────────────────── */}
      <section className="card print-card print-page-break overflow-hidden">
        <SectionHeader
          title="Department-wise Allotment"
          subtitle={`Current posting snapshot for W${weekIdx + 1}: ${week.label}. Send to HODs for confirmation.`}
          badge="Week report"
          badgeColor="bg-xcel-100 text-xcel-800 ring-xcel-200"
          printLabel="Print Dept Report"
        />

        <div className="mt-5 grid gap-4 p-5 lg:grid-cols-2">
          {deptReports.map(({ block, dept, students }) => (
            <div key={dept.code} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`dept-chip ${dept.color}`}>{dept.short}</span>
                  <h3 className="mt-2 font-bold text-slate-950">{dept.name}</h3>
                  <p className="text-xs text-slate-500">Block {block.id} · {students.length} students posted</p>
                </div>
                <span className="badge bg-slate-100 text-slate-600">CL: {dept.casualLeaveDays === "Nil" ? "Nil" : `${dept.casualLeaveDays}d`}</span>
              </div>
              <ReportTable
                headers={["Reg No", "Student Name", "Sub-batch"]}
                rows={students.map((a) => [a.student.regNo, a.student.name, a.subBatch])}
                empty="No students posted this week."
              />
            </div>
          ))}
        </div>

        <CommitteeBlock title="Department-wise Posting Report" date={todayFormal} />
      </section>

      {/* ── 3. Month-wise Summary ─────────────────────────── */}
      <section className="card print-card print-page-break overflow-hidden">
        <SectionHeader
          title="Month-wise Posting Summary"
          subtitle="Compact monthly index for e-mails, letters and file notes to the Dean and Principal."
          badge="12 months"
          badgeColor="bg-indigo-50 text-indigo-700 ring-indigo-100"
          printLabel="Print Month Summary"
        />

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Month</th>
                <th className="px-3 py-2">Weeks</th>
                <th className="px-3 py-2">Date Range</th>
                <th className="px-3 py-2">Department Allocations (top 6)</th>
              </tr>
            </thead>
            <tbody>
              {monthReports.map((month) => (
                <tr key={month.label} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2 font-semibold text-slate-950">{month.label}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{month.weeks}</td>
                  <td className="px-3 py-2 text-slate-600">{month.range}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {month.topDepartments.map((d) => (
                        <span key={`${month.label}-${d.code}`} className="badge bg-slate-100 text-slate-700">
                          {d.short}: {d.count}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CommitteeBlock title="Month-wise Posting Summary" date={todayFormal} />
      </section>

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({
  title, subtitle, badge, badgeColor, printLabel,
}: {
  title: string; subtitle: string; badge: string;
  badgeColor: string; printLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
      <div>
        <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="no-print flex items-center gap-2">
        <span className={`badge ring-1 ${badgeColor}`}>{badge}</span>
        <PrintReportButton label={printLabel} />
      </div>
    </div>
  );
}

function CommitteeBlock({ title, date }: { title: string; date: string }) {
  return (
    <div className="print-letterhead hidden border-t border-slate-200 bg-slate-50/50 px-5 py-6">
      <div className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
        CRMI Committee — {title} · {date}
      </div>
      <div className="grid grid-cols-4 gap-6">
        {CRMI_COMMITTEE.map((m) => (
          <div key={m.role} className="text-center">
            <div style={{ borderTop: "1.5px solid #334155", paddingTop: 6, marginTop: 40 }} />
            <div className="text-xs font-semibold text-slate-800">{m.name}</div>
            <div className="text-[10px] text-slate-500">{m.role}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[9px] text-slate-400 text-center">
        This document is generated by the YMC CRMI Portal · Ref: YMC/CRMI/2025-26 ·
        Yenepoya Medical College, Deralakatte, Mangalore · For internal circulation only.
      </p>
    </div>
  );
}

function ReportMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="mt-1 font-bold text-slate-950">{value}</div>
    </div>
  );
}

function ReportTable({ headers, rows, empty = "No records." }: {
  headers: string[]; rows: string[][]; empty?: string;
}) {
  return (
    <div className="mt-3 max-h-[420px] overflow-auto rounded-xl border border-slate-200 print:max-h-none print:overflow-visible">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-slate-50 text-slate-500 print:static">
          <tr>
            {headers.map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-3 py-4 text-center text-slate-500">{empty}</td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-100">
              {row.map((cell, j) => (
                <td key={j} className={j === 0 ? "px-3 py-1.5 font-mono" : "px-3 py-1.5"}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildMonthReports(assignments: ReturnType<typeof buildAssignments>) {
  return Array.from({ length: 12 }, (_, mo) => {
    const monthStart = new Date(START_DATE.getFullYear(), START_DATE.getMonth() + mo, 1);
    const monthEnd   = new Date(START_DATE.getFullYear(), START_DATE.getMonth() + mo + 1, 0);
    const weekIdxs = Array.from({ length: 52 }, (_, i) => i).filter((i) => {
      const w = getWeekDates(i);
      return w.start <= monthEnd && w.end >= monthStart;
    });

    const counts = new Map<string, DeptCount>();
    for (const wi of weekIdxs) {
      for (const a of assignments) {
        const p = a.rotation.find((r) => r.weekIdx === wi);
        if (!p) continue;
        const cur = counts.get(p.deptCode) ?? { code: p.deptCode, short: p.deptShort, name: p.deptName, count: 0 };
        cur.count += 1;
        counts.set(p.deptCode, cur);
      }
    }

    const first = getWeekDates(weekIdxs[0]);
    const last  = getWeekDates(weekIdxs[weekIdxs.length - 1]);

    return {
      label: monthStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      weeks: weekIdxs.map((i) => `W${i + 1}`).join(", "),
      range: `${fmt(first.start)} to ${fmt(last.end)}`,
      topDepartments: Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, 6),
    };
  });
}

function fmt(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
