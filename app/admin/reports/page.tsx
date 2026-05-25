import PrintReportButton from "@/components/PrintReportButton";
import { BLOCKS, START_DATE, buildAssignments, currentWeekIndex, getWeekDates } from "@/lib/rotation";

type DeptCount = { code: string; short: string; name: string; count: number };

export default function ReportsPage() {
  const assignments = buildAssignments();
  const weekIdx = currentWeekIndex();
  const week = getWeekDates(weekIdx);
  const generatedAt = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const deptReports = BLOCKS.flatMap((block) =>
    block.depts.map((dept) => ({
      block,
      dept,
      students: assignments
        .filter((assignment) =>
          assignment.rotation.some((posting) => posting.weekIdx === weekIdx && posting.deptCode === dept.code)
        )
        .sort((a, b) => a.student.regNo.localeCompare(b.student.regNo)),
    }))
  );

  const monthReports = buildMonthReports(assignments);

  return (
    <div className="print-page space-y-6">
      <section className="card print-card overflow-hidden">
        <div className="brand-panel relative p-6 text-white md:p-8">
          <div className="geo-overlay absolute inset-0 opacity-70" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-cyan-100">
                Yenepoya Medical College - CRMI Coordination Cell
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Principal Report Pack</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-50/90">
                Block-wise, department-wise and month-wise student posting information for letters,
                e-mail attachments and official documentation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <PrintReportButton />
            </div>
          </div>
        </div>
        <div className="grid gap-3 border-t border-slate-200/70 bg-white/90 p-4 text-sm sm:grid-cols-3">
          <ReportMeta label="Batch" value="MBBS 2021 CBME" />
          <ReportMeta label="Current week" value={`W${weekIdx + 1}: ${week.label}`} />
          <ReportMeta label="Generated" value={generatedAt} />
        </div>
      </section>

      <section className="card print-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">Block-wise Student Allotment</h2>
            <p className="text-sm text-slate-500">Use this section for block letters and principal summaries.</p>
          </div>
          <span className="badge bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">{assignments.length} interns</span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {BLOCKS.map((block) => {
            const students = assignments
              .filter((assignment) => assignment.blockId === block.id)
              .sort((a, b) => a.subBatch.localeCompare(b.subBatch) || a.student.regNo.localeCompare(b.student.regNo));
            return (
              <div key={block.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-950">{block.title}</h3>
                    <p className="text-xs text-slate-500">{students.length} students assigned</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    {block.depts.map((dept) => (
                      <span key={dept.code} className={`dept-chip ${dept.color}`}>{dept.short}</span>
                    ))}
                  </div>
                </div>
                <ReportTable
                  headers={["Reg No", "Student", "Sub-batch"]}
                  rows={students.map((assignment) => [
                    assignment.student.regNo,
                    assignment.student.name,
                    assignment.subBatch,
                  ])}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="card print-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">Department-wise Allotment</h2>
            <p className="text-sm text-slate-500">Current schedule snapshot for W{weekIdx + 1}: {week.label}.</p>
          </div>
          <span className="badge bg-teal-50 text-teal-700 ring-1 ring-teal-100">Week report</span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {deptReports.map(({ block, dept, students }) => (
            <div key={dept.code} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`dept-chip ${dept.color}`}>{dept.short}</span>
                  <h3 className="mt-2 font-bold text-slate-950">{dept.name}</h3>
                  <p className="text-xs text-slate-500">Block {block.id} - {students.length} students</p>
                </div>
                <span className="badge bg-slate-100 text-slate-600">CL: {dept.casualLeaveDays === "Nil" ? "Nil" : `${dept.casualLeaveDays}d`}</span>
              </div>
              <ReportTable
                headers={["Reg No", "Student", "Batch"]}
                rows={students.map((assignment) => [
                  assignment.student.regNo,
                  assignment.student.name,
                  assignment.subBatch,
                ])}
                empty="No students posted in this department for the selected week."
              />
            </div>
          ))}
        </div>
      </section>

      <section className="card print-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">Month-wise Posting Summary</h2>
            <p className="text-sm text-slate-500">A compact monthly index for e-mails, letters and file notes.</p>
          </div>
          <span className="badge bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">12 months</span>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Month</th>
                <th className="px-3 py-2">Weeks covered</th>
                <th className="px-3 py-2">Date range</th>
                <th className="px-3 py-2">Largest department allocations</th>
              </tr>
            </thead>
            <tbody>
              {monthReports.map((month) => (
                <tr key={month.label} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2 font-semibold text-slate-950">{month.label}</td>
                  <td className="px-3 py-2">{month.weeks}</td>
                  <td className="px-3 py-2 text-slate-600">{month.range}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {month.topDepartments.map((dept) => (
                        <span key={`${month.label}-${dept.code}`} className="badge bg-slate-100 text-slate-700">
                          {dept.short}: {dept.count}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ReportMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="mt-1 font-bold text-slate-950">{value}</div>
    </div>
  );
}

function ReportTable({
  headers,
  rows,
  empty = "No records.",
}: {
  headers: string[];
  rows: string[][];
  empty?: string;
}) {
  return (
    <div className="mt-3 max-h-[520px] overflow-auto rounded-xl border border-slate-200 print:max-h-none print:overflow-visible">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-slate-50 text-slate-500 print:static">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-3 py-4 text-center text-slate-500">{empty}</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`${row.join("-")}-${index}`} className="border-t border-slate-100">
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className={cellIndex === 0 ? "px-3 py-1.5 font-mono" : "px-3 py-1.5"}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function buildMonthReports(assignments: ReturnType<typeof buildAssignments>) {
  return Array.from({ length: 12 }, (_, monthOffset) => {
    const monthStart = new Date(START_DATE.getFullYear(), START_DATE.getMonth() + monthOffset, 1);
    const monthEnd = new Date(START_DATE.getFullYear(), START_DATE.getMonth() + monthOffset + 1, 0);
    const weekIndexes = Array.from({ length: 52 }, (_, idx) => idx).filter((idx) => {
      const week = getWeekDates(idx);
      return week.start <= monthEnd && week.end >= monthStart;
    });

    const counts = new Map<string, DeptCount>();
    for (const weekIdx of weekIndexes) {
      for (const assignment of assignments) {
        const posting = assignment.rotation.find((item) => item.weekIdx === weekIdx);
        if (!posting) continue;
        const current = counts.get(posting.deptCode) || {
          code: posting.deptCode,
          short: posting.deptShort,
          name: posting.deptName,
          count: 0,
        };
        current.count += 1;
        counts.set(posting.deptCode, current);
      }
    }

    const firstWeek = getWeekDates(weekIndexes[0]);
    const lastWeek = getWeekDates(weekIndexes[weekIndexes.length - 1]);

    return {
      label: monthStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      weeks: weekIndexes.map((idx) => `W${idx + 1}`).join(", "),
      range: `${formatShortDate(firstWeek.start)} to ${formatShortDate(lastWeek.end)}`,
      topDepartments: Array.from(counts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
    };
  });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
