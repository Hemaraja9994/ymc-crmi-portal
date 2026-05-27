import { BLOCKS } from "@/lib/rotation";
import {
  HeartPulse,
  Ear,
  Eye,
  Brain,
  Activity,
  Scissors,
  Wind,
  Bone,
  Siren,
  ScanLine,
  Users,
  Stethoscope,
  Baby,
  Sparkles,
  TestTube2,
  ShieldCheck,
  BookOpen,
  Award,
  Sparkles as Glint,
  Gavel,
  Clock,
  AlertTriangle,
  Ban,
  FileText,
  UserCheck,
  Shirt,
  Home,
  ClipboardCheck,
} from "lucide-react";

const DEPT_ICONS: Record<string, React.ReactNode> = {
  GMED: <HeartPulse size={18} />,
  ENT: <Ear size={18} />,
  OPH: <Eye size={18} />,
  PSY: <Brain size={18} />,
  GER: <Activity size={18} />,
  GSUR: <Scissors size={18} />,
  ANAE: <Wind size={18} />,
  ORTH: <Bone size={18} />,
  EMED: <Siren size={18} />,
  RAD: <ScanLine size={18} />,
  COM: <Users size={18} />,
  RES: <Stethoscope size={18} />,
  OBG: <Stethoscope size={18} />,
  PED: <Baby size={18} />,
  DVL: <Sparkles size={18} />,
  FOR: <BookOpen size={18} />,
  LAB: <TestTube2 size={18} />,
};

export default function GuidelinesPage() {
  const totalWeeks = BLOCKS.reduce((s, b) => s + b.depts.reduce((x, d) => x + d.weeks, 0), 0);
  const totalDepts = BLOCKS.reduce((s, b) => s + b.depts.length, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="rounded-3xl relative overflow-hidden brand-panel text-white p-6 md:p-10">
        <div className="geo-overlay absolute inset-0 opacity-60" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-xcel-100">
            <Glint size={14} /> CBME Compliance
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Internship Guidelines</h1>
          <p className="mt-3 max-w-2xl text-xcel-100/90 text-sm md:text-base">
            Postings follow the NMC notification <strong>UGMEB/NMC/RULES &amp; REGULATIONS/2021</strong> dated
            18.11.2021. The Compulsory Rotatory Medical Internship Programme for the MBBS 2021 CBME Batch runs for
            <strong> 12 months, w.e.f. 01.06.2026</strong>.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
            <Stat label="Weeks" value={totalWeeks} />
            <Stat label="Blocks" value={4} />
            <Stat label="Departments" value={totalDepts} />
            <Stat label="Months" value={12} />
          </div>
        </div>
      </header>

      {/* Blocks */}
      <section className="grid md:grid-cols-2 gap-5">
        {BLOCKS.map((b) => (
          <div key={b.id} className="card overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Block header */}
            <div className="brand-panel relative px-6 py-4 text-white overflow-hidden">
              <div className="geo-overlay absolute inset-0 opacity-40" />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-xcel-200">Block {b.id}</div>
                  <h2 className="mt-0.5 text-lg font-extrabold tracking-tight">{b.title}</h2>
                  <div className="mt-1 text-xs text-xcel-100/80">
                    {b.depts.reduce((s, d) => s + d.weeks, 0)} weeks · {b.depts.length} departments
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 grid place-items-center font-extrabold text-2xl text-white backdrop-blur-sm">
                  {b.id}
                </div>
              </div>
            </div>
            {/* Department list */}
            <ul className="divide-y divide-slate-100 px-2">
              {b.depts.map((d) => (
                <li key={d.code} className="py-2.5 px-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-xcel-100 text-xcel-800 grid place-items-center shrink-0">
                    {DEPT_ICONS[d.code] || <Stethoscope size={16} />}
                  </div>
                  <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                    <span className={`dept-chip ${d.color}`}>{d.short}</span>
                    <span className="font-medium text-sm truncate">{d.name}</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-400 shrink-0 bg-slate-50 px-2 py-0.5 rounded-full">{d.weeks}w</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Assessment */}
      <section className="grid md:grid-cols-3 gap-4">
        <InfoCard
          icon={<BookOpen className="text-xcel-600" />}
          title="Logbook"
          body="All interns must maintain a CBME logbook. Each posting requires weekly entries countersigned by the unit head before moving on."
        />
        <InfoCard
          icon={<ShieldCheck className="text-emerald-600" />}
          title="Continuous Assessment"
          body="Per NMC guidelines, continuous assessment runs throughout the year. End-of-posting skills review is mandatory."
        />
        <InfoCard
          icon={<Award className="text-amber-600" />}
          title="Final Assessment"
          body="A clinical-skills assessment by a panel of senior faculty in March/April 2027 is required for the Completion Certificate."
        />
      </section>

      {/* ─── Internship Training Rules & Code of Conduct ───────────────── */}
      <CodeOfConduct />
    </div>
  );
}

// Office of the Principal, YMC — issued 19.03.2022, applicable to the MBBS
// 2021 CBME batch onwards. Transcribed faithfully from the official circular.
function CodeOfConduct() {
  return (
    <section id="rules" className="card overflow-hidden">
      {/* Header band */}
      <div className="brand-panel relative px-6 py-5 text-white overflow-hidden">
        <div className="geo-overlay absolute inset-0 opacity-50" />
        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-xcel-100">
              <Gavel size={12} /> Office of the Principal, YMC · 19.03.2022
            </div>
            <h2 className="mt-1 text-xl md:text-2xl font-extrabold tracking-tight">
              Internship Training Rules &amp; Code of Conduct
            </h2>
            <p className="mt-1 text-xs text-xcel-100/80">
              Applicable to the MBBS 2021 CBME batch and all subsequent batches.
              Signed by the Principal, Yenepoya Medical College, Mangaluru – 575 018.
            </p>
          </div>
          <div className="hidden md:block text-right text-[11px] text-xcel-100/80 leading-snug">
            <div>To: All Interns</div>
            <div>Copy: All HODs &amp; MS YMCH</div>
          </div>
        </div>
      </div>

      {/* Key emphasis callouts — the rules students miss most */}
      <div className="grid sm:grid-cols-3 gap-3 p-5 bg-slate-50/60 border-b border-slate-100">
        <KeyRule
          icon={<Clock className="text-rose-700" size={18} />}
          tone="rose"
          title="15-day leave cap"
          body="Maximum 15 days of leave with prior approval across the ENTIRE 365-day internship. No other leave is permissible."
        />
        <KeyRule
          icon={<AlertTriangle className="text-amber-700" size={18} />}
          tone="amber"
          title="Doubling rule"
          body="Any emergency / additional leave beyond the 15-day cap is at the discretion of authorities and will be doubled when computing posting extension."
        />
        <KeyRule
          icon={<Shirt className="text-indigo-700" size={18} />}
          tone="indigo"
          title="₹ 1,000 fine"
          body="Charged from any intern not wearing the white coat AND identification badge on duty. HODs / MS YMCH are authorised to recommend the fine."
        />
      </div>

      {/* The 12 rules + assessment block */}
      <ol className="divide-y divide-slate-100">
        <Rule n={1} icon={<Home size={16} />} title="Residential Programme">
          Medical Internship is a <strong>24-hour residential programme</strong>. All interns shall stay in their
          respective hostels and may leave only after seeking proper approval from the competent authority
          (HOD / MS).
        </Rule>

        <Rule n={2} icon={<Clock size={16} />} title="Duration & Leave Sanction">
          The internship duration is <strong>one complete year (365 days)</strong>. Interns are permitted a maximum
          of <strong>15 days of leave</strong> with prior approval during the entire internship period — no other
          leave is permissible.
          <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900">
            <strong>Excess leave:</strong> If leave exceeds the sanctioned limit, the internship is liable to be
            extended at the discretion of the authority. In emergencies, any additional leave will be at the
            authorities' discretion <strong>and will be doubled</strong>. This corresponds to the portal's
            <em> Absent (2×)</em> extension rule.
          </div>
        </Rule>

        <Rule n={3} icon={<ClipboardCheck size={16} />} title="Attendance — Twice Daily">
          Attendance is marked / monitored by the HOD and the Medical Superintendent, YMCH, who maintain
          the intern attendance register. Interns shall mark attendance with their full initials (specimen
          signature filed with HODs &amp; MS) a <strong>minimum of two times a day — 8:00 AM and 4:00 PM</strong>.
          <div className="mt-2 text-xs text-slate-500">
            Routine and evening / night duties shall additionally be recorded in the department register
            maintained by the MS, YMCH.
          </div>
        </Rule>

        <Rule n={4} icon={<UserCheck size={16} />} title="Temporary State Council Registration">
          All medical interns must obtain a <strong>temporary registration from the state medical council</strong>
          before commencing internship.
        </Rule>

        <Rule n={5} icon={<Clock size={16} />} title="Duty Hours">
          Routine duties are observed between <strong>8:00 AM and 4:00 PM</strong>. Evening and night duties
          follow the roster devised by the department. <em>No change in duty</em> is permissible without the
          permission of the Unit Head / HOD and prior intimation to MS YMCH.
        </Rule>

        <Rule n={6} icon={<Users size={16} />} title="Professional Conduct">
          Medical interns shall be <strong>courteous, polite, respectful and sympathetic</strong> towards patients,
          their accompanying attendants, hospital staff and colleagues. Interns shall maintain decorum,
          commitment, discipline of the profession, and show keen interest in patient care.
        </Rule>

        <Rule n={7} icon={<Stethoscope size={16} />} title="Clinical Responsibility">
          Interns will be entrusted with clinical responsibilities <strong>under the supervision of a faculty
          member or Senior Medical Officer</strong> and are expected to discharge assigned duties sincerely and
          effectively.
        </Rule>

        <Rule n={8} icon={<Ban size={16} />} title="Certification Limits">
          Interns are <strong>not authorised</strong> to issue Medical Certificates, Death Certificates or
          sign any Medico-Legal Document.
        </Rule>

        <Rule n={9} icon={<Shirt size={16} />} title="Dress Code & Identification">
          During hospital posting, interns shall wear a <strong>white apron with the name badge</strong> and
          always carry the articles required for patient examination.
          <div className="mt-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-900">
            <strong>Penalty:</strong> A fine of <strong>₹ 1,000</strong> will be charged from interns not using
            the white coat and identification card on duty. HODs and MS YMCH are authorised to recommend the
            action.
          </div>
        </Rule>

        <Rule n={10} icon={<Ban size={16} />} title="Substance Use Prohibition">
          <strong>Smoking, drinking alcoholic beverages, or drug abuse is strictly prohibited</strong> on the
          campus.
        </Rule>

        <Rule n={11} icon={<Ban size={16} />} title="No Outside Practice">
          Interns shall <strong>not work in any other hospital, nursing home or private clinic</strong> —
          whether honorary or on payment, full-time or part-time. Any deviation will be viewed seriously
          and strict disciplinary action under the rules shall be taken against the defaulting intern.
        </Rule>

        <Rule n={12} icon={<Award size={16} />} title="Assessment of Internship">
          Assessment of the intern's work is carried out by <strong>each department the intern is posted in</strong>,
          based on their performance using the model assessment sheet provided in the <em>Log Book</em>.
          <div className="mt-2 text-xs text-slate-600 leading-relaxed">
            Performance during each posting, conduct, and final assessment of competencies gained are
            taken into account when issuing the <strong>certificate of satisfactory completion of training</strong>.
            The university then considers the award of the MBBS degree (or declares the candidate eligible).
          </div>
        </Rule>
      </ol>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4 text-xs text-slate-600 flex flex-wrap justify-between gap-2">
        <div>
          <strong>Issued:</strong> 19.03.2022 · <strong>Authority:</strong> Principal, Yenepoya Medical College, Mangaluru – 575 018
        </div>
        <div className="text-slate-500 italic">
          Effective from MBBS 2021 CBME batch (w.e.f. 01.06.2026) onwards.
        </div>
      </div>
    </section>
  );
}

function KeyRule({ icon, tone, title, body }: { icon: React.ReactNode; tone: "rose" | "amber" | "indigo"; title: string; body: string }) {
  const styles = {
    rose:   "border-rose-200 bg-rose-50/60",
    amber:  "border-amber-200 bg-amber-50/60",
    indigo: "border-indigo-200 bg-indigo-50/60",
  } as const;
  return (
    <div className={`rounded-xl border p-3 ${styles[tone]}`}>
      <div className="flex items-center gap-2">
        {icon}
        <div className="font-bold text-sm text-slate-900">{title}</div>
      </div>
      <p className="mt-1 text-[11.5px] leading-snug text-slate-700">{body}</p>
    </div>
  );
}

function Rule({ n, icon, title, children }: { n: number; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <li className="px-6 py-4 flex gap-3 md:gap-4 items-start hover:bg-xcel-50/30 transition">
      {/* Number badge */}
      <div className="shrink-0 w-8 h-8 rounded-full bg-xcel-700 text-white grid place-items-center text-sm font-bold">
        {n}
      </div>
      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
          <span className="text-xcel-700">{icon}</span> {title}
        </div>
        <div className="mt-1 text-sm text-slate-700 leading-relaxed">
          {children}
        </div>
      </div>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/10 ring-1 ring-white/15 p-3 backdrop-blur">
      <div className="text-[10px] uppercase tracking-wider text-xcel-100">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}
