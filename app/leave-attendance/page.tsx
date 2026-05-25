import { BLOCKS } from "@/lib/rotation";

export default function LeavePage() {
  const allDepts = BLOCKS.flatMap((b) => b.depts.map((d) => ({ ...d, block: b.id })));
  return (
    <div className="space-y-6">
      <header className="card p-6">
        <div className="text-xs uppercase tracking-wide text-brand-700">Leave & Attendance</div>
        <h1 className="text-2xl font-bold mt-1">Leave Provisions & Attendance Criteria</h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl">
          Casual leave entitlements per posting are governed by NMC and YMC internship norms.
          Interns must meet the mandatory attendance threshold to complete the internship and be
          eligible for the completion certificate.
        </p>
      </header>

      <section className="card p-5">
        <h2 className="font-semibold">Mandatory Attendance</h2>
        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
          <Stat label="Minimum overall attendance" value="80%" tone="rose" />
          <Stat label="Per-posting attendance (clinical)" value="≥ 80%" tone="amber" />
          <Stat label="Logbook submission" value="100%" tone="emerald" />
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Shortfall in attendance in any posting will require the intern to repeat that posting
          before the completion certificate is issued.
        </p>
      </section>

      <section className="card">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-semibold">Casual Leave Entitlement per Posting</h2>
          <p className="text-xs text-slate-500">
            As per YMC CRMI circular (Ref: YMC/1269/2025). Total ≈ 15 days across the year.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-4 py-2">Department</th>
                <th className="text-left px-4 py-2">Block</th>
                <th className="text-left px-4 py-2">Weeks</th>
                <th className="text-left px-4 py-2">Casual Leave (days)</th>
              </tr>
            </thead>
            <tbody>
              {allDepts.map((d) => (
                <tr key={d.code} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <span className={`dept-chip ${d.color} mr-2`}>{d.short}</span>
                    {d.name}
                  </td>
                  <td className="px-4 py-2">{d.block}</td>
                  <td className="px-4 py-2">{d.weeks}</td>
                  <td className="px-4 py-2 font-medium">
                    {d.casualLeaveDays === "Nil" ? (
                      <span className="badge bg-slate-100 text-slate-600">Nil</span>
                    ) : (
                      `${d.casualLeaveDays} day${d.casualLeaveDays === 1 ? "" : "s"}`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-5 text-sm text-slate-700 space-y-2">
        <h2 className="font-semibold">Important Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Leave applications must be submitted in advance via the portal.</li>
          <li>Medical leave requires a medical certificate uploaded as PDF/JPG.</li>
          <li>Unauthorized absence will be treated as breach of internship discipline.</li>
          <li>Extension of internship will be applied where attendance criteria are not met.</li>
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "rose" | "amber" | "emerald" }) {
  const map = {
    rose: "bg-rose-50 border-rose-200 text-rose-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  return (
    <div className={`rounded-xl border p-4 ${map[tone]}`}>
      <div className="text-xs uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
