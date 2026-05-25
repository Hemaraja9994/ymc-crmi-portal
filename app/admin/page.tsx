import AdminDashboard from "@/components/AdminDashboard";
import {
  buildAssignments,
  departmentDistribution,
  currentWeekIndex,
  getWeekDates,
  BLOCKS,
} from "@/lib/rotation";
import { ADMINS } from "@/lib/admins";

export default function AdminPage() {
  const all = buildAssignments();
  const week = currentWeekIndex();
  const dist = departmentDistribution(week);
  const wk = getWeekDates(week);
  return (
    <AdminDashboard
      assignments={JSON.parse(JSON.stringify(all))}
      dist={dist}
      blocks={BLOCKS}
      admins={ADMINS}
      currentWeek={{ idx: week, label: wk.label }}
    />
  );
}
