"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findStudent } from "@/lib/students";
import { GraduationCap, Search, ShieldCheck } from "lucide-react";

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
    <div className="max-w-md mx-auto card p-6 mt-4">
      <div className="flex items-center gap-2 text-brand-700">
        <GraduationCap />
        <h1 className="font-semibold text-lg">Student Login</h1>
      </div>
      <p className="text-sm text-slate-500 mt-1">
        Passwordless login via institutional Campus ID / Roll No. + OTP.
      </p>

      {stage === "id" && (
        <form onSubmit={submitId} className="mt-5 space-y-3">
          <label className="text-sm font-medium">Campus ID / Roll Number</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. 21M001"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          {err && <div className="text-sm text-rose-600">{err}</div>}
          <button className="btn-primary w-full justify-center">Send OTP</button>
          <p className="text-xs text-slate-500">
            Tip — try <code>21M001</code>, <code>21M050</code>, or your own ID.
          </p>
        </form>
      )}

      {stage === "otp" && (
        <form onSubmit={submitOtp} className="mt-5 space-y-3">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            OTP sent to your institutional email (demo: any 6 digits).
          </div>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
            className="w-full text-center tracking-[0.5em] py-3 border border-slate-300 rounded-lg text-lg"
          />
          {err && <div className="text-sm text-rose-600">{err}</div>}
          <button className="btn-primary w-full justify-center">Verify & Continue</button>
        </form>
      )}
    </div>
  );
}
