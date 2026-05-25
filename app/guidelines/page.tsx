import { BLOCKS } from "@/lib/rotation";

export default function GuidelinesPage() {
  return (
    <div className="space-y-6">
      <header className="card p-6">
        <div className="text-xs uppercase tracking-wide text-brand-700">CBME Compliance</div>
        <h1 className="text-2xl font-bold mt-1">Internship Guidelines</h1>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl">
          Duration and structure of postings are as per NMC notification{" "}
          <strong>UGMEB/NMC/RULES &amp; REGULATIONS/2021</strong> dated 18.11.2021. The Compulsory
          Rotatory Medical Internship Programme for the MBBS 2021 CBME Batch runs for{" "}
          <strong>12 months, w.e.f. 01.06.2026</strong>.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        {BLOCKS.map((b) => (
          <div key={b.id} className="card p-5">
            <h2 className="font-semibold text-lg">{b.title}</h2>
            <div className="text-xs text-slate-500 mb-3">
              Total {b.depts.reduce((s, d) => s + d.weeks, 0)} weeks
            </div>
            <table className="w-full text-sm">
              <tbody>
                {b.depts.map((d) => (
                  <tr key={d.code} className="border-t border-slate-100">
                    <td className="py-2">
                      <span className={`dept-chip ${d.color} mr-2`}>{d.short}</span>
                      {d.name}
                    </td>
                    <td className="py-2 text-right font-mono">{d.weeks}w</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section className="card p-5">
        <h2 className="font-semibold">Assessment & Logbook</h2>
        <ul className="mt-2 text-sm space-y-2 text-slate-700 list-disc pl-5">
          <li>
            All interns must maintain a logbook. At the end of each posting, interns will be
            assessed on the skills acquired during that posting.
          </li>
          <li>
            A final clinical-skills assessment will be conducted during{" "}
            <strong>March / April 2027</strong> by a panel of senior faculty.
          </li>
          <li>
            Successful clearance of the assessment is mandatory for issuance of the Internship
            Completion Certificate.
          </li>
        </ul>
      </section>
    </div>
  );
}
