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
      { code: "PSY", name: "Psychiatry", short: "Psych", weeks: 2, color: "bg-violet-100 text-violet-800", casualLeaveDays: "Nil" },
      { code: "GER", name: "Geriatric Medicine", short: "Geriat", weeks: 1, color: "bg-slate-100 text-slate-800", casualLeaveDays: "Nil" },
    ],
  },
  {
    id: 2,
    title: "Block II",
    depts: [
      { code: "GSUR", name: "General Surgery", short: "Gen.Surg", weeks: 6, color: "bg-blue-100 text-blue-800", casualLeaveDays: 2 },
      { code: "ANAE", name: "Anaesthesiology & Critical Care", short: "Anaes", weeks: 2, color: "bg-cyan-100 text-cyan-800", casualLeaveDays: "Nil" },
      { code: "ORTH", name: "Orthopaedics incl. PMR", short: "Ortho", weeks: 2, color: "bg-orange-100 text-orange-800", casualLeaveDays: 1 },
      { code: "EMED", name: "Emergency / Trauma / Casualty", short: "Emerg", weeks: 2, color: "bg-rose-100 text-rose-800", casualLeaveDays: 1 },
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

export function getWeekDates(weekIdx: number, batchStart: Date = START_DATE): { start: Date; end: Date; label: string } {
  const start = addDays(batchStart, weekIdx * 7);
  const end = addDays(start, 6);
  return {
    start,
    end,
    label: `${format(start, "dd.MM.yyyy")} – ${format(end, "dd.MM.yyyy")}`,
  };
}

// Each intern belongs to exactly one sub-batch (A1..A13, B1..B13, C1..C13,
// D1..D13). Sub-batch membership is taken VERBATIM from the signed master file
// (see SUBBATCH_ROSTER below — "LIST OF INTERNS & Batch", Ref: YMC/1368/2026);
// the weekly department rotation is then derived from the sub-batch by
// buildRotation(), which reproduces the master schedule cell-for-cell.
export type Assignment = {
  student: Student;
  blockId: 1 | 2 | 3 | 4;
  subBatch: string; // e.g. "A1"
  rotation: { weekIdx: number; deptCode: string; deptName: string; deptShort: string; color: string }[];
  // Batch context — defaults to the main 2021 CBME batch when absent.
  batchStart?: Date;
  batchId?: string;
  batchLabel?: string;
};

const BLOCK_LETTERS = ["A", "B", "C", "D"] as const;

// ─────────────────────────────────────────────────────────────────────────
// Official sub-batch composition — transcribed VERBATIM from the signed
// "Compulsory Rotatory Medical Internship Programme for MBBS 2021 CBME Batch"
// master file ("LIST OF INTERNS & Batch", Ref: YMC/1368/2026 dated 01.06.2026,
// Principal/Dean YMC). THIS IS THE SINGLE SOURCE OF TRUTH for which intern
// belongs to which sub-batch. Groups A/B/C/D begin the year in Block I/II/III/IV
// respectively; sub-batch numbers 1–13 stagger the dept sequence within a block.
// (Reg-number gaps — e.g. 21M005/06/08 — are interns not in the 2021 CBME list.)
export const SUBBATCH_ROSTER: Record<string, string[]> = {
  A1: ["21M001", "21M002"],
  A2: ["21M003", "21M004"],
  A3: ["21M007", "21M009"],
  A4: ["21M011", "21M012"],
  A5: ["21M013", "21M014"],
  A6: ["21M015", "21M016"],
  A7: ["21M017", "21M019"],
  A8: ["21M020", "21M021"],
  A9: ["21M022", "21M023"],
  A10: ["21M024", "21M025"],
  A11: ["21M026", "21M027"],
  A12: ["21M028", "21M029", "21M030"],
  A13: ["21M031", "21M032", "21M033"],
  B1: ["21M034", "21M035"],
  B2: ["21M036", "21M038"],
  B3: ["21M039", "21M040"],
  B4: ["21M041", "21M042"],
  B5: ["21M043", "21M045"],
  B6: ["21M049", "21M051"],
  B7: ["21M052", "21M053"],
  B8: ["21M054", "21M055"],
  B9: ["21M056", "21M057"],
  B10: ["21M058", "21M059"],
  B11: ["21M060", "21M062"],
  B12: ["21M063", "21M064", "21M065"],
  B13: ["21M066", "21M067", "21M068"],
  C1: ["21M069", "21M070"],
  C2: ["21M071", "21M072"],
  C3: ["21M073", "21M074"],
  C4: ["21M075", "21M076"],
  C5: ["21M077", "21M078"],
  C6: ["21M079", "21M080"],
  C7: ["21M081", "21M082"],
  C8: ["21M083", "21M084"],
  C9: ["21M085", "21M087"],
  C10: ["21M089", "21M090"],
  C11: ["21M093", "21M094"],
  C12: ["21M096", "21M097", "21M098"],
  C13: ["21M099", "21M100", "21M101"],
  D1: ["21M102", "21M103"],
  D2: ["21M106", "21M108"],
  D3: ["21M109", "21M111"],
  D4: ["21M112", "21M114"],
  D5: ["21M116", "21M117"],
  D6: ["21M119", "21M128"],
  D7: ["21M129", "21M130"],
  D8: ["21M132", "21M134"],
  D9: ["21M135", "21M137"],
  D10: ["21M138", "21M139"],
  D11: ["21M140", "21M141", "21M142"],
  D12: ["21M143", "21M144", "21M145"],
  D13: ["21M146", "21M147", "21M148"],
};

// Reverse lookup: regNo → sub-batch (e.g. "21M055" → "B8").
const REGNO_TO_SUBBATCH: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const [sb, regs] of Object.entries(SUBBATCH_ROSTER)) {
    for (const r of regs) m[r] = sb;
  }
  return m;
})();

export function buildAssignments(): Assignment[] {
  return STUDENTS.map((s) => {
    const subBatch = REGNO_TO_SUBBATCH[s.regNo];
    if (!subBatch) {
      // Fail loud: every intern in the official list must have a sub-batch.
      throw new Error(
        `No sub-batch for ${s.regNo} (${s.name}). Reconcile SUBBATCH_ROSTER with the signed master file.`
      );
    }
    const letter = subBatch[0];
    const num = parseInt(subBatch.slice(1), 10);
    const blockId = ((BLOCK_LETTERS as readonly string[]).indexOf(letter) + 1) as 1 | 2 | 3 | 4;
    return {
      student: s,
      blockId,
      subBatch,
      rotation: buildRotation(blockId, weekOffsetFromSubBatch(num)),
      batchStart: START_DATE,
      batchId: "2021-cbme-main",
      batchLabel: "MBBS 2021 CBME",
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

export function currentWeekIndex(today: Date = new Date(), batchStart: Date = START_DATE): number {
  const ms = today.getTime() - batchStart.getTime();
  const wk = Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, Math.min(TOTAL_WEEKS - 1, wk));
}

export function isPreLaunch(today: Date = new Date(), batchStart: Date = START_DATE): boolean {
  return today.getTime() < batchStart.getTime();
}

export function isCompleted(today: Date = new Date(), batchStart: Date = START_DATE): boolean {
  const end = new Date(batchStart);
  end.setDate(end.getDate() + TOTAL_WEEKS * 7);
  return today.getTime() >= end.getTime();
}

export function daysUntilStart(today: Date = new Date(), batchStart: Date = START_DATE): number {
  return Math.max(0, Math.ceil((batchStart.getTime() - today.getTime()) / 86_400_000));
}

export function lifecycleStatus(today: Date = new Date(), batchStart: Date = START_DATE): "pre-launch" | "active" | "completed" {
  if (isPreLaunch(today, batchStart)) return "pre-launch";
  if (isCompleted(today, batchStart)) return "completed";
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
