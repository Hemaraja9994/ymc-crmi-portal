// Department-wise CRMI Posting Completion Certificate logic.
// — Auto-release the day after (posting end date + approved leave days) passes.
// — Coordinator can override with "Hold" (e.g. pending logbook sign-off).
// — Records persisted to localStorage (mock DB).

import { addDays } from "date-fns";
import { Assignment, BLOCKS, getWeekDates } from "./rotation";
import { LeaveRecord, loadLeaves, LEAVE_TYPE_META, computePostingExtensionDays } from "./leaves";

export type PostingPeriod = {
  key: string;              // `${regNo}:${deptCode}` — stable across blocks for now
  regNo: string;
  studentName: string;
  blockId: number;
  deptCode: string;
  deptName: string;
  deptShort: string;
  deptColor: string;
  startWeekIdx: number;
  endWeekIdx: number;
  startDate: Date;
  endDate: Date;
  weeks: number;
  approvedLeaveDays: number;
  effectiveEndDate: Date;   // endDate + approved leave days during this posting
  allowedLeaveDays: number; // policy cap from BLOCKS config
};

export type CertificateRecord = {
  key: string;
  released?: boolean;
  releasedAt?: string;
  releasedBy?: string;
  onHold?: boolean;
  holdReason?: string;
};

export type CertificateStatus =
  | { kind: "ongoing"; postingProgress: number }
  | { kind: "awaiting-release"; effectiveEndDate: Date }
  | { kind: "released"; releasedAt: string; auto: boolean; releasedBy?: string }
  | { kind: "on-hold"; reason?: string };

const STORE_KEY = "ymc_certificates_v1";

// ── Persistence ─────────────────────────────────────────────────────────────
export function loadCertificateRecords(): CertificateRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CertificateRecord[];
  } catch {
    return [];
  }
}

export function saveCertificateRecords(records: CertificateRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(records));
}

function upsert(records: CertificateRecord[], rec: CertificateRecord): CertificateRecord[] {
  const next = records.filter((r) => r.key !== rec.key);
  next.push(rec);
  return next;
}

export function releaseCertificate(key: string, releasedBy: string): CertificateRecord[] {
  const records = loadCertificateRecords();
  const next = upsert(records, {
    key,
    released: true,
    releasedAt: new Date().toISOString(),
    releasedBy,
    onHold: false,
  });
  saveCertificateRecords(next);
  return next;
}

export function holdCertificate(key: string, reason: string): CertificateRecord[] {
  const records = loadCertificateRecords();
  const next = upsert(records, { key, onHold: true, holdReason: reason, released: false });
  saveCertificateRecords(next);
  return next;
}

export function clearCertificateOverride(key: string): CertificateRecord[] {
  const records = loadCertificateRecords();
  const next = records.filter((r) => r.key !== key);
  saveCertificateRecords(next);
  return next;
}

// ── Posting period extraction from a student's rotation matrix ──────────────
export function getStudentPostings(assignment: Assignment): PostingPeriod[] {
  // Group consecutive weeks of the same dept into a single posting.
  const periods: PostingPeriod[] = [];
  let cursor = 0;
  const rotation = [...assignment.rotation].sort((a, b) => a.weekIdx - b.weekIdx);

  while (cursor < rotation.length) {
    const start = rotation[cursor];
    let end = start;
    let j = cursor + 1;
    while (j < rotation.length && rotation[j].deptCode === start.deptCode && rotation[j].weekIdx === end.weekIdx + 1) {
      end = rotation[j];
      j++;
    }
    const startWeek = getWeekDates(start.weekIdx);
    const endWeek = getWeekDates(end.weekIdx);
    const weeks = end.weekIdx - start.weekIdx + 1;

    // Block lookup → for allowed leave days
    const block = BLOCKS.find((b) => b.depts.some((d) => d.code === start.deptCode));
    const dept = block?.depts.find((d) => d.code === start.deptCode);
    const allowedLeaveDays = typeof dept?.casualLeaveDays === "number" ? dept.casualLeaveDays : 0;

    periods.push({
      key: `${assignment.student.regNo}:${start.deptCode}:${start.weekIdx}`,
      regNo: assignment.student.regNo,
      studentName: assignment.student.name,
      blockId: assignment.blockId,
      deptCode: start.deptCode,
      deptName: start.deptName,
      deptShort: start.deptShort,
      deptColor: start.color,
      startWeekIdx: start.weekIdx,
      endWeekIdx: end.weekIdx,
      startDate: startWeek.start,
      endDate: endWeek.end,
      weeks,
      approvedLeaveDays: 0, // populated by computeCertificateStatus once leaves are read
      effectiveEndDate: endWeek.end,
      allowedLeaveDays,
    });

    cursor = j;
  }
  return periods;
}

// EXTENSION days within [startDate, endDate]: CL=0, Ad.L=1×, Absent=2×.
// Delegates to computePostingExtensionDays so the rule lives in one place.
function extensionDaysFor(
  regNo: string,
  startDate: Date,
  endDate: Date,
  leaves: LeaveRecord[],
): number {
  return computePostingExtensionDays(
    regNo,
    startDate.toISOString().slice(0, 10),
    endDate.toISOString().slice(0, 10),
    leaves,
  );
}

// ── Status computation ─────────────────────────────────────────────────────
export function computeCertificateStatus(
  posting: PostingPeriod,
  today: Date = new Date(),
  leaves: LeaveRecord[] = [],
  records: CertificateRecord[] = [],
): CertificateStatus {
  const approvedDays = extensionDaysFor(posting.regNo, posting.startDate, posting.endDate, leaves);
  const effectiveEnd = addDays(posting.endDate, approvedDays);

  // Apply overrides first
  const rec = records.find((r) => r.key === posting.key);
  if (rec?.onHold) return { kind: "on-hold", reason: rec.holdReason };
  if (rec?.released && rec.releasedAt) {
    return { kind: "released", releasedAt: rec.releasedAt, auto: false, releasedBy: rec.releasedBy };
  }

  // Ongoing if today is on/before the effective end
  if (today.getTime() <= effectiveEnd.getTime()) {
    const totalMs = posting.endDate.getTime() - posting.startDate.getTime();
    const elapsedMs = today.getTime() - posting.startDate.getTime();
    const progress = totalMs > 0 ? Math.max(0, Math.min(1, elapsedMs / totalMs)) : 0;
    return { kind: "ongoing", postingProgress: progress };
  }

  // Past effective end + no override → auto-released as of effective end + 1 day
  const autoReleaseDate = addDays(effectiveEnd, 1);
  return {
    kind: "released",
    releasedAt: autoReleaseDate.toISOString(),
    auto: true,
  };
}

// Helper: enrich a posting with the computed effective end date (for display).
export function enrichPosting(
  posting: PostingPeriod,
  leaves: LeaveRecord[] = [],
): PostingPeriod {
  const approvedDays = extensionDaysFor(posting.regNo, posting.startDate, posting.endDate, leaves);
  return {
    ...posting,
    approvedLeaveDays: approvedDays,
    effectiveEndDate: addDays(posting.endDate, approvedDays),
  };
}

// Convenience: compute all postings for a student with their status today.
export function getStudentCertificateStatuses(
  assignment: Assignment,
  today: Date = new Date(),
): Array<{ posting: PostingPeriod; status: CertificateStatus }> {
  const leaves = loadLeaves();
  const records = loadCertificateRecords();
  return getStudentPostings(assignment)
    .map((p) => enrichPosting(p, leaves))
    .map((p) => ({ posting: p, status: computeCertificateStatus(p, today, leaves, records) }));
}
