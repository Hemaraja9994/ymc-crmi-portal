import LeaveInbox from "@/components/LeaveInbox";
import { buildAssignments, BLOCKS, currentWeekIndex } from "@/lib/rotation";

export default function Page() {
  return (
    <LeaveInbox
      assignments={JSON.parse(JSON.stringify(buildAssignments()))}
      blocks={JSON.parse(JSON.stringify(BLOCKS))}
      currentWeek={currentWeekIndex()}
    />
  );
}
