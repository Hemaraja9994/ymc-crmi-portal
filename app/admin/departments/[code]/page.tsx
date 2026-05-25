import { notFound } from "next/navigation";
import {
  deptByCode,
  currentWeekIndex,
  getWeekDates,
  TOTAL_WEEKS,
} from "@/lib/rotation";
import { studentsInDeptThisWeek, deptWeeklyHistory } from "@/lib/analytics";
import DeptDetail from "@/components/DeptDetail";

export default function Page({ params }: { params: { code: string } }) {
  const dept = deptByCode(params.code);
  if (!dept) notFound();
  const wk = currentWeekIndex();
  const wkInfo = getWeekDates(wk);
  const roster = studentsInDeptThisWeek(params.code, wk);
  const history = deptWeeklyHistory(params.code);
  return (
    <DeptDetail
      dept={JSON.parse(JSON.stringify(dept))}
      currentWeek={{ idx: wk, label: wkInfo.label }}
      roster={JSON.parse(JSON.stringify(roster))}
      history={history}
      totalWeeks={TOTAL_WEEKS}
    />
  );
}
