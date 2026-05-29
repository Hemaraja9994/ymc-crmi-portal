import { ADMINS, COMMUNICATION_HUB } from "@/lib/admins";
import {
  MessageCircle,
  Mail,
  Phone,
  HeartHandshake,
  Sparkles,
  Clock,
  ShieldCheck,
  AtSign,
  ArrowRight,
  MapPin,
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

      {/* ── Communication Hub — principal desk only ─────────────────── */}
      <section className="grid gap-4">
        <CommHubCard
          label={COMMUNICATION_HUB.principal.label}
          email={COMMUNICATION_HUB.principal.email}
          purpose={COMMUNICATION_HUB.principal.purpose}
        />
      </section>

      {/* Coordinator cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADMINS.map((a) => {
          const initials = a.name
            .replace(/^(Dr\.|Mrs\.|Mr\.)\s*/i, "")
            .split(" ")
            .map((n) => n[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase();

          const emailAddr = a.email ?? COMMUNICATION_HUB.principal.email;
          const phoneHref = a.phone ?? "tel:+918242204668";

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
                    {a.isWelfareOfficer && (
                      <span className="badge bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">Welfare</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {a.role}
                    {a.dept && <span className="text-slate-400"> · {a.dept}</span>}
                  </div>
                  {a.extension && (
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                      <Phone size={11} className="text-slate-400" /> {a.extension}
                    </div>
                  )}
                </div>
              </div>

              {/* Address (principal / key desks) */}
              {a.address && (
                <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500 leading-snug">
                  <MapPin size={11} className="mt-0.5 shrink-0 text-xcel-500" />
                  <span>{a.address}</span>
                </div>
              )}

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
                <a
                  className="btn-outline justify-center"
                  href={`mailto:${emailAddr}?subject=${encodeURIComponent(`Attn: ${a.name}`)}`}
                  aria-label={`Email ${a.name}`}
                >
                  <Mail size={13} /> Email
                </a>
                <a
                  className="btn-outline justify-center"
                  href={phoneHref}
                  aria-label={`Call ${a.name}`}
                >
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

      {/* Coordination scope reference */}
      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <h2 className="font-bold text-slate-900">CRMI Coordination Cell — Areas of Responsibility</h2>
          <p className="text-xs text-slate-500">Direct your query to the right desk to get the fastest resolution.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Coordinator</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Area of Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {ADMINS.map((a) => (
                <tr key={a.name} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                    {a.name}
                    {a.isPrincipal && (
                      <span className="ml-1.5 align-middle inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">PRINCIPAL</span>
                    )}
                    {a.isWelfareOfficer && (
                      <span className="ml-1.5 align-middle inline-block rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">WELFARE</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">
                    {a.role}
                    {a.dept && <span className="text-slate-400"> · {a.dept}</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{a.focus?.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <span style={{ display: "inline-block", width: 6, height: 6, marginTop: 7, borderRadius: 999, background: "#008B75", flexShrink: 0 }} /> {x}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CommHubCard({
  label, email, purpose,
}: {
  label: string;
  email: string;
  purpose: string;
}) {
  return (
    <a
      href={`mailto:${email}?subject=${encodeURIComponent("Principal Administrative Query")}`}
      className="card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-xl border-amber-200"
    >
      <div className="flex items-start gap-4">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          }}
        >
          <AtSign size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Administrative Desk
          </div>
          <div className="mt-0.5 font-bold text-slate-900">{label}</div>
          <div className="mt-0.5 text-xs text-slate-500">{purpose}</div>
          <div className="mt-2 inline-flex items-center gap-1 text-sm font-mono font-semibold text-xcel-700 group-hover:text-xcel-800">
            {email} <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </a>
  );
}
