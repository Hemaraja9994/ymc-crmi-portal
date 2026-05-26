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

const PRINCIPAL_NAME = "Dr. Prakash Saldanha";

const REF_PREFIX = "YMC/CRMI/CERT";

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
        <h1 className="text-xl font-bold text-rose-700">Certificate not found</h1>
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
  const certRef = `${REF_PREFIX}/${posting.regNo}/${posting.deptCode}/${posting.startWeekIdx + 1}`;

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
              <>This posting is still in progress. The certificate will be available after <strong>{fmtDate(posting.effectiveEndDate)}</strong>.</>
            )}
            {status.kind === "on-hold" && (
              <>The CRMI Coordinator has placed this certificate on hold{status.reason ? `: "${status.reason}"` : ""}. Please contact the office.</>
            )}
            {status.kind === "awaiting-release" && (
              <>Awaiting Coordinator review. The certificate will appear here shortly.</>
            )}
          </div>
        </div>
      )}

      {/* ── Certificate body ── */}
      <main className="mx-auto max-w-3xl bg-white px-10 py-12 print:max-w-none print:px-8 print:py-6 shadow-xl print:shadow-none my-4 print:my-0">

        {/* Letterhead */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #0B5345", paddingBottom: 10, marginBottom: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ymch-logo.png" alt="YMC Logo" style={{ height: 56, width: "auto", display: "block", flex: "0 0 auto" }} />
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#062E25", lineHeight: 1.05 }}>{INSTITUTION.name}</div>
            <div style={{ fontSize: 10, color: "#444" }}>{INSTITUTION.address}</div>
            <div style={{ fontSize: 10, color: "#444" }}>{INSTITUTION.phone} · {INSTITUTION.email}</div>
            <div style={{ fontSize: 9, color: "#666" }}>Postings & Portal Support · {INSTITUTION.emailGeneral}</div>
          </div>
          <div style={{ flex: "0 0 auto", textAlign: "right", fontSize: 9, color: "#444", lineHeight: 1.4 }}>
            <div>Ref: <strong>{certRef}</strong></div>
            <div>Date: {now ? fmtDate(now) : ""}</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#0B5345", fontWeight: 700, textTransform: "uppercase" }}>
            Compulsory Rotatory Medical Internship · NMC 2021
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", marginTop: 8, letterSpacing: "-0.02em" }}>
            Certificate of Posting Completion
          </h1>
          <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>
            (Department-wise · Issued under MBBS 2021 CBME Internship Regulation)
          </div>
        </div>

        {/* Body — formal recital */}
        <p style={{ fontSize: 12, lineHeight: 1.8, color: "#1E293B", textAlign: "justify", marginBottom: 14 }}>
          This is to certify that <strong style={{ color: "#0F172A" }}>Dr. {posting.studentName}</strong>,
          bearing Roll Number <strong>{posting.regNo}</strong>, of the MBBS 2021 CBME batch at
          Yenepoya Medical College, has satisfactorily completed the compulsory rotatory medical
          internship posting in the Department of
          {" "}<strong style={{ color: "#0B5345" }}>{posting.deptName}</strong>{" "}
          (Block {posting.blockId}) for a duration of <strong>{posting.weeks} week{posting.weeks > 1 ? "s" : ""}</strong>.
        </p>

        {/* Posting details table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, marginBottom: 18, fontSize: 11 }}>
          <tbody>
            <Row label="Department" value={`${posting.deptName} (${posting.deptShort})`} />
            <Row label="Block / Rotation" value={`Block ${posting.blockId}`} />
            <Row label="Posting Duration" value={`${posting.weeks} week${posting.weeks > 1 ? "s" : ""}`} />
            <Row label="Posting Start Date" value={fmtDate(posting.startDate)} />
            <Row label="Posting End Date" value={fmtDate(posting.endDate)} />
            <Row label="Approved Leave Days" value={`${posting.approvedLeaveDays} day(s)`} />
            <Row label="Effective End Date" value={fmtDate(posting.effectiveEndDate)} />
            <Row label="Casual Leave Policy" value={`Up to ${posting.allowedLeaveDays} day(s) per NMC norms`} />
          </tbody>
        </table>

        <p style={{ fontSize: 11, lineHeight: 1.7, color: "#334155", marginBottom: 24 }}>
          The intern has met the minimum 80% attendance requirement and submitted logbook entries
          for the posting period. This certificate is issued for record purposes and as evidence
          of completion of the said department posting.
        </p>

        {/* Signature block */}
        <table style={{ width: "100%", marginTop: 32, fontSize: 10 }}>
          <tbody>
            <tr>
              <td style={{ width: "33%", textAlign: "center", paddingTop: 40 }}>
                <div style={{ borderTop: "1.5px solid #334155", paddingTop: 4 }}>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>Head of Department</div>
                  <div style={{ color: "#64748B" }}>Dept. of {posting.deptName}</div>
                </div>
              </td>
              <td style={{ width: "34%", textAlign: "center", paddingTop: 40 }}>
                <div style={{ borderTop: "1.5px solid #334155", paddingTop: 4 }}>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>CRMI Coordinator</div>
                  <div style={{ color: "#64748B" }}>Yenepoya Medical College</div>
                </div>
              </td>
              <td style={{ width: "33%", textAlign: "center", paddingTop: 40 }}>
                <div style={{ borderTop: "1.5px solid #334155", paddingTop: 4 }}>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{PRINCIPAL_NAME}</div>
                  <div style={{ color: "#64748B" }}>Principal, Yenepoya Medical College</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Generation timestamp footer */}
        <div style={{ marginTop: 36, paddingTop: 10, borderTop: "1px dashed #cbd5e1", fontSize: 8, color: "#64748B", textAlign: "center" }}>
          <div>
            Document generated by the YMC CRMI Portal on{" "}
            <strong>{now ? fmtDateTime(now) : ""}</strong>
            {released && releasedAt && (
              <> · Released on <strong>{fmtDateTime(releasedAt)}</strong>{auto ? " (auto-released)" : ""}</>
            )}
          </div>
          <div style={{ marginTop: 4 }}>
            This is a system-generated PDF. Authenticity may be verified at
            <strong> ymc-crmi-portal.vercel.app/verify/{certRef.split("/").pop()}</strong>
          </div>
        </div>
      </main>

      <div className="h-10" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ border: "1px solid #E2E8F0", padding: "8px 12px", fontWeight: 600, color: "#475569", background: "#F8FAFC", width: "38%" }}>
        {label}
      </td>
      <td style={{ border: "1px solid #E2E8F0", padding: "8px 12px", color: "#0F172A" }}>{value}</td>
    </tr>
  );
}
