import { notFound } from "next/navigation";
import { BLOCKS, currentWeekIndex, getWeekDates } from "@/lib/rotation";
import { studentsInBlock } from "@/lib/analytics";
import BlockDetail from "@/components/BlockDetail";

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const block = BLOCKS.find((b) => b.id === id);
  if (!block) notFound();
  const wk = currentWeekIndex();
  const wkLabel = getWeekDates(wk).label;
  return (
    <BlockDetail
      block={JSON.parse(JSON.stringify(block))}
      students={JSON.parse(JSON.stringify(studentsInBlock(id)))}
      currentWeek={{ idx: wk, label: wkLabel }}
    />
  );
}
