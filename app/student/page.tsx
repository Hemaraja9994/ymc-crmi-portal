"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findStudent, DEMO_LOGIN } from "@/lib/students";
import { GraduationCap, Search, ShieldCheck, Sparkles, ArrowRight, Smartphone, Mail } from "lucide-react";

export default function StudentLogin() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [otp, setOtp] = useState("");
  const [resolved, setResolved] = useState<{ regNo: string; name: string } | null>(null);
  const [stage, setStage] = useState<"id" | "otp">("id");
  const [err, setErr] = useState("");

  function submitId(e: React.FormEvent) {
    e.preventDefault();
    const s = findStudent(q);
    if (!s) {
      setErr("No student found. Use your Campus ID / Roll No, registered phone, or institutional email.");
      return;
    }
    setErr("");
    setResolved({ regNo: s.regNo, name: s.name });
    setStage("otp");
  }
  function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setErr("Enter the 6-digit OTP sent to your institutional email/phone.");
      return;
    }
    router.push(`/student/${encodeURIComponent(resolved!.regNo)}`);
  }

  function useDemo() {
    setQ(DEMO_LOGIN.phones[0]);
    setErr("");
    const s = findStudent(DEMO_LOGIN.phones[0]);
    if (s) {
      setResolved({ regNo: s.regNo, name: s.name });
      setStage("otp");
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-stretch min-h-[70vh]">
      {/* Brand panel */}
      <div className="brand-panel rounded-3xl text-white p-6 md:p-10 relative overflow-hidden">
        <div className="geo-overlay absolute inset-0 opacity-60" />
        <div className="relative h-full flex flex-col">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-xcel-100">
            <Sparkles size={14} /> Intern Access
          </div>
          <h1 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight leading-tight">
            Your internship, organised.
          </h1>
          <p className="mt-3 text-xcel-100/90 max-w-md text-sm md:text-base">
            View postings, request leave, upload certificates, share your schedule and unlock progress badges as you complete each posting.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-xcel-100/90">
            <li className="flex items-center gap-2"><ShieldCheck size={14} /> Sign in with Roll No, phone, or institutional email</li>
            <li className="flex items-center gap-2"><ShieldCheck size={14} /> 52-week rotation with game-style progress levels</li>
            <li className="flex items-center gap-2"><ShieldCheck size={14} /> Live announcements pushed to your dashboard</li>
          </ul>
          <div className="mt-auto pt-8 text-xs text-xcel-100/70">
            Yenepoya Medical College, Mangalore · w.e.f. 01.06.2026
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6 md:p-10 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-xcel-700">
          <GraduationCap />
          <h2 className="font-semibold text-lg">Student Sign-in</h2>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Use any of the following to continue.
        </p>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1"><Search size={12} /> Roll No</span>
          <span className="inline-flex items-center gap-1"><Smartphone size={12} /> Phone</span>
          <span className="inline-flex items-center gap-1"><Mail size={12} /> Email</span>
        </div>

        {stage === "id" && (
          <form onSubmit={submitId} className="mt-5 space-y-3 text-sm">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Campus ID · Phone · Email</span>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="21M001 · 9449499659 · hemaraja@yenepoya.edu.in"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xcel-500"
                />
              </div>
            </label>
            {err && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{err}</div>}
            <button className="btn-primary w-full justify-center py-2.5">
              Send OTP <ArrowRight size={14} />
            </button>
            <div className="pt-2 border-t border-slate-100 mt-2">
              <button type="button" onClick={useDemo} className="w-full text-xs text-xcel-700 hover:underline">
                ✨ Use demo tester credentials (phone {DEMO_LOGIN.phones[0]})
              </button>
            </div>
          </form>
        )}

        {stage === "otp" && resolved && (
          <form onSubmit={submitOtp} className="mt-5 space-y-3 text-sm">
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              OTP sent. Continuing as <strong>{resolved.name}</strong> ({resolved.regNo}).
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              className="w-full text-center tracking-[0.5em] py-3 border border-slate-300 rounded-lg text-lg"
            />
            {err && <div className="text-sm text-rose-600">{err}</div>}
            <button className="btn-primary w-full justify-center py-2.5">Verify & Continue</button>
            <button type="button" onClick={() => { setStage("id"); setResolved(null); }} className="w-full text-xs text-slate-500 hover:underline">
              Use a different identifier
            </button>
            <div className="text-[11px] text-slate-400 text-center">Demo build accepts any 6 digits.</div>
          </form>
        )}
      </div>
    </div>
  );
}
