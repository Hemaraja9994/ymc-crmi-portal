// Continuity audit — does any student have a SPLIT (discontinuous) posting?
// Runs the real rotation engine and checks, per student per department,
// whether the assigned weeks form one unbroken block.
import { buildAssignments, getWeekDates, deptByCode } from "../lib/rotation";


const assignments = buildAssignments();
console.log(`Total students: ${assignments.length}\n`);

// For a list of weekIdx, return contiguous runs.
function runs(weeks: number[]): number[][] {
  const s = [...weeks].sort((a, b) => a - b);
  const out: number[][] = [];
  let cur: number[] = [];
  for (const w of s) {
    if (cur.length === 0 || w === cur[cur.length - 1] + 1) cur.push(w);
    else { out.push(cur); cur = [w]; }
  }
  if (cur.length) out.push(cur);
  return out;
}

const fmtRun = (r: number[]) => {
  const a = getWeekDates(r[0]).start, b = getWeekDates(r[r.length - 1]).end;
  const d = (x: Date) => `${String(x.getDate()).padStart(2, "0")}.${String(x.getMonth() + 1).padStart(2, "0")}.${x.getFullYear()}`;
  return `wk ${r[0] + 1}-${r[r.length - 1] + 1} (${d(a)}–${d(b)})`;
};

// Per-department discontinuity tally + the detailed GMED list.
const deptSplit: Record<string, number> = {};
const gmedOffenders: { regNo: string; name: string; sub: string; runsDesc: string; gap: number }[] = [];
let anySplitStudents = new Set<string>();

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
      anySplitStudents.add(a.student.regNo);
      if (code === "GMED") {
        const gap = rs[1][0] - rs[0][rs[0].length - 1] - 1; // weeks between the two runs
        gmedOffenders.push({
          regNo: a.student.regNo,
          name: a.student.name,
          sub: a.subBatch,
          runsDesc: rs.map(fmtRun).join("  +  "),
          gap,
        });
      }
    }
  }
}

console.log("=== Discontinuity by department (students with a split posting) ===");
for (const [code, n] of Object.entries(deptSplit).sort((x, y) => y[1] - x[1])) {
  const d = deptByCode(code);
  console.log(`  ${(d?.name || code).padEnd(34)} ${n} students  (${d?.weeks}-week posting)`);
}
console.log(`\nStudents with ANY split posting: ${anySplitStudents.size} of ${assignments.length}`);

console.log(`\n=== GENERAL MEDICINE — discontinuous postings: ${gmedOffenders.length} students ===`);
gmedOffenders.sort((a, b) => a.regNo.localeCompare(b.regNo));
for (const o of gmedOffenders) {
  console.log(`  ${o.regNo}  ${o.name.padEnd(26)} [${o.sub}]  ${o.runsDesc}   gap=${o.gap}w`);
}

// CSV for reporting
import { writeFileSync } from "fs";
const csv = ["RegNo,Name,SubBatch,GMED_Segments,GapWeeks",
  ...gmedOffenders.map(o => `${o.regNo},"${o.name}",${o.sub},"${o.runsDesc}",${o.gap}`)].join("\n");
writeFileSync("/tmp/gmed_discontinuity.csv", csv);
console.log(`\nCSV written: /tmp/gmed_discontinuity.csv`);
