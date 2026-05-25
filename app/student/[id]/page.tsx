import { notFound } from "next/navigation";
import {
  findAssignmentByCampusId,
  getWeekDates,
  currentWeekIndex,
  TOTAL_WEEKS,
  deptByCode,
  isPreLaunch,
  daysUntilStart,
  lifecycleStatus,
} from "@/lib/rotation";
import { postingSegments, categorizeSegments } from "@/lib/analytics";
import StudentDashboard from "@/components/StudentDashboard";

export default function StudentPage({ params }: { params: { id: string } }) {
  const a = findAssignmentByCampusId(decodeURIComponent(params.id));
  if (!a) notFound();
  const today = new Date();
  const week = currentWeekIndex(today);
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => ({
    idx: i,
    ...getWeekDates(i),
    cell: a.rotation.find((r) => r.weekIdx === i)!,
  }));
  const segments = postingSegments(a);
  const cats = categorizeSegments(segments, today);
  return (
    <StudentDashboard
      assignment={JSON.parse(JSON.stringify(a))}
      weeks={JSON.parse(JSON.stringify(weeks))}
      currentWeek={JSON.parse(JSON.stringify(weeks[week]))}
      nextWeek={JSON.parse(JSON.stringify(weeks[Math.min(TOTAL_WEEKS - 1, week + 1)]))}
      currentDeptName={deptByCode(weeks[week].cell.deptCode)?.name || ""}
      segments={JSON.parse(JSON.stringify(segments))}
      completed={JSON.parse(JSON.stringify(cats.completed))}
      currentSeg={JSON.parse(JSON.stringify(cats.current))}
      upcoming={JSON.parse(JSON.stringify(cats.upcoming))}
      lifecycle={lifecycleStatus(today)}
      preLaunch={isPreLaunch(today)}
      daysToStart={daysUntilStart(today)}
    />
  );
}
