// Leave records — restructured per CRMI committee decision:
//
//   CL    : Casual Leave — within sanctioned departmental entitlement.
//           Does NOT extend the posting.
//   Ad.L  : Additional Leave — beyond sanctioned CL. Posting is extended
//           by the SAME number of approved days.
//   Absent: Unauthorized absence (no permission). Posting is extended by
//           DOUBLE the number of absent days.
//
// Students can no longer apply for leave themselves — only Coordinators
// record leaves on a student's behalf (the form lives in /admin/leaves).
//
// Persistence: localStorage in this build; replace with Postgres/KV
// once institutional auth is wired up.

export type LeaveType = "CL" | "Ad.L" | "Absent";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type LeaveRecord = {
  id: string;
  regNo: string;
  type: LeaveType;
  from: string;       // ISO date (yyyy-mm-dd)
  to: string;
  reason: string;
  status: LeaveStatus;
  submittedAt: string;
  recordedBy?: string;  // coordinator username who recorded it
  deptCode?: string;    // posting context at time of leave
  doc?: string;         // supporting document filename (medical etc.)
};

// Optional alias retained so existing UI imports don't break.
export type LeaveCategory = "Retroactive" | "Advance";

// Per-type metadata: label, description, extension factor (×days), display colour.
// extensionFactor is the multiplier applied to approved days when computing
// the effective posting end date for the completion certificate.
export const LEAVE_TYPE_META: Record<LeaveType, {
  label: string;
  short: string;
  description: string;
  extensionFactor: 0 | 1 | 2;
  color: string;
}> = {
  "CL": {
    label: "Casual Leave",
    short: "CL",
    description: "Sanctioned leave within departmental entitlement. No posting extension.",
    extensionFactor: 0,
    color: "bg-sky-100 text-sky-800 ring-sky-200",
  },
  "Ad.L": {
    label: "Additional Leave",
    short: "Ad.L",
    description: "Leave beyond the sanctioned CL limit. Posting is extended by the same number of days.",
    extensionFactor: 1,
    color: "bg-amber-100 text-amber-800 ring-amber-200",
  },
  "Absent": {
    label: "Unauthorized Absent",
    short: "Absent",
    description: "Without permission. Posting is extended by DOUBLE the number of absent days.",
    extensionFactor: 2,
    color: "bg-rose-100 text-rose-800 ring-rose-200",
  },
};

// Legacy alias maintained so any leftover UI imports still resolve.
export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  "CL":     LEAVE_TYPE_META["CL"].color,
  "Ad.L":   LEAVE_TYPE_META["Ad.L"].color,
  "Absent": LEAVE_TYPE_META["Absent"].color,
};

export const SEED_LEAVES: LeaveRecord[] = [];

const STORE_KEY = "ymc_leaves_v2";       // bumped from v1 — incompatible schema
const LEGACY_KEY = "ymc_leaves_v1";

// Map old (v1) leave types → new (v2) types.
function migrateLegacyType(t: string): LeaveType {
  if (t === "Casual") return "CL";
  if (t === "Medical" || t === "Emergency" || t === "Bereavement" || t === "Academic") return "Ad.L";
  // Anything we don't recognise → Ad.L as the safer default (extends by 1×).
  return "Ad.L";
}

export function loadLeaves(): LeaveRecord[] {
  if (typeof window === "undefined") return SEED_LEAVES;
  try {
    // v2 first
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as LeaveRecord[];
    // One-time migration from v1
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated: LeaveRecord[] = (JSON.parse(legacy) as any[]).map((l) => ({
        id: l.id,
        regNo: l.regNo,
        type: migrateLegacyType(l.type),
        from: l.from,
        to: l.to,
        reason: l.reason,
        status: l.status,
        submittedAt: l.submittedAt,
        doc: l.doc,
      }));
      window.localStorage.setItem(STORE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    window.localStorage.setItem(STORE_KEY, JSON.stringify(SEED_LEAVES));
    return SEED_LEAVES;
  } catch {
    return SEED_LEAVES;
  }
}

export function saveLeaves(l: LeaveRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(l));
}

export function isOnLeave(regNo: string, leaves: LeaveRecord[], onDate = new Date()): LeaveRecord | undefined {
  const d = onDate.toISOString().slice(0, 10);
  return leaves.find(
    (l) => l.regNo === regNo && l.status === "Approved" && l.from <= d && l.to >= d
  );
}

// Count POSTING-EXTENSION days for a student in a [start, end] window,
// applying the per-type extensionFactor. Approved CL adds 0, Ad.L adds 1×,
// Absent adds 2×.
export function computePostingExtensionDays(
  regNo: string,
  startISO: string,
  endISO: string,
  leaves: LeaveRecord[],
): number {
  let total = 0;
  for (const l of leaves) {
    if (l.regNo !== regNo || l.status !== "Approved") continue;
    const from = l.from > startISO ? l.from : startISO;
    const to = l.to < endISO ? l.to : endISO;
    if (from > to) continue;
    const days = Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000) + 1;
    total += days * LEAVE_TYPE_META[l.type].extensionFactor;
  }
  return total;
}
