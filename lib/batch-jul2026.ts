// 2nd Batch of Internship — July 2026
// Ref: YMC/1377/2026 dated 24.07.2026
// Effective: 27.07.2026 → 26.07.2027 (52 weeks)
// Source: 2021 supplementary batch.xlsx + batchwise distribution notice dated 24.07.2026.
// Shares the Block I–IV dept structure and rotation algorithm with the main batch.

import { addDays, format } from "date-fns";
import { BLOCKS, type Assignment } from "./rotation";
import type { Student } from "./students";

export type Jul2026Student = {
  slNo: number;
  name: string;
  regNo: string;
  campusId: string;
  subBatch: string; // e.g. "A1", "B13"
};

// Same shape as the main-batch Assignment so the shared student view can render it unchanged.
export type Jul2026Assignment = Assignment;

export const BATCH_JUL2026 = {
  id: "2021-cbme-jul2026",
  label: "2nd Batch of Internship — July 2026",
  shortLabel: "Jul 2026 Batch",
  reference: "YMC/1377/2026 dated 24.07.2026",
  startDate: new Date(2026, 6, 27), // 27 July 2026 (month is 0-indexed)
  endDate: new Date(2027, 6, 26),   // 26 July 2027
  totalWeeks: 52,
  orientationDate: new Date(2026, 6, 27),
  orientationVenue: "Lecture Hall-5, Academic Block, YMC · 09:00 hrs",
} as const;

// ── Batch-wise distribution of interns (from official notice, 24.07.2026) ──
const RAW: Array<[string, string, string]> = [
  // [name, regNo, subBatch]
  ["Abdulla", "21M005", "A1"],
  ["Adarsh V A", "21M006", "A2"],
  ["Affan Anwar Sait", "21M008", "A3"],
  ["Aiswariya Raphael", "21M010", "A4"],
  ["Farhan Sabu", "21M037", "A5"],
  ["Fayiz Mohammed Shaheer", "21M046", "A6"],
  ["Hani Fathima", "21M050", "A7"],
  ["Kadeejath Mahek", "21M061", "A8"],
  ["Muhammed Farzeen", "21M086", "A9"],
  ["Nahla Sherin K V", "21M091", "A10"],
  ["Nandana R S", "21M092", "A11"],
  ["Nihal Narendra Tilve", "21M095", "A12"],
  ["Patel Mohd Avesh Arif", "21M104", "A12"],
  ["Rabiya Pareed", "21M105", "A13"],
  ["Rajalakshmi R", "21M107", "A13"],
  ["Reem Khan", "21M110", "B1"],
  ["Salman Ahmad", "21M113", "B2"],
  ["Sana Salahudheen", "21M115", "B3"],
  ["Sayyed Mohammed Hisham", "21M121", "B4"],
  ["Sehar Yaqoob", "21M122", "B5"],
  ["Shadab Neyazi", "21M123", "B6"],
  ["Shaharban C H", "21M124", "B7"],
  ["Shahima T K", "21M125", "B8"],
  ["Shamik Ali Baramy", "21M126", "B9"],
  ["Shantanu Shrivastsa", "21M127", "B10"],
  ["Shetty Disharani Jagadish", "21M131", "B11"],
  ["Shivani Devanand Bejai", "21M133", "B12"],
  ["Varsha", "21M149", "B13"],
  ["Vinod", "21M150", "B13"],
  ["Ayisha Usman", "20M037", "B13"],
];

export const STUDENTS_JUL2026: Jul2026Student[] = RAW.map(([name, regNo, subBatch], i) => ({
  slNo: i + 1,
  name,
  regNo,
  campusId: regNo,
  subBatch,
}));

// ── Rotation engine ──
// Same algorithm as main batch: within a sub-batch's block, dept sequence is shifted by
// (subBatchNum - 1). A-groups start at Block I, B-groups at Block II, then rotate quarterly.
export function getWeekDates(weekIdx: number): { start: Date; end: Date; label: string } {
  const start = addDays(BATCH_JUL2026.startDate, weekIdx * 7);
  const end = addDays(start, 6);
  return { start, end, label: `${format(start, "dd.MM.yyyy")} – ${format(end, "dd.MM.yyyy")}` };
}

function parseSubBatch(sb: string): { group: "A" | "B"; num: number } {
  const g = sb[0] as "A" | "B";
  const n = parseInt(sb.slice(1), 10);
  return { group: g, num: n };
}

function buildRotationFor(subBatch: string) {
  const { group, num } = parseSubBatch(subBatch);
  const startBlockIdx = group === "A" ? 0 : 1; // A → Block I, B → Block II
  const weekShift = (num - 1) % 13;
  const fullYear: Jul2026Assignment["rotation"] = [];
  for (let q = 0; q < 4; q++) {
    const block = BLOCKS[(startBlockIdx + q) % 4];
    const blockSeq: { code: string; name: string; short: string; color: string }[] = [];
    for (const d of block.depts) {
      for (let w = 0; w < d.weeks; w++) {
        blockSeq.push({ code: d.code, name: d.name, short: d.short, color: d.color });
      }
    }
    const shifted = blockSeq.map((_, i) => blockSeq[(i + weekShift) % blockSeq.length]);
    for (let w = 0; w < 13; w++) {
      const item = shifted[w];
      fullYear.push({
        weekIdx: q * 13 + w,
        deptCode: item.code,
        deptName: item.name,
        deptShort: item.short,
        color: item.color,
      });
    }
  }
  return fullYear;
}

export function buildAssignmentsJul2026(): Jul2026Assignment[] {
  return STUDENTS_JUL2026.map((s) => {
    const { group } = parseSubBatch(s.subBatch);
    const blockId = (group === "A" ? 1 : 2) as 1 | 2 | 3 | 4;
    // Adapt Jul2026Student → Student shape expected by the shared Assignment type.
    const asStudent: Student = {
      slNo: s.slNo,
      name: s.name,
      regNo: s.regNo,
      campusId: s.campusId,
    };
    return {
      student: asStudent,
      blockId,
      subBatch: s.subBatch,
      rotation: buildRotationFor(s.subBatch),
      batchStart: BATCH_JUL2026.startDate,
      batchId: BATCH_JUL2026.id,
      batchLabel: BATCH_JUL2026.label,
    };
  });
}

export function currentWeekIndexJul2026(today = new Date()): number {
  const ms = today.getTime() - BATCH_JUL2026.startDate.getTime();
  const wk = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, Math.min(BATCH_JUL2026.totalWeeks - 1, wk));
}

export function isPreLaunchJul2026(today = new Date()): boolean {
  return today.getTime() < BATCH_JUL2026.startDate.getTime();
}

export function daysUntilJul2026Start(today = new Date()): number {
  return Math.max(0, Math.ceil((BATCH_JUL2026.startDate.getTime() - today.getTime()) / 86_400_000));
}

// ── Timeline milestones (from Timeline docx dated 24.07.2026) ──
export const JUL2026_TIMELINE = [
  { label: "Orientation Programme", date: "27.07.2026", note: "09:00 hrs · Lecture Hall-5, Academic Block, YMC" },
  { label: "Internship commencement", date: "27.07.2026" },
  { label: "Internship completion", date: "26.07.2027" },
  { label: "Tentative graduation day", date: "19.06.2027" },
  { label: "Clinical skill assessment exams", date: "31.07.2027" },
];

export const JUL2026_HOSTEL_RULES = [
  { window: "Hostel during internship", dates: "27.07.2026 – 26.07.2027", note: "Standard allotment" },
  { window: "Grace period", dates: "27.07.2027 – 26.08.2027", note: "Free of extra charge" },
  { window: "On payment basis", dates: "27.08.2027 – 26.09.2027", note: "Chargeable as per YDU rules" },
  { window: "No hostel accommodation", dates: "From 27.09.2027", note: "Even on payment" },
];

export const JUL2026_DUTY_HOURS = [
  { duty: "Daily work hours in the hospital", timings: "08:00 – 16:00" },
  { duty: "Extended (depending on unit/dept need)", timings: "16:00 – 19:00" },
  { duty: "Stay duty (major depts — Med, Surg, OBG, Paeds)", timings: "19:00 – 08:00" },
  { duty: "Bus — hospital → hostel", timings: "19:00 & 20:00 (per notice dated 14.07.2025)" },
];

export function findJul2026Student(query: string): Jul2026Student | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return STUDENTS_JUL2026.find(
    (s) =>
      s.regNo.toLowerCase() === q ||
      s.campusId.toLowerCase() === q ||
      s.name.toLowerCase() === q
  );
}
