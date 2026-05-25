// CRMI Posting Rotation Engine — MBBS 2021 CBME Batch
// Effective: 01.06.2026 to 31.05.2027 (52 weeks total)
// Based on NMC notification UGMEB/NMC/RULES & REGULATIONS/2021 dated 18.11.2021
// and YMC's Block I-IV structure used for the MBBS 2020 batch.

import { STUDENTS, Student } from "./students";
import { addDays, format } from "date-fns";

export type Dept = {
  code: string;
  name: string;
  short: string;
  weeks: number;
  color: string; // tailwind classes
  casualLeaveDays: number | "Nil";
};

export type Block = {
  id: 1 | 2 | 3 | 4;
  title: string;
  depts: Dept[];
};

// Each block totals 13 weeks → 52 weeks across 4 blocks.
export const BLOCKS: Block[] = [
  {
    id: 1,
    title: "Block I",
    depts: [
      { code: "GMED", name: "General Medicine", short: "Gen.Med", weeks: 6, color: "bg-red-100 text-red-800", casualLeaveDays: 2 },
      { code: "ENT", name: "Otorhinolaryngology (ENT)", short: "ENT", weeks: 2, color: "bg-amber-100 text-amber-800", casualLeaveDays: 1 },
      { code: "OPH", name: "Ophthalmology", short: "Ophth", weeks: 2, color: "bg-emerald-100 text-emerald-800", casualLeaveDays: 1 },
      { code: "PSY", name: "Psychiatry", short: "Psych", weeks: 2, color: "bg-violet-100 text-violet-800", casualLeaveDays: 0 },
      { code: "GER", name: "Geriatric Medicine", short: "Geriat", weeks: 1, color: "bg-slate-100 text-slate-800", casualLeaveDays: "Nil" },
    ],
  },
  {
    id: 2,
    title: "Block II",
    depts: [
      { code: "GSUR", name: "General Surgery", short: "Gen.Surg", weeks: 6, color: "bg-blue-100 text-blue-800", casualLeaveDays: 2 },
      { code: "ANAE", name: "Anaesthesiology & Critical Care", short: "Anaes", weeks: 2, color: "bg-cyan-100 text-cyan-800", casualLeaveDays: 2 },
      { code: "ORTH", name: "Orthopaedics incl. PMR", short: "Ortho", weeks: 2, color: "bg-orange-100 text-orange-800", casualLeaveDays: 0 },
      { code: "EMED", name: "Emergency / Trauma / Casualty", short: "Emerg", weeks: 2, color: "bg-rose-100 text-rose-800", casualLeaveDays: 0 },
      { code: "RAD", name: "Radiodiagnosis", short: "Radio", weeks: 1, color: "bg-stone-100 text-stone-800", casualLeaveDays: "Nil" },
    ],
  },
  {
    id: 3,
    title: "Block III",
    depts: [
      { code: "COM", name: "Community Medicine", short: "Com.Med", weeks: 12, color: "bg-teal-100 text-teal-800", casualLeaveDays: 4 },
      { code: "RES", name: "Respiratory Medicine", short: "Resp", weeks: 1, color: "bg-sky-100 text-sky-800", casualLeaveDays: "Nil" },
    ],
  },
  {
    id: 4,
    title: "Block IV",
    depts: [
      { code: "OBG", name: "OBG incl. Family Welfare", short: "OBG", weeks: 7, color: "bg-pink-100 text-pink-800", casualLeaveDays: 2 },
      { code: "PED", name: "Paediatrics", short: "Paeds", weeks: 3, color: "bg-indigo-100 text-indigo-800", casualLeaveDays: 1 },
      { code: "DVL", name: "Dermatology, Venereology & Leprosy", short: "DVL", weeks: 1, color: "bg-fuchsia-100 text-fuchsia-800", casualLeaveDays: "Nil" },
      { code: "FOR", name: "Forensic Medicine & Toxicology", short: "Forensic", weeks: 1, color: "bg-yellow-100 text-yellow-800", casualLeaveDays: "Nil" },
      { code: "LAB", name: "Lab Medicine", short: "Lab", weeks: 1, color: "bg-lime-100 text-lime-800", casualLeaveDays: "Nil" },
    ],
  },
];

export const START_DATE = new Date(2026, 5, 1); // June 1 2026 (month is 0-indexed)
export const TOTAL_WEEKS = 52;

export function getWeekDates(weekIdx: number): { start: Date; end: Date; label: string } {
  const start = addDays(START_DATE, weekIdx * 7);
  const end = addDays(start, 6);
  return {
    start,
    end,
    label: `${format(start, "dd.MM.yyyy")} – ${format(end, "dd.MM.yyyy")}`,
  };
}

// Distribute 113 students across 4 blocks. Sub-batches: A1..A13, B1..B13, C1..C13, D1..D13.
// Each block has 13 sub-batches; students are assigned to sub-batches round-robin within their block.
export type Assignment = {
  student: Student;
  blockId: 1 | 2 | 3 | 4;
  subBatch: string; // e.g. "A1"
  rotation: { weekIdx: number; deptCode: string; deptName: string; deptShort: string; color: string }[];
};

const BLOCK_LETTERS = ["A", "B", "C", "D"] as const;

export function buildAssignments(): Assignment[] {
  const n = STUDENTS.length;
  const perBlock = Math.ceil(n / 4);
  return STUDENTS.map((s, i) => {
    const blockIdx = Math.min(3, Math.floor(i / perBlock));
    const blockId = (blockIdx + 1) as 1 | 2 | 3 | 4;
    const withinBlock = i - blockIdx * perBlock;
    const subBatchNum = (withinBlock % 13) + 1;
    const subBatch = `${BLOCK_LETTERS[blockIdx]}${subBatchNum}`;
    return {
      student: s,
      blockId,
      subBatch,
      rotation: buildRotation(blockId, weekOffsetFromSubBatch(subBatchNum)),
    };
  });
}

// Each block runs its dept rotation across its own 13-week chunk of the calendar.
// To stagger sub-batches inside a block, we cyclically shift the dept sequence
// based on the sub-batch number.
function weekOffsetFromSubBatch(subBatchNum: number): number {
  return (subBatchNum - 1) % 13;
}

function buildRotation(blockId: 1 | 2 | 3 | 4, weekShift: number) {
  const block = BLOCKS.find((b) => b.id === blockId)!;
  // Expand: build the linear dept-week sequence within the block (length 13).
  const seq: { code: string; name: string; short: string; color: string }[] = [];
  for (const d of block.depts) {
    for (let w = 0; w < d.weeks; w++) {
      seq.push({ code: d.code, name: d.name, short: d.short, color: d.color });
    }
  }
  // Sub-batch rotates the sequence so each sub-batch starts at a different dept.
  const rotated = seq.map((_, i) => seq[(i + weekShift) % seq.length]);

  // Map onto the calendar: block 1 occupies weeks 0-12, block 2 → 13-25, etc.
  // BUT all four blocks run in parallel — each block's interns spend their full year
  // inside their block's dept set. So we tile each block across all 52 weeks by repeating
  // (this matches the previous batch where Blocks I-IV ran concurrently, not sequentially).
  // To occupy 52 weeks, we repeat the 13-week sequence 4 times (one repetition per quarter)
  // so an intern in Block I cycles Gen Med→ENT→Ophth→…→Geriat → and then continues with
  // the NEXT block's sequence (Blocks rotate quarterly across all interns).
  const fullYear: { weekIdx: number; deptCode: string; deptName: string; deptShort: string; color: string }[] = [];
  // Quarter sequence — each intern visits all 4 blocks, starting at their own block.
  const startBlockIdx = blockId - 1;
  for (let q = 0; q < 4; q++) {
    const b = BLOCKS[(startBlockIdx + q) % 4];
    const blockSeq: typeof rotated = [];
    for (const d of b.depts) for (let w = 0; w < d.weeks; w++)
      blockSeq.push({ code: d.code, name: d.name, short: d.short, color: d.color });
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

export function findAssignmentByCampusId(campusId: string): Assignment | undefined {
  const all = buildAssignments();
  return all.find((a) => a.student.campusId.toLowerCase() === campusId.toLowerCase());
}

export function currentWeekIndex(today = new Date()): number {
  const ms = today.getTime() - START_DATE.getTime();
  const wk = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, Math.min(TOTAL_WEEKS - 1, wk));
}

export function isPreLaunch(today = new Date()): boolean {
  return today.getTime() < START_DATE.getTime();
}

export function isCompleted(today = new Date()): boolean {
  const end = new Date(START_DATE);
  end.setDate(end.getDate() + TOTAL_WEEKS * 7);
  return today.getTime() >= end.getTime();
}

export function daysUntilStart(today = new Date()): number {
  return Math.max(0, Math.ceil((START_DATE.getTime() - today.getTime()) / 86_400_000));
}

export function lifecycleStatus(today = new Date()): "pre-launch" | "active" | "completed" {
  if (isPreLaunch(today)) return "pre-launch";
  if (isCompleted(today)) return "completed";
  return "active";
}

// Aggregate: # students currently posted in each dept (for HR-style analytics).
// Returns all-zeros before the internship start date.
export function departmentDistribution(weekIdx: number, today = new Date()): Record<string, number> {
  if (isPreLaunch(today)) {
    const z: Record<string, number> = {};
    for (const b of BLOCKS) for (const d of b.depts) z[d.code] = 0;
    return z;
  }
  const out: Record<string, number> = {};
  for (const a of buildAssignments()) {
    const cell = a.rotation.find((r) => r.weekIdx === weekIdx);
    if (!cell) continue;
    out[cell.deptCode] = (out[cell.deptCode] || 0) + 1;
  }
  return out;
}

export function deptByCode(code: string): Dept | undefined {
  for (const b of BLOCKS) for (const d of b.depts) if (d.code === code) return d;
  return undefined;
}
