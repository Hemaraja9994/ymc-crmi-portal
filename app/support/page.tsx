import { ADMINS } from "@/lib/admins";
import { MessageCircle, Mail, Phone, HeartHandshake } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <header className="card p-6 bg-gradient-to-br from-brand-50 via-white to-white">
        <div className="flex items-center gap-2 text-brand-700">
          <HeartHandshake />
          <div className="text-xs uppercase tracking-wide">Support & Clarifications</div>
        </div>
        <h1 className="text-2xl font-bold mt-1">We're here to help</h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl">
          Your internship year is one of the most important years of your medical journey — and
          you are not navigating it alone. Reach out to any of the coordinators below for academic,
          posting or personal concerns. All conversations are confidential.
        </p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADMINS.map((a) => (
          <div key={a.name} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{a.role}</div>
              </div>
              {a.isPrincipal && (
                <span className="badge bg-amber-100 text-amber-800">Principal</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a className="btn-ghost border border-slate-200" href="#">
                <Mail size={14} /> Email
              </a>
              <a className="btn-ghost border border-slate-200" href="#">
                <Phone size={14} /> Call
              </a>
              <a className="btn-ghost border border-slate-200" href="#">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        ))}
      </section>

      <section className="card p-5">
        <h2 className="font-semibold">Other Resources</h2>
        <ul className="mt-2 text-sm space-y-1 text-slate-700 list-disc pl-5">
          <li>Student Cell, YMC</li>
          <li>Wardens — Boys&apos; Hostel / Girls&apos; Hostel</li>
          <li>Examination Section, YMC</li>
          <li>Medical Superintendent, YMCH</li>
          <li>Dean, Faculty of Medicine</li>
        </ul>
      </section>
    </div>
  );
}
