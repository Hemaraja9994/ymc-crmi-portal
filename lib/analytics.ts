import {
  buildAssignments,
  Assignment,
  currentWeekIndex,
  getWeekDates,
  isPreLaunch,
  TOTAL_WEEKS,
  deptByCode,
  BLOCKS,
} from "./rotation";
import { buildAssignmentsJul2026 } from "./batch-jul2026";

export type PostingSegment = {
  deptCode: string;
  deptName: string;
  deptShort: string;
  color: string;
  startWeek: number;
  endWeek: number;
  startLabel: string;
  endLabel: string;
  weeks: number;
};

// Compress 52 week-cells into contiguous posting segments.
// Dates are scoped to the assignment's own batch (falls back to main batch when absent).
export function postingSegments(a: Assignment): PostingSegment[] {
  const start = a.batchStart;
  const segs: PostingSegment[] = [];
  let cur: PostingSegment | null = null;
  for (let i = 0; i < TOTAL_WEEKS; i++) {
    const cell = a.rotation.find((r) => r.weekIdx === i)!;
    if (!cur || cur.deptCode !== cell.deptCode) {
      if (cur) segs.push(cur);
      const wk = getWeekDates(i, start);
      cur = {
        deptCode: cell.deptCode,
        deptName: cell.deptName,
        deptShort: cell.deptShort,
        color: cell.color,
        startWeek: i,
        endWeek: i,
        startLabel: wk.label.split(" – ")[0],
        endLabel: wk.label.split(" – ")[1],
        weeks: 1,
      };
    } else {
      const wk = getWeekDates(i, start);
      cur.endWeek = i;
      cur.endLabel = wk.label.split(" – ")[1];
      cur.weeks += 1;
    }
  }
  if (cur) segs.push(cur);
  return segs;
}

export function categorizeSegments(segs: PostingSegment[], today = new Date(), batchStart?: Date) {
  const wk = currentWeekIndex(today, batchStart);
  return {
    completed: segs.filter((s) => s.endWeek < wk),
    current: segs.find((s) => s.startWeek <= wk && s.endWeek >= wk) || null,
    upcoming: segs.filter((s) => s.startWeek > wk),
  };
}

export function studentsInDeptThisWeek(deptCode: string, week = currentWeekIndex()) {
  return buildAssignments().filter((a) =>
    a.rotation.some((r) => r.weekIdx === week && r.deptCode === deptCode)
  );
}

export function studentsInBlock(blockId: number) {
  return buildAssignments().filter((a) => a.blockId === blockId);
}

// ── Combined (both batches) helpers ──────────────────────────────────────────
// Main 2021 CBME batch + July 2026 batch. Each batch is evaluated at ITS OWN
// current week (they start on different dates), so "posted this week" stays
// accurate. Assignments carry batchId/batchLabel/batchStart for UI labelling.
export function allAssignments(): Assignment[] {
  return [...buildAssignments(), ...buildAssignmentsJul2026()];
}

// Block roster is structural (which interns belong to a block) — include both batches.
export function studentsInBlockAll(blockId: number): Assignment[] {
  return allAssignments().filter((a) => a.blockId === blockId);
}

// Who is posted in a department right now, across both batches (each at its own week).
export function studentsInDeptThisWeekAll(deptCode: string, today = new Date()): Assignment[] {
  return allAssignments().filter((a) => {
    if (isPreLaunch(today, a.batchStart)) return false; // batch not started yet
    const wk = currentWeekIndex(today, a.batchStart);
    return a.rotation.some((r) => r.weekIdx === wk && r.deptCode === deptCode);
  });
}

// Department head-count right now, across both batches (each at its own week).
export function departmentDistributionAll(today = new Date()): Record<string, number> {
  const out: Record<string, number> = {};
  for (const b of BLOCKS) for (const d of b.depts) out[d.code] = 0;
  for (const a of allAssignments()) {
    if (isPreLaunch(today, a.batchStart)) continue;
    const wk = currentWeekIndex(today, a.batchStart);
    const cell = a.rotation.find((r) => r.weekIdx === wk);
    if (cell) out[cell.deptCode] = (out[cell.deptCode] || 0) + 1;
  }
  return out;
}

export function deptWeeklyHistory(deptCode: string) {
  const out: number[] = [];
  for (let w = 0; w < TOTAL_WEEKS; w++) {
    out.push(
      buildAssignments().filter((a) =>
        a.rotation.some((r) => r.weekIdx === w && r.deptCode === deptCode)
      ).length
    );
  }
  return out;
}

export function allDepts() {
  return BLOCKS.flatMap((b) => b.depts.map((d) => ({ ...d, block: b.id })));
}

export function deptInfo(code: string) {
  return deptByCode(code);
}
