"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findStudent, DEMO_LOGIN } from "@/lib/students";
import {
  findAssignmentByCampusId,
  getWeekDates,
  TOTAL_WEEKS,
  currentWeekIndex,
  isPreLaunch,
} from "@/lib/rotation";
import {
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Smartphone,
  Mail,
} from "lucide-react";
import StudentMatrixPreview from "@/components/StudentMatrixPreview";

type WeekCell = {
  idx: number;
  start: Date | string;
  end: Date | string;
  label: string;
  cell: { deptCode: string; deptName: string; deptShort: string; color: string };
};

export default function StudentLogin() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [otp, setOtp] = useState("");
  const [resolved, setResolved] = useState<{ regNo: string; name: string; blockId: number; subBatch: string } | null>(null);
  const [weeks, setWeeks] = useState<WeekCell[]>([]);
  const [stage, setStage] = useState<"search" | "otp">("search");
  const [err, setErr] = useState("");

  function search(e?: React.FormEvent) {
    e?.preventDefault();
    setErr("");
    const s = findStudent(q);
    if (!s) {
      setErr("No student found. Try your Roll No, registered phone or institutional email.");
      setResolved(null);
      setWeeks([]);
      return;
    }
    const a = findAssignmentByCampusId(s.regNo);
    if (!a) {
      setErr("Schedule not yet generated for this student.");
      return;
    }
    const rows: WeekCell[] = Array.from({ length: TOTAL_WEEKS }, (_, i) => ({
      idx: i,
      ...getWeekDates(i),
      cell: a.rotation.find((r) => r.weekIdx === i)!,
    }));
    setResolved({ regNo: s.regNo, name: s.name, blockId: a.blockId, subBatch: a.subBatch });
    setWeeks(rows);
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
    setTimeout(() => search(), 0);
  }

  return (
    <div className="space-y-6">
      {/* Search-first hero */}
      <section className="rounded-3xl overflow-hidden relative brand-panel text-white p-6 md:p-8">
        <div className="geo-overlay absolute inset-0 opacity-60" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-xcel-100">
            <Sparkles size={14} /> Student Search
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
            Enter Campus ID / Roll Number to view your 52-Week Rotation Matrix
          </h1>
          <p className="mt-2 text-xcel-100/90 text-sm">
            Roll No, registered phone or institutional email all work.
          </p>

          <form onSubmit={search} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="21M001 · 9449499659 · hemaraja@yenepoya.edu.in"
                className="w-full pl-10 pr-3 py-3 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <button className="btn bg-white text-xcel-700 hover:bg-xcel-50 px-5 py-3 rounded-xl font-semibold">
              <Search size={16} /> Search
            </button>
          </form>

          <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-xcel-100/80">
            <span className="inline-flex items-center gap-1"><Search size={12} /> Roll No</span>
            <span className="inline-flex items-center gap-1"><Smartphone size={12} /> Phone</span>
            <span className="inline-flex items-center gap-1"><Mail size={12} /> Email</span>
            <button type="button" onClick={useDemo} className="ml-2 underline">
              try demo
            </button>
          </div>

          {err && (
            <div className="mt-3 inline-block bg-rose-100/95 text-rose-900 text-sm rounded-lg px-3 py-2">
              {err}
            </div>
          )}
        </div>
      </section>

      {/* Matrix preview appears here as soon as a valid ID is entered */}
      {resolved && weeks.length > 0 && stage === "search" && (
        <StudentMatrixPreview
          studentName={resolved.name}
          regNo={resolved.regNo}
          blockId={resolved.blockId}
          subBatch={resolved.subBatch}
          weeks={weeks}
          currentWeek={isPreLaunch() ? -1 : currentWeekIndex()}
          preLaunch={isPreLaunch()}
          onContinue={() => setStage("otp")}
        />
      )}

      {/* OTP step */}
      {stage === "otp" && resolved && (
        <section className="card p-6 md:p-8 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-xcel-700">
            <GraduationCap />
            <h2 className="font-semibold text-lg">Sign in to continue</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Continuing as <strong>{resolved.name}</strong> ({resolved.regNo}).
          </p>
          <form onSubmit={submitOtp} className="mt-5 space-y-3 text-sm">
            <div className="text-sm text-slate-600 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              OTP sent to your registered email / phone (demo: any 6 digits).
            </div>
            <input
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
              className="w-full text-center tracking-[0.5em] py-3 border border-slate-300 rounded-lg text-lg"
            />
            {err && <div className="text-sm text-rose-600">{err}</div>}
            <button className="btn-primary w-full justify-center py-2.5">Verify & open dashboard</button>
            <button type="button" onClick={() => setStage("search")} className="w-full text-xs text-slate-500 hover:underline">
              ← Search again
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
