"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Printer, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { findAssignmentByCampusId } from "@/lib/rotation";
import { getStudentPostings, enrichPosting, computeCertificateStatus, loadCertificateRecords } from "@/lib/certificates";
import { loadLeaves } from "@/lib/leaves";

const INSTITUTION = {
  name: "Yenepoya Medical College",
  address: "Deralakatte, Mangalore – 575 018, Karnataka",
  phone: "+91-824-2204668",
  email: "principalymc@yenepoya.edu.in",
  emailGeneral: "hospital@yenepoya.org",
};

const PRINCIPAL_NAME = "Dr. Prakash Robert M. Saldanha";

const REF_PREFIX = "YMC/CRMI/RPT";

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function fmtDateTime(d: Date) {
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function CertificatePage() {
  const params = useParams();
  const regNo = decodeURIComponent(params.regNo as string);
  const postingKey = decodeURIComponent(params.postingKey as string);
  const [now, setNow] = useState<Date | null>(null);

  // Compute on client so localStorage (leaves, releases) is available
  const data = useMemo(() => {
    const assignment = findAssignmentByCampusId(regNo);
    if (!assignment) return null;
    const postings = getStudentPostings(assignment);
    const posting = postings.find((p) => p.key === postingKey);
    if (!posting) return null;
    const leaves = loadLeaves();
    const records = loadCertificateRecords();
    const enriched = enrichPosting(posting, leaves);
    const status = computeCertificateStatus(enriched, new Date(), leaves, records);
    return { assignment, posting: enriched, status };
  }, [regNo, postingKey]);

  useEffect(() => {
    setNow(new Date());
  }, []);

  if (!data) {
    return (
      <div className="mx-auto max-w-xl p-10 text-center">
        <h1 className="text-xl font-bold text-rose-700">Report not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          We could not find a posting matching that link. Roll number <code>{regNo}</code>,
          posting key <code>{postingKey}</code>.
        </p>
        <Link href={`/student/${encodeURIComponent(regNo)}`} className="btn-primary mt-6 inline-flex">
          <ArrowLeft size={14} /> Back to dashboard
        </Link>
      </div>
    );
  }

  const { posting, status, assignment } = data;
  const released = status.kind === "released";
  const auto = status.kind === "released" && status.auto;
  const releasedAt = status.kind === "released" ? new Date(status.releasedAt) : null;
  const reportRef = `${REF_PREFIX}/${posting.regNo}/${posting.deptCode}/${posting.startWeekIdx + 1}`;

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* On-screen action bar (hidden on print) */}
      <div className="no-print mx-auto max-w-3xl px-4 py-4 flex items-center justify-between gap-2">
        <Link href={`/student/${encodeURIComponent(regNo)}`} className="btn-outline">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="flex items-center gap-2">
          {!released && (
            <span className="badge bg-amber-50 text-amber-800 ring-1 ring-amber-200">
              {status.kind === "ongoing" ? "Posting in progress" : status.kind === "on-hold" ? "On hold" : "Pending"}
            </span>
          )}
          <button onClick={() => window.print()} className="btn-primary" disabled={!released}>
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>

      {!released && (
        <div className="no-print mx-auto max-w-3xl px-4 pb-4">
          <div className="card border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
            {status.kind === "ongoing" && (
              <>This posting is still in progress. The report will be available after <strong>{fmtDate(posting.effectiveEndDate)}</strong>.</>
            )}
            {status.kind === "on-hold" && (
              <>The CRMI Coordinator has placed this report on hold{status.reason ? `: "${status.reason}"` : ""}. Please contact the office.</>
            )}
            {status.kind === "awaiting-release" && (
              <>Awaiting Coordinator review. The report will appear here shortly.</>
            )}
          </div>
        </div>
      )}

      {/* ── Report body — A4 sheet with generous margins ─────────────────────
         Outer .a4-sheet has fixed A4 dimensions in print; an inner padding ring
         gives the visible inside margin so the PDF looks like a typed letter. */}
      <main
        className="ymc-report-sheet mx-auto bg-white shadow-xl print:shadow-none my-6 print:my-0"
        style={{
          width: "210mm",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            // On screen: generous internal padding so it looks like a typed letter.
            // In print: globals.css overrides padding:0 and @page handles the margins.
            padding: "20mm 22mm",
            boxSizing: "border-box",
          }}
        >
          {/* ── Letterhead ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #0B5345", paddingBottom: 12, marginBottom: 22 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ymch-logo.png" alt="YMC Logo" style={{ height: 58, width: "auto", display: "block", flex: "0 0 auto" }} />
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#062E25", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                {INSTITUTION.name}
              </div>
              <div style={{ fontSize: 9.5, color: "#475569", marginTop: 2 }}>{INSTITUTION.address}</div>
              <div style={{ fontSize: 9.5, color: "#475569" }}>{INSTITUTION.phone} · {INSTITUTION.email}</div>
              <div style={{ fontSize: 8.5, color: "#94a3b8", marginTop: 1 }}>Postings & Portal Support · {INSTITUTION.emailGeneral}</div>
            </div>
            <div style={{ flex: "0 0 auto", textAlign: "right", fontSize: 9, color: "#475569", lineHeight: 1.5 }}>
              <div>Ref: <strong style={{ color: "#0F172A" }}>{reportRef}</strong></div>
              <div>Date: {now ? fmtDate(now) : ""}</div>
            </div>
          </div>

          {/* ── Title block ── */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.22em", color: "#0B5345", fontWeight: 700, textTransform: "uppercase" }}>
              Compulsory Rotatory Medical Internship · NMC Regulation 2021
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "12px 0 4px", letterSpacing: "-0.02em" }}>
              Posting Completion Report
            </h1>
            <div style={{ fontSize: 9.5, color: "#64748B" }}>
              Department-wise · MBBS 2021 CBME Internship Programme
            </div>
          </div>

          {/* ── Recital paragraph ── */}
          <p style={{ fontSize: 11.5, lineHeight: 1.85, color: "#1E293B", textAlign: "justify", marginBottom: 22 }}>
            This report certifies that <strong style={{ color: "#0F172A" }}>Dr. {posting.studentName}</strong>,
            bearing Roll Number <strong>{posting.regNo}</strong>, of the MBBS 2021 CBME batch at
            Yenepoya Medical College, has satisfactorily completed the compulsory rotatory medical
            internship posting in the Department of
            {" "}<strong style={{ color: "#0B5345" }}>{posting.deptName}</strong>{" "}
            (Block {posting.blockId}) for a duration of {" "}
            <strong>{posting.weeks} week{posting.weeks > 1 ? "s" : ""}</strong>.
          </p>

          {/* ── Posting details ── */}
          <div style={{ fontSize: 10, fontWeight: 700, color: "#0B5345", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            Posting Details
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 11 }}>
            <tbody>
              <Row label="Intern Name"          value={`Dr. ${posting.studentName}`} />
              <Row label="Roll Number"          value={posting.regNo} />
              <Row label="Department"           value={`${posting.deptName} (${posting.deptShort})`} />
              <Row label="Block / Rotation"     value={`Block ${posting.blockId}`} />
              <Row label="Duration"             value={`${posting.weeks} week${posting.weeks > 1 ? "s" : ""}`} />
              <Row label="Posting Start"        value={fmtDate(posting.startDate)} />
              <Row label="Posting End"          value={fmtDate(posting.endDate)} />
              <Row label="Approved Leave Days"  value={`${posting.approvedLeaveDays} day(s)`} />
              <Row label="Effective End Date"   value={fmtDate(posting.effectiveEndDate)} highlight />
              <Row label="CL Policy Cap"        value={`Up to ${posting.allowedLeaveDays} day(s) per NMC norms`} />
            </tbody>
          </table>

          {/* ── Compliance note ── */}
          <p style={{ fontSize: 10.5, lineHeight: 1.75, color: "#334155", marginBottom: 20, padding: "10px 14px", background: "#F8FAFC", borderLeft: "3px solid #0B5345", borderRadius: 2 }}>
            <strong style={{ color: "#0F172A" }}>Compliance:</strong> The intern has met the minimum 80%
            attendance requirement and submitted weekly logbook entries for the posting period above.
            This report is issued for record purposes and as evidence of completion of the said department posting.
          </p>

          {/* ── Signature block ── */}
          <table style={{ width: "100%", fontSize: 9.5, marginTop: 48 }}>
            <tbody>
              <tr>
                <td style={{ width: "33%", textAlign: "center", paddingTop: 50 }}>
                  <div style={{ borderTop: "1.5px solid #334155", paddingTop: 5 }}>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>Head of Department</div>
                    <div style={{ color: "#64748B", fontSize: 9 }}>Dept. of {posting.deptName}</div>
                  </div>
                </td>
                <td style={{ width: "34%", textAlign: "center", paddingTop: 50 }}>
                  <div style={{ borderTop: "1.5px solid #334155", paddingTop: 5 }}>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>CRMI Coordinator</div>
                    <div style={{ color: "#64748B", fontSize: 9 }}>Yenepoya Medical College</div>
                  </div>
                </td>
                <td style={{ width: "33%", textAlign: "center", paddingTop: 50 }}>
                  <div style={{ borderTop: "1.5px solid #334155", paddingTop: 5 }}>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{PRINCIPAL_NAME}</div>
                    <div style={{ color: "#64748B", fontSize: 9 }}>Principal, Yenepoya Medical College</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── Footer / verification ── */}
          <div style={{ marginTop: 24, paddingTop: 10, borderTop: "1px dashed #cbd5e1", fontSize: 7.5, color: "#94a3b8", textAlign: "center", lineHeight: 1.55 }}>
            <div>
              Document generated by the YMC CRMI Portal on{" "}
              <strong style={{ color: "#475569" }}>{now ? fmtDateTime(now) : ""}</strong>
              {released && releasedAt && (
                <> · Released on <strong style={{ color: "#475569" }}>{fmtDateTime(releasedAt)}</strong>{auto ? " (auto-released)" : ""}</>
              )}
            </div>
            <div style={{ marginTop: 3 }}>
              This is a system-generated PDF. Authenticity may be verified at{" "}
              <strong style={{ color: "#475569" }}>ymc-crmi-portal.vercel.app/verify/{reportRef.split("/").pop()}</strong>
            </div>
          </div>
        </div>
      </main>

      <div className="h-10 no-print" />
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr>
      <td style={{
        border: "1px solid #E2E8F0",
        padding: "7px 14px",
        fontWeight: 600,
        color: "#475569",
        background: "#F8FAFC",
        width: "38%",
        fontSize: 10.5,
        letterSpacing: "0.01em",
      }}>
        {label}
      </td>
      <td style={{
        border: "1px solid #E2E8F0",
        padding: "7px 14px",
        color: highlight ? "#0B5345" : "#0F172A",
        fontWeight: highlight ? 700 : 400,
        background: highlight ? "#F0FDF4" : "#FFFFFF",
      }}>
        {value}
      </td>
    </tr>
  );
}
