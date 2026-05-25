export type LeaveType = "Casual" | "Medical" | "Emergency" | "Bereavement" | "Academic";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type LeaveRecord = {
  id: string;
  regNo: string;
  type: LeaveType;
  from: string; // ISO date
  to: string;
  reason: string;
  status: LeaveStatus;
  submittedAt: string;
  doc?: string;
};

export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  Casual: "bg-sky-100 text-sky-800 ring-sky-200",
  Medical: "bg-rose-100 text-rose-800 ring-rose-200",
  Emergency: "bg-orange-100 text-orange-800 ring-orange-200",
  Bereavement: "bg-slate-200 text-slate-800 ring-slate-300",
  Academic: "bg-indigo-100 text-indigo-800 ring-indigo-200",
};

// Seed sample leave records so the admin dashboard is alive on first visit.
// In production, persist to Postgres/Vercel KV.
// Empty by default — the system starts with a clean state.
// Records accumulate as students apply for leave through the portal.
export const SEED_LEAVES: LeaveRecord[] = [];

const STORE_KEY = "ymc_leaves_v1";

export function loadLeaves(): LeaveRecord[] {
  if (typeof window === "undefined") return SEED_LEAVES;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(SEED_LEAVES));
      return SEED_LEAVES;
    }
    return JSON.parse(raw) as LeaveRecord[];
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
