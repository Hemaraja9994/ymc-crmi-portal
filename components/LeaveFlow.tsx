import { PenLine, Stamp, ClipboardSignature, UserCheck, MonitorCheck, ArrowDown, AlertTriangle } from "lucide-react";

// Leave application & approval flow — on-screen flowchart for the
// Leave & Attendance page. Mirrors the printed handout.
type Step = {
  n: number;
  who: string;
  act: string;
  det: string;
  icon: React.ReactNode;
  ring: string;   // ring/border colour
  badge: string;  // number badge bg/text
  bar: string;    // left accent bar
};

const STEPS: Step[] = [
  {
    n: 1,
    who: "Intern (Student)",
    act: "Write the Casual Leave application",
    det: "Fill the leave form with dates, number of days, reason and current posting / department.",
    icon: <PenLine size={18} />,
    ring: "border-blue-200",
    badge: "bg-blue-600",
    bar: "bg-blue-500",
  },
  {
    n: 2,
    who: "Head of Unit (HOU)",
    act: "Get the application signed by the HOU",
    det: "The unit head verifies the duty-roster impact and signs the application.",
    icon: <Stamp size={18} />,
    ring: "border-cyan-200",
    badge: "bg-cyan-600",
    bar: "bg-cyan-500",
  },
  {
    n: 3,
    who: "Head of Department (HOD)",
    act: "Get it counter-signed by the HOD",
    det: "The department head approves and counter-signs the leave application.",
    icon: <ClipboardSignature size={18} />,
    ring: "border-violet-200",
    badge: "bg-violet-600",
    bar: "bg-violet-500",
  },
  {
    n: 4,
    who: "Department Internship Coordinator",
    act: "Submit the signed application to the coordinator",
    det: "The intern hands the duly signed application to the department's internship coordinator.",
    icon: <UserCheck size={18} />,
    ring: "border-amber-200",
    badge: "bg-amber-600",
    bar: "bg-amber-500",
  },
  {
    n: 5,
    who: "Department Coordinator → YMC CRMI Portal",
    act: "Register the leave in the portal",
    det: "Coordinator Login → Leaves → + Record Leave: enter the leave details and upload the signed copy. Saved with an audit trail; status appears on the intern's dashboard.",
    icon: <MonitorCheck size={18} />,
    ring: "border-emerald-200",
    badge: "bg-emerald-600",
    bar: "bg-emerald-500",
  },
];

export default function LeaveFlow() {
  return (
    <section className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60">
        <h2 className="font-extrabold text-slate-900">Leave Application &amp; Approval Flow</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          How an intern applies for leave and how it gets recorded in the portal.
        </p>
      </div>

      <div className="p-5 md:p-6">
        <ol className="mx-auto max-w-2xl">
          {STEPS.map((s, i) => (
            <li key={s.n}>
              <div className={`relative flex items-start gap-4 rounded-2xl border bg-white p-4 shadow-sm ${s.ring}`}>
                <span className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl ${s.bar}`} />
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white font-extrabold ${s.badge}`}>
                  {s.n}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <span className="text-slate-500">{s.icon}</span> {s.who}
                  </div>
                  <div className="mt-0.5 font-bold text-slate-900">{s.act}</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.det}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-1.5 text-slate-300">
                  <ArrowDown size={18} />
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* Key points */}
        <div className="mt-5 mx-auto max-w-2xl rounded-xl border-l-4 border-orange-400 bg-orange-50/70 px-4 py-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800">
            <AlertTriangle size={14} /> Key points
          </div>
          <ul className="mt-1 space-y-1 text-xs text-orange-900/90">
            <li>• Leave must be applied for <strong>in advance</strong> with prior approval.</li>
            <li>• Interns <strong>cannot self-apply in the portal</strong> — only the department coordinator records it after the signed approval.</li>
            <li>• Maximum <strong>15 casual-leave days</strong> across the 365-day internship.</li>
            <li>• Once recorded, the status (Pending / Approved / Rejected) is visible on the intern&apos;s dashboard.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
