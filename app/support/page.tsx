import { ADMINS } from "@/lib/admins";
import {
  MessageCircle,
  Mail,
  Phone,
  HeartHandshake,
  Sparkles,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="rounded-3xl overflow-hidden relative brand-panel text-white p-6 md:p-10">
        <div className="geo-overlay absolute inset-0 opacity-60" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-xcel-100">
            <Sparkles size={14} /> Support & Clarifications
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            We&apos;re with you, every posting.
          </h1>
          <p className="mt-3 max-w-2xl text-xcel-100/90 text-sm md:text-base">
            Your internship is a defining year — and you are not navigating it alone. Reach out
            confidentially to any coordinator below for academic, posting, or personal concerns.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 badge bg-white/10 ring-1 ring-white/20 text-white">
              <ShieldCheck size={12} /> Confidential
            </span>
            <span className="inline-flex items-center gap-1 badge bg-white/10 ring-1 ring-white/20 text-white">
              <Clock size={12} /> Same-day response on wellbeing
            </span>
          </div>
        </div>
      </header>

      {/* Coordinator cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADMINS.map((a) => {
          const initials = a.name
            .replace(/^Dr\.\s*/i, "")
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          return (
            <div key={a.name} className="card p-5 hover:shadow-md transition flex flex-col">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-xcel-600 to-xcel-800 text-white grid place-items-center font-bold text-lg shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-semibold leading-tight">{a.name}</div>
                    {a.isPrincipal && (
                      <span className="badge bg-amber-100 text-amber-800 ring-1 ring-amber-200">Principal</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{a.role}</div>
                </div>
              </div>

              {/* Focus areas */}
              {a.focus && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wider text-slate-500">Reach out for</div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {a.focus.map((f) => (
                      <span key={f} className="badge bg-xcel-50 text-xcel-700 ring-1 ring-xcel-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                {a.officeHours && (
                  <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                    <div className="uppercase tracking-wider text-[10px]">Hours</div>
                    <div className="text-slate-700">{a.officeHours}</div>
                  </div>
                )}
                {a.responseSla && (
                  <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                    <div className="uppercase tracking-wider text-[10px]">Response</div>
                    <div className="text-slate-700">{a.responseSla}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <a className="btn-outline justify-center" href="#" aria-label={`Email ${a.name}`}>
                  <Mail size={13} /> Email
                </a>
                <a className="btn-outline justify-center" href="#" aria-label={`Call ${a.name}`}>
                  <Phone size={13} /> Call
                </a>
                <a className="btn-outline justify-center" href="#" aria-label={`Chat ${a.name}`}>
                  <MessageCircle size={13} /> Chat
                </a>
              </div>
            </div>
          );
        })}
      </section>

      {/* Other resources */}
      <section className="card p-6">
        <div className="flex items-center gap-2">
          <HeartHandshake className="text-xcel-600" />
          <h2 className="font-semibold">Other Resources</h2>
        </div>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
          {[
            "Student Cell, YMC",
            "Wardens — Boys' Hostel / Girls' Hostel",
            "Examination Section, YMC",
            "Medical Superintendent, YMCH",
            "Dean, Faculty of Medicine",
            "IT Helpdesk — portal access issues",
          ].map((x) => (
            <li key={x} className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-xcel-500 shrink-0" /> {x}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
