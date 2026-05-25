"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_LOGIN } from "@/lib/students";
import { Search, Sparkles, Smartphone, Mail } from "lucide-react";
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
  const [resolved, setResolved] = useState<{ regNo: string; name: string; blockId: number; subBatch: string } | null>(null);
  const [weeks, setWeeks] = useState<WeekCell[]>([]);
  const [currentWeek, setCurrentWeek] = useState(-1);
  const [preLaunch, setPreLaunch] = useState(true);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(e?: React.FormEvent, overrideQuery?: string) {
    e?.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const response = await fetch("/api/student-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: overrideQuery ?? q }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErr(result.error || "No student found. Try your Roll No, registered phone or institutional email.");
        setResolved(null);
        setWeeks([]);
        return;
      }
      setResolved({
        regNo: result.student.regNo,
        name: result.student.name,
        blockId: result.assignment.blockId,
        subBatch: result.assignment.subBatch,
      });
      setWeeks(result.weeks);
      setCurrentWeek(result.currentWeek);
      setPreLaunch(result.preLaunch);
    } finally {
      setLoading(false);
    }
  }

  function openDashboard() {
    router.push(`/student/${encodeURIComponent(resolved!.regNo)}`);
  }

  function useDemo() {
    const demo = DEMO_LOGIN.phones[0];
    setQ(demo);
    void search(undefined, demo);
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
            <button className="btn bg-white text-xcel-700 hover:bg-xcel-50 px-5 py-3 rounded-xl font-semibold" disabled={loading}>
              <Search size={16} /> {loading ? "Searching" : "Search"}
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
      {resolved && weeks.length > 0 && (
        <StudentMatrixPreview
          studentName={resolved.name}
          regNo={resolved.regNo}
          blockId={resolved.blockId}
          subBatch={resolved.subBatch}
          weeks={weeks}
          currentWeek={currentWeek}
          preLaunch={preLaunch}
          onContinue={openDashboard}
        />
      )}

    </div>
  );
}
