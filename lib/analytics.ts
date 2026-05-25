import {
  buildAssignments,
  Assignment,
  currentWeekIndex,
  getWeekDates,
  TOTAL_WEEKS,
  deptByCode,
  BLOCKS,
} from "./rotation";

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
export function postingSegments(a: Assignment): PostingSegment[] {
  const segs: PostingSegment[] = [];
  let cur: PostingSegment | null = null;
  for (let i = 0; i < TOTAL_WEEKS; i++) {
    const cell = a.rotation.find((r) => r.weekIdx === i)!;
    if (!cur || cur.deptCode !== cell.deptCode) {
      if (cur) segs.push(cur);
      const wk = getWeekDates(i);
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
      const wk = getWeekDates(i);
      cur.endWeek = i;
      cur.endLabel = wk.label.split(" – ")[1];
      cur.weeks += 1;
    }
  }
  if (cur) segs.push(cur);
  return segs;
}

export function categorizeSegments(segs: PostingSegment[], today = new Date()) {
  const wk = currentWeekIndex(today);
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
