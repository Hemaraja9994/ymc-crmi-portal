import { ClipboardCheck, IdCard, HeartPulse, BookOpen, FileText, Wallet, Award, Download } from "lucide-react";

// Mandatory requirements — sourced from the Internship Notice (30.05.2026).
export default function MandatoryRequirements() {
  return (
    <section className="card overflow-hidden">
      {/* Brand-panel banner header (matches Block III / IV headings) */}
      <div className="brand-panel relative px-5 py-4 text-white overflow-hidden">
        <div className="geo-overlay absolute inset-0 opacity-50" />
        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <ClipboardCheck size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold tracking-tight">Before You Begin — Mandatory Requirements</h2>
              <p className="text-xs text-xcel-100/80">Complete these around the start of internship (Notice, 30.05.2026).</p>
            </div>
          </div>
          <a href="/regulations/notice.pdf" target="_blank" rel="noopener noreferrer"
             className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25">
            <Download size={13} /> Notice PDF
          </a>
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <ReqCard icon={<IdCard size={18} className="text-xcel-600" />} title="Provisional KMC Registration"
          body="Register provisionally with Karnataka Medical Council within a week of the final MBBS result. Fee ₹3,800 (10th marks card, Aadhaar/Voter ID, photo). Contact the Academic Cell — Ext. 2005." />
        <ReqCard icon={<HeartPulse size={18} className="text-rose-600" />} title="BLS & ACLS (AHA Certified)"
          body="Mandatory for all interns within 2 months of starting. Interns who do not complete it are NOT eligible for internship completion." />
        <ReqCard icon={<BookOpen size={18} className="text-amber-600" />} title="Manual & Log Book"
          body="Purchase the Resident-cum-Nurses / Resident Manual and the Log Book from the Campus General Store before starting." />
        <ReqCard icon={<FileText size={18} className="text-emerald-600" />} title="Joining Report — Day 1"
          body="Submit the Joining Report to the Principal, YMC on the first day; a copy to the Medical Superintendent and then to the concerned HOD." />
        <ReqCard icon={<Wallet size={18} className="text-indigo-600" />} title="Clear Pending Fees"
          body="Clear any pending fee dues on or before 01.06.2026, failing which you will not be permitted to attend the CRMI programme." />
        <ReqCard icon={<Award size={18} className="text-amber-600" />} title="Clinical Skill Assessment"
          body="Undergo the Clinical Skill Assessment (11 & 12 June 2027) before the internship completion certificate is issued." />
      </div>
    </section>
  );
}

function ReqCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-50 ring-1 ring-slate-100">{icon}</div>
        <h3 className="font-bold text-sm text-slate-900 leading-tight">{title}</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
