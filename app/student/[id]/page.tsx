import { notFound } from "next/navigation";
import {
  getWeekDates,
  currentWeekIndex,
  TOTAL_WEEKS,
  deptByCode,
  isPreLaunch,
  daysUntilStart,
  lifecycleStatus,
} from "@/lib/rotation";
import { findAssignmentUnified } from "@/lib/find-assignment";
import { postingSegments, categorizeSegments } from "@/lib/analytics";
import StudentDashboard from "@/components/StudentDashboard";

export default function StudentPage({ params }: { params: { id: string } }) {
  const a = findAssignmentUnified(decodeURIComponent(params.id));
  if (!a) notFound();
  const today = new Date();
  const start = a.batchStart;
  const week = currentWeekIndex(today, start);
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => ({
    idx: i,
    ...getWeekDates(i, start),
    cell: a.rotation.find((r) => r.weekIdx === i)!,
  }));
  const segments = postingSegments(a);
  const cats = categorizeSegments(segments, today, start);
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
      lifecycle={lifecycleStatus(today, start)}
      preLaunch={isPreLaunch(today, start)}
      daysToStart={daysUntilStart(today, start)}
    />
  );
}
