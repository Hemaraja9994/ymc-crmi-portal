import { notFound } from "next/navigation";
import {
  deptByCode,
  currentWeekIndex,
  getWeekDates,
  isPreLaunch,
} from "@/lib/rotation";
import { studentsInDeptThisWeek } from "@/lib/analytics";
import HodConsole from "@/components/HodConsole";

export default function Page({ params }: { params: { code: string } }) {
  const dept = deptByCode(params.code);
  if (!dept) notFound();
  const wk = currentWeekIndex();
  return (
    <HodConsole
      dept={JSON.parse(JSON.stringify(dept))}
      roster={JSON.parse(JSON.stringify(studentsInDeptThisWeek(params.code, wk)))}
      currentWeek={{ idx: wk, label: getWeekDates(wk).label }}
      preLaunch={isPreLaunch()}
    />
  );
}
