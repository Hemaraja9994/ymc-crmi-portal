"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findStudent } from "@/lib/students";
import { GraduationCap, Search, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function StudentLogin() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"id" | "otp">("id");
  const [err, setErr] = useState("");

  function submitId(e: React.FormEvent) {
    e.preventDefault();
    const s = findStudent(q);
    if (!s) {
      setErr("No student found. Check your Roll No. / Campus ID.");
      return;
    }
    setErr("");
    setStage("otp");
  }
  function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setErr("Enter the 6-digit OTP sent to your institutional email.");
      return;
    }
    router.push(`/student/${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-stretch min-h-[70vh]">
      {/* Brand panel */}
      <div className="brand-panel rounded-3xl text-white p-8 md:p-10 relative overflow-hidden">
        <div className="geo-overlay absolute inset-0 opacity-60" />
        <div className="relative h-full flex flex-col">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-xcel-100">
            <Sparkles size={14} /> Intern Access
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Your internship, organised.
          </h1>
          <p className="mt-3 text-xcel-100/90 max-w-md text-sm md:text-base">
            View postings, request leave, upload certificates, and share your schedule with one
            tap — built for the MBBS 2021 CBME batch.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-xcel-100/90">
            <li className="flex items-center gap-2"><ShieldCheck size={14} /> Passwordless institutional OTP</li>
            <li className="flex items-center gap-2"><ShieldCheck size={14} /> 52-week rotation map at a glance</li>
            <li className="flex items-center gap-2"><ShieldCheck size={14} /> WhatsApp share to family / guardian</li>
          </ul>
          <div className="mt-auto pt-8 text-xs text-xcel-100/70">
            Yenepoya Medical College, Mangalore · w.e.f. 01.06.2026
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-8 md:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-xcel-700">
          <GraduationCap />
          <h2 className="font-semibold text-lg">Student Sign-in</h2>
        </div>
        <p className="text-sm text-slate-500 mt-1">Use your Campus ID or Roll Number to continue.</p>

        {stage === "id" && (
          <form onSubmit={submitId} className="mt-6 space-y-3 text-sm">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Campus ID / Roll Number</span>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. 21M001"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xcel-500"
                />
              </div>
            </label>
            {err && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{err}</div>}
            <button className="btn-primary w-full justify-center py-2.5">
              Send OTP <ArrowRight size={14} />
            </button>
            <p className="text-[11px] text-slate-400">
              Tip — try <code>21M001</code> or any registered Roll Number.
            </p>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={submitOtp} className="mt-6 space-y-3 text-sm">
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              OTP sent to your institutional email (demo: enter any 6 digits).
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              className="w-full text-center tracking-[0.5em] py-3 border border-slate-300 rounded-lg text-lg"
            />
            {err && <div className="text-sm text-rose-600">{err}</div>}
            <button className="btn-primary w-full justify-center py-2.5">Verify & Continue</button>
          </form>
        )}
      </div>
    </div>
  );
}
