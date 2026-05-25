import AdminOverview from "@/components/AdminOverview";
import {
  buildAssignments,
  departmentDistribution,
  currentWeekIndex,
  getWeekDates,
  BLOCKS,
} from "@/lib/rotation";

export default function Page() {
  const all = buildAssignments();
  const week = currentWeekIndex();
  const dist = departmentDistribution(week);
  const wk = getWeekDates(week);
  return (
    <AdminOverview
      assignments={JSON.parse(JSON.stringify(all))}
      dist={dist}
      blocks={JSON.parse(JSON.stringify(BLOCKS))}
      currentWeek={{ idx: week, label: wk.label }}
    />
  );
}
