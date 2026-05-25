import Roster from "@/components/Roster";
import { buildAssignments, BLOCKS, currentWeekIndex, getWeekDates } from "@/lib/rotation";

export default function Page() {
  const wk = currentWeekIndex();
  return (
    <Roster
      assignments={JSON.parse(JSON.stringify(buildAssignments()))}
      blocks={JSON.parse(JSON.stringify(BLOCKS))}
      currentWeek={{ idx: wk, label: getWeekDates(wk).label }}
    />
  );
}
