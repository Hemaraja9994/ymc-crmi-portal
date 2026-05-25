import { notFound } from "next/navigation";
import {
  findAssignmentByCampusId,
  getWeekDates,
  currentWeekIndex,
  TOTAL_WEEKS,
  deptByCode,
} from "@/lib/rotation";
import StudentDashboard from "@/components/StudentDashboard";

export default function StudentPage({ params }: { params: { id: string } }) {
  const a = findAssignmentByCampusId(decodeURIComponent(params.id));
  if (!a) notFound();
  const week = currentWeekIndex();
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => ({
    idx: i,
    ...getWeekDates(i),
    cell: a.rotation.find((r) => r.weekIdx === i)!,
  }));
  const current = weeks[week];
  const next = weeks[Math.min(TOTAL_WEEKS - 1, week + 1)];

  return (
    <StudentDashboard
      assignment={JSON.parse(JSON.stringify(a))}
      weeks={JSON.parse(JSON.stringify(weeks))}
      current={JSON.parse(JSON.stringify(current))}
      next={JSON.parse(JSON.stringify(next))}
      currentDeptName={deptByCode(current.cell.deptCode)?.name || ""}
    />
  );
}
