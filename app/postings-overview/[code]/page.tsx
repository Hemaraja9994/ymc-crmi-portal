import { notFound } from "next/navigation";
import {
  buildAssignments,
  deptByCode,
  getWeekDates,
  TOTAL_WEEKS,
  currentWeekIndex,
  isPreLaunch,
} from "@/lib/rotation";
import DeptYearView from "@/components/DeptYearView";

export default function Page({ params }: { params: { code: string } }) {
  const dept = deptByCode(params.code);
  if (!dept) notFound();
  const all = buildAssignments();

  // Per week, who's in this dept (with sub-batch + block).
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const inDept = all.filter((a) =>
      a.rotation.some((r) => r.weekIdx === i && r.deptCode === params.code)
    );
    const subBatches = Array.from(
      new Set(inDept.map((a) => a.subBatch))
    ).sort();
    return {
      idx: i,
      ...getWeekDates(i),
      students: inDept.map((a) => ({
        regNo: a.student.regNo,
        name: a.student.name,
        blockId: a.blockId,
        subBatch: a.subBatch,
      })),
      subBatches,
    };
  });

  return (
    <DeptYearView
      dept={JSON.parse(JSON.stringify(dept))}
      weeks={JSON.parse(JSON.stringify(weeks))}
      currentWeek={isPreLaunch() ? -1 : currentWeekIndex()}
    />
  );
}
