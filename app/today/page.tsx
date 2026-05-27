import DailyPostingsView from "@/components/DailyPostingsView";
import { buildAssignments, BLOCKS, START_DATE } from "@/lib/rotation";

// Department-wise daily/weekly/monthly drill-down. Mobile-first.
// Accessible to anyone visiting /today — students, HODs, Principal.
export default function Page() {
  return (
    <div className="space-y-5">
      <header className="rounded-3xl overflow-hidden brand-panel text-white p-5 md:p-7 relative">
        <div className="geo-overlay absolute inset-0 opacity-60" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-xcel-100">
            Live View
          </div>
          <h1 className="mt-2 text-xl md:text-3xl font-bold tracking-tight">
            Daily Posting View — Department-wise
          </h1>
          <p className="mt-2 text-xcel-100/90 max-w-2xl text-sm">
            Pick a date, choose Day / Week / Month, then tap a department to see exactly
            which interns are posted there. Works on phone and desktop.
          </p>
        </div>
      </header>

      <DailyPostingsView
        assignments={JSON.parse(JSON.stringify(buildAssignments()))}
        blocks={JSON.parse(JSON.stringify(BLOCKS))}
        startDateISO={START_DATE.toISOString().slice(0, 10)}
      />
    </div>
  );
}
