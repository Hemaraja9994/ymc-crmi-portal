import { notFound } from "next/navigation";
import { currentWeekIndex, getWeekDates } from "@/lib/rotation";
import { findAssignmentUnified } from "@/lib/find-assignment";
import { postingSegments, categorizeSegments } from "@/lib/analytics";
import StudentProfile from "@/components/StudentProfile";

export default function Page({ params }: { params: { regNo: string } }) {
  const a = findAssignmentUnified(decodeURIComponent(params.regNo));
  if (!a) notFound();
  const segs = postingSegments(a);
  const cats = categorizeSegments(segs, new Date(), a.batchStart);
  const wk = currentWeekIndex(new Date(), a.batchStart);
  return (
    <StudentProfile
      assignment={JSON.parse(JSON.stringify(a))}
      completed={JSON.parse(JSON.stringify(cats.completed))}
      current={JSON.parse(JSON.stringify(cats.current))}
      upcoming={JSON.parse(JSON.stringify(cats.upcoming))}
      allSegments={JSON.parse(JSON.stringify(segs))}
      week={{ idx: wk, label: getWeekDates(wk, a.batchStart).label }}
    />
  );
}
