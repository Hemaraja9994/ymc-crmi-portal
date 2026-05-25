"use client";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  MessageCircle,
  Mail,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type WeekRow = {
  idx: number;
  start: string;
  end: string;
  label: string;
  cell: { weekIdx: number; deptCode: string; deptName: string; deptShort: string; color: string };
};

export default function StudentDashboard({
  assignment,
  weeks,
  current,
  next,
  currentDeptName,
}: {
  assignment: any;
  weeks: WeekRow[];
  current: WeekRow;
  next: WeekRow;
  currentDeptName: string;
}) {
  const [view, setView] = useState<"year" | "month" | "week">("year");
  const [leaves, setLeaves] = useState<
    { id: number; from: string; to: string; reason: string; status: "Pending" | "Approved" | "Rejected"; doc?: string }[]
  >([]);

  const whatsappText = useMemo(() => {
    const msg = [
      `*YMC CRMI Posting Update*`,
      `Name: ${assignment.student.name}`,
      `Reg. No: ${assignment.student.regNo}`,
      `Block: ${assignment.blockId} · Sub-batch: ${assignment.subBatch}`,
      ``,
      `🩺 Current (${current.label}):`,
      `   ${currentDeptName}`,
      ``,
      `📅 Next (${next.label}):`,
      `   ${next.cell.deptName}`,
    ].join("\n");
    return encodeURIComponent(msg);
  }, [assignment, current, next, currentDeptName]);

  return (
    <div className="space-y-6">
      <section className="card p-5 md:p-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Intern Profile</div>
            <h1 className="text-xl md:text-2xl font-bold">{assignment.student.name}</h1>
            <div className="text-sm text-slate-600 mt-1">
              Reg. No: <strong>{assignment.student.regNo}</strong> · Block {assignment.blockId} ·
              Sub-batch <strong>{assignment.subBatch}</strong>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              className="btn bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <MessageCircle size={16} /> Share to WhatsApp
            </a>
            <button className="btn-ghost border border-slate-300">
              <Mail size={16} /> Email me my schedule
            </button>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <PostingCard title="Current posting" range={current.label} dept={current.cell} highlight />
        <PostingCard title="Next week" range={next.label} dept={next.cell} />
      </section>

      <section className="card">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-brand-600" />
            <h2 className="font-semibold">Posting Timeline</h2>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden text-sm">
            {(["year", "month", "week"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 capitalize ${view === v ? "bg-brand-600 text-white" : "bg-white"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "year" && <YearGrid weeks={weeks} currentIdx={current.idx} />}
        {view === "month" && <MonthList weeks={weeks} currentIdx={current.idx} />}
        {view === "week" && <WeekDetail week={weeks[current.idx]} />}
      </section>

      <LeaveSection leaves={leaves} setLeaves={setLeaves} />
    </div>
  );
}

function PostingCard({
  title,
  range,
  dept,
  highlight,
}: {
  title: string;
  range: string;
  dept: WeekRow["cell"];
  highlight?: boolean;
}) {
  return (
    <div className={`card p-5 ${highlight ? "ring-2 ring-brand-500" : ""}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{range}</div>
      <div className="mt-3 flex items-center gap-2">
        <span className={`dept-chip ${dept.color}`}>{dept.deptShort}</span>
        <span className="font-semibold">{dept.deptName}</span>
      </div>
    </div>
  );
}

function YearGrid({ weeks, currentIdx }: { weeks: WeekRow[]; currentIdx: number }) {
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-2">
      {weeks.map((w) => (
        <div
          key={w.idx}
          className={`rounded-lg border p-2 text-[11px] ${
            w.idx === currentIdx ? "border-brand-500 ring-2 ring-brand-200" : "border-slate-200"
          }`}
          title={`Week ${w.idx + 1} · ${w.label} · ${w.cell.deptName}`}
        >
          <div className="font-semibold">W{w.idx + 1}</div>
          <span className={`dept-chip mt-1 ${w.cell.color}`}>{w.cell.deptShort}</span>
        </div>
      ))}
    </div>
  );
}

function MonthList({ weeks, currentIdx }: { weeks: WeekRow[]; currentIdx: number }) {
  // Group every 4 weeks as a "month".
  const months: WeekRow[][] = [];
  for (let i = 0; i < weeks.length; i += 4) months.push(weeks.slice(i, i + 4));
  return (
    <div className="p-4 space-y-4">
      {months.map((m, idx) => (
        <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-3 py-1.5 text-xs uppercase tracking-wide text-slate-600">
            Month {idx + 1}
          </div>
          <table className="w-full text-sm">
            <tbody>
              {m.map((w) => (
                <tr key={w.idx} className={w.idx === currentIdx ? "bg-brand-50" : ""}>
                  <td className="px-3 py-2 text-slate-500 w-12">W{w.idx + 1}</td>
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{w.label}</td>
                  <td className="px-3 py-2">
                    <span className={`dept-chip ${w.cell.color}`}>{w.cell.deptShort}</span>{" "}
                    <span className="ml-1">{w.cell.deptName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function WeekDetail({ week }: { week: WeekRow }) {
  return (
    <div className="p-6">
      <div className="text-xs text-slate-500">Week {week.idx + 1}</div>
      <div className="text-lg font-semibold">{week.label}</div>
      <div className="mt-4 flex items-center gap-2 text-xl">
        <span className={`dept-chip ${week.cell.color}`}>{week.cell.deptShort}</span>
        <span className="font-semibold">{week.cell.deptName}</span>
      </div>
    </div>
  );
}

function LeaveSection({
  leaves,
  setLeaves,
}: {
  leaves: any[];
  setLeaves: (l: any[]) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [docName, setDocName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to) return;
    setLeaves([
      ...leaves,
      { id: Date.now(), from, to, reason, status: "Pending", doc: docName },
    ]);
    setFrom("");
    setTo("");
    setReason("");
    setDocName("");
  }

  return (
    <section className="grid md:grid-cols-2 gap-4">
      <div className="card p-5">
        <h2 className="font-semibold flex items-center gap-2">
          <Clock size={18} className="text-brand-600" /> Submit Leave Request
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Notify in advance so the department can plan coverage.
        </p>
        <form onSubmit={submit} className="mt-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-slate-500">From</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">To</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-slate-500">Reason</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="Brief reason (medical / personal / academic)"
            />
          </label>
          <DropZone onFile={(f) => setDocName(f.name)} />
          {docName && (
            <div className="text-xs text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={14} /> Attached: {docName}
            </div>
          )}
          <button className="btn-primary w-full justify-center">Submit Request</button>
        </form>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold">My Leave Requests</h2>
        <p className="text-xs text-slate-500 mt-1">Live status from the coordinators.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {leaves.length === 0 && (
            <li className="text-slate-500 italic">No requests yet.</li>
          )}
          {leaves.map((l) => (
            <li key={l.id} className="border border-slate-200 rounded-lg p-3 flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {l.from} → {l.to}
                </div>
                {l.reason && <div className="text-xs text-slate-500 mt-0.5">{l.reason}</div>}
                {l.doc && <div className="text-xs text-slate-400 mt-0.5">📎 {l.doc}</div>}
              </div>
              <StatusBadge status={l.status} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  const map = {
    Pending: "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-rose-100 text-rose-800",
  } as const;
  const Icon = status === "Approved" ? CheckCircle2 : status === "Rejected" ? AlertCircle : Clock;
  return (
    <span className={`badge ${map[status]}`}>
      <Icon size={12} /> {status}
    </span>
  );
}

function DropZone({ onFile }: { onFile: (f: File) => void }) {
  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className="block border-2 border-dashed border-slate-300 rounded-xl p-4 text-center text-sm text-slate-500 cursor-pointer hover:bg-slate-50"
    >
      <Upload className="mx-auto mb-1 text-slate-400" />
      Drag & drop leave letter / medical certificate (.pdf, .jpg)
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </label>
  );
}
