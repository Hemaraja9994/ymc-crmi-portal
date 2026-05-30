import { CalendarClock, Clock, BedDouble, Bus, Download } from "lucide-react";

// Key Dates — sourced from the Internship Timeline circular (2021 batch).
const MILESTONES = [
  { label: "Internship commencement", date: "01 Jun 2026", tone: "emerald" as const },
  { label: "Completion of internship", date: "31 May 2027", tone: "indigo" as const },
  { label: "Clinical Skill Assessment exams", date: "11 & 12 Jun 2027", tone: "amber" as const },
  { label: "Tentative graduation day", date: "19 Jun 2027", tone: "rose" as const },
];

export default function KeyDates() {
  const toneMap = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    indigo: "border-xcel-200 bg-xcel-50 text-xcel-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  } as const;
  return (
    <section className="card overflow-hidden">
      {/* Brand-panel banner header (matches Block III / IV headings) */}
      <div className="brand-panel relative px-5 py-4 text-white overflow-hidden">
        <div className="geo-overlay absolute inset-0 opacity-50" />
        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <CalendarClock size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold tracking-tight">Key Dates &amp; Timeline</h2>
              <p className="text-xs text-xcel-100/80">Milestones for the 2021 batch — Office of the Principal / Dean.</p>
            </div>
          </div>
          <a href="/regulations/timeline-2021-batch.pdf" target="_blank" rel="noopener noreferrer"
             className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25">
            <Download size={13} /> Timeline PDF
          </a>
        </div>
      </div>

      {/* Milestone tiles */}
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {MILESTONES.map((m, i) => (
          <div key={m.label} className={`relative rounded-xl border p-4 ${toneMap[m.tone]}`}>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">Milestone {i + 1}</div>
            <div className="mt-1 text-lg font-extrabold leading-tight">{m.date}</div>
            <div className="mt-1 text-xs font-medium text-slate-600">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Duty timings + hostel + bus */}
      <div className="grid gap-3 px-5 pb-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Clock size={15} className="text-xcel-600" /> Duty Timings
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li><strong>08:00 – 16:00</strong> · daily hospital work hours</li>
            <li><strong>16:00 – 19:00</strong> · as needed by unit / department</li>
            <li><strong>19:00 – 08:00</strong> · stay-duty (Medicine, Surgery, OBG, Paediatrics)</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <BedDouble size={15} className="text-xcel-600" /> Hostel Accommodation
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li><strong>01 Jun 2026 – 31 May 2027</strong> · during internship</li>
            <li><strong>01 – 20 Jun 2027</strong> · grace period</li>
            <li><strong>21 Jun – 15 Jul 2027</strong> · on payment (YDU rules); none after 16 Jul 2027</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Bus size={15} className="text-xcel-600" /> Bus Facility
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Hospital → hostel at <strong>7:00 PM and 8:00 PM</strong>. No additional transport is provided
            (per Notice dated 14.07.2025).
          </p>
        </div>
      </div>
    </section>
  );
}
