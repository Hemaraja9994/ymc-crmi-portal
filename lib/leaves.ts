import { STUDENTS } from "./students";

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
function iso(daysFromToday: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export const SEED_LEAVES: LeaveRecord[] = [
  { id: "l1", regNo: STUDENTS[2]?.regNo || "21M003", type: "Medical", from: iso(-1), to: iso(2), reason: "Viral fever — MC attached", status: "Approved", submittedAt: iso(-3), doc: "mc_21m003.pdf" },
  { id: "l2", regNo: STUDENTS[7]?.regNo || "21M012", type: "Casual", from: iso(0), to: iso(1), reason: "Personal", status: "Pending", submittedAt: iso(-1) },
  { id: "l3", regNo: STUDENTS[15]?.regNo || "21M021", type: "Emergency", from: iso(-2), to: iso(0), reason: "Family emergency", status: "Approved", submittedAt: iso(-2) },
  { id: "l4", regNo: STUDENTS[30]?.regNo || "21M035", type: "Academic", from: iso(3), to: iso(4), reason: "Conference presentation", status: "Pending", submittedAt: iso(0) },
  { id: "l5", regNo: STUDENTS[42]?.regNo || "21M053", type: "Casual", from: iso(-5), to: iso(-4), reason: "Personal work", status: "Rejected", submittedAt: iso(-7) },
  { id: "l6", regNo: STUDENTS[55]?.regNo || "21M070", type: "Medical", from: iso(0), to: iso(3), reason: "Suspected dengue — under observation", status: "Approved", submittedAt: iso(-1), doc: "mc_21m070.pdf" },
];

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
