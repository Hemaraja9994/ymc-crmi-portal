export default function PostingGuidelinesPage() {
  return (
    <div className="space-y-6">
      <header className="card p-6">
        <div className="text-xs uppercase tracking-wide text-brand-700">Postings</div>
        <h1 className="text-2xl font-bold mt-1">Posting Guidelines & Shift Protocols</h1>
      </header>

      <section className="card p-5 space-y-4 text-sm text-slate-700">
        <Item title="Reporting">
          Interns must report to the concerned department on the first working day of every posting
          before 09:00 hrs, in approved white coat with name badge.
        </Item>
        <Item title="Sub-batch movement">
          Movement between sub-batches (A1–A13, B1–B13, etc.) is <strong>not permitted</strong>{" "}
          without written approval of the Internship Coordinator AND the concerned HOD.
        </Item>
        <Item title="Shift / posting changes">
          Any request to swap or shift a posting must be submitted at least <strong>7 days in
          advance</strong> through the portal. Approvals require sign-off from both incoming and
          outgoing departments.
        </Item>
        <Item title="Duty hours">
          Standard duty: 09:00–17:00 hrs (Mon–Sat). Emergency, OBG, Paediatrics and Casualty have
          additional rostered on-call / night duties as per departmental roster.
        </Item>
        <Item title="Stay-duty">
          Stay-duty rooms are provided for interns posted in Casualty, OBG and Paediatrics. Refer
          to the official YMC notice on stay-duty rooms for room allocation.
        </Item>
        <Item title="Logbook">
          The CBME logbook must be updated weekly and countersigned by the unit head before moving
          to the next posting.
        </Item>
        <Item title="Transport">
          Campus transport extension from 21:00 to 06:00 is available as per the YMC notice for
          interns on night-duty rotations.
        </Item>
      </section>
    </div>
  );
}

function Item({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-brand-500 pl-3">
      <div className="font-semibold">{title}</div>
      <p className="mt-0.5">{children}</p>
    </div>
  );
}
