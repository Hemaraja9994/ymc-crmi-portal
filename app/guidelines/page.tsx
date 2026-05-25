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
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-200">Block {b.id}</div>
                  <h2 className="mt-0.5 text-lg font-extrabold tracking-tight">{b.title}</h2>
                  <div className="mt-1 text-xs text-teal-100/80">
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
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 grid place-items-center shrink-0">
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
    </div>
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
