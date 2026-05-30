// Posting-continuity analysis — surfaces any student whose department posting
// is split into non-contiguous weeks. Drives the coordinator "Continuity Check"
// page and is reusable by scripts. Reads the live rotation engine, so it always
// reflects the current schedule.
import { buildAssignments, deptByCode, getWeekDates } from "./rotation";

export type Segment = { startWeek: number; endWeek: number; label: string };
export type StudentSplit = {
  regNo: string;
  name: string;
  subBatch: string;
  deptCode: string;
  deptName: string;
  segments: Segment[];
  gapWeeks: number; // largest gap between consecutive segments
};
export type DeptSplit = { code: string; name: string; weeks: number; count: number };
export type ContinuityReport = {
  totalStudents: number;
  studentsWithAnySplit: number;
  byDept: DeptSplit[];
  gmedSplits: StudentSplit[];
  allSplits: StudentSplit[];
};

function runs(weeks: number[]): number[][] {
  const sorted = [...weeks].sort((a, b) => a - b);
  const out: number[][] = [];
  let cur: number[] = [];
  for (const w of sorted) {
    if (cur.length === 0 || w === cur[cur.length - 1] + 1) cur.push(w);
    else { out.push(cur); cur = [w]; }
  }
  if (cur.length) out.push(cur);
  return out;
}

const seg = (r: number[]): Segment => {
  const a = getWeekDates(r[0]).start;
  const b = getWeekDates(r[r.length - 1]).end;
  const d = (x: Date) =>
    `${String(x.getDate()).padStart(2, "0")}.${String(x.getMonth() + 1).padStart(2, "0")}.${x.getFullYear()}`;
  return { startWeek: r[0] + 1, endWeek: r[r.length - 1] + 1, label: `${d(a)} – ${d(b)}` };
};

export function analyzeContinuity(): ContinuityReport {
  const assignments = buildAssignments();
  const deptSplit: Record<string, number> = {};
  const allSplits: StudentSplit[] = [];
  const gmedSplits: StudentSplit[] = [];
  const splitStudents = new Set<string>();

  for (const a of assignments) {
    const byDept = new Map<string, number[]>();
    for (const r of a.rotation) {
      if (!byDept.has(r.deptCode)) byDept.set(r.deptCode, []);
      byDept.get(r.deptCode)!.push(r.weekIdx);
    }
    for (const [code, weeks] of byDept) {
      const rs = runs(weeks);
      if (rs.length > 1) {
        deptSplit[code] = (deptSplit[code] || 0) + 1;
        splitStudents.add(a.student.regNo);
        let gap = 0;
        for (let i = 1; i < rs.length; i++) gap = Math.max(gap, rs[i][0] - rs[i - 1][rs[i - 1].length - 1] - 1);
        const rec: StudentSplit = {
          regNo: a.student.regNo,
          name: a.student.name,
          subBatch: a.subBatch,
          deptCode: code,
          deptName: deptByCode(code)?.name ?? code,
          segments: rs.map(seg),
          gapWeeks: gap,
        };
        allSplits.push(rec);
        if (code === "GMED") gmedSplits.push(rec);
      }
    }
  }

  const byDept: DeptSplit[] = Object.entries(deptSplit)
    .map(([code, count]) => ({ code, name: deptByCode(code)?.name ?? code, weeks: deptByCode(code)?.weeks ?? 0, count }))
    .sort((a, b) => b.count - a.count);

  gmedSplits.sort((a, b) => a.regNo.localeCompare(b.regNo));
  allSplits.sort((a, b) => a.regNo.localeCompare(b.regNo));

  return {
    totalStudents: assignments.length,
    studentsWithAnySplit: splitStudents.size,
    byDept,
    gmedSplits,
    allSplits,
  };
}
