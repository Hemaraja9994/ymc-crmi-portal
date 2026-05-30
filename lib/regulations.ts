// Official regulations & circulars surfaced on the landing page.
//
// ─────────────────────────────────────────────────────────────────────────────
// WHERE THE PDF FILES LIVE
// ─────────────────────────────────────────────────────────────────────────────
// In Next.js, ONLY files inside the `public/` directory are served as static
// assets. A file in the project ROOT (e.g. "Notice (1).pdf") is NOT reachable
// by a browser and will 404 on Vercel.
//
// So the PDFs live in:  public/regulations/
// They are then served at the site root path:  /regulations/<filename>.pdf
//
// Filenames avoid spaces/parentheses so the URLs stay clean across browsers.
// To add a document: drop the PDF into public/regulations/ and append an entry.
// (The global *.pdf ignore in .gitignore is exempted for public/regulations/*.pdf)

export type Regulation = {
  title: string;        // display title shown on the card
  description: string;  // one-line context
  file: string;         // public path, e.g. "/regulations/notice.pdf"
  category: string;     // chip label (Circular / Regulation / Timeline …)
  dateAdded?: string;   // metadata — display string
  fileSize?: string;    // metadata — display string
};

export const REGULATIONS: Regulation[] = [
  {
    title: "Internship Notice — Circular",
    description: "Commencement, orientation, KMC registration, BLS/ACLS and joining requirements for the 2021 batch.",
    file: "/regulations/notice.pdf",
    category: "Circular",
    dateAdded: "30 May 2026",
    fileSize: "586 KB",
  },
  {
    title: "Intern — Code of Conduct",
    description: "Internship training rules and code of conduct (13 points) applicable to all interns.",
    file: "/regulations/code-of-conduct.pdf",
    category: "Regulation",
    dateAdded: "30 May 2026",
    fileSize: "366 KB",
  },
  {
    title: "Internship Timeline — 2021 Batch",
    description: "Milestone dates, hostel accommodation rules, duty timings and bus facility.",
    file: "/regulations/timeline-2021-batch.pdf",
    category: "Timeline",
    dateAdded: "May 2026",
    fileSize: "221 KB",
  },

  // ── Coming soon — drop the PDFs into public/regulations/ and uncomment ───────
  // {
  //   title: "List of CRMI Coordinators",
  //   description: "Internship coordination cell — coordinators and contact desks.",
  //   file: "/regulations/coordinators.pdf",
  //   category: "Directory",
  //   dateAdded: "Jun 2026",
  //   fileSize: "PDF",
  // },
  // {
  //   title: "List of In-charge Faculties",
  //   description: "Department-wise in-charge faculty for the internship postings.",
  //   file: "/regulations/incharge-faculties.pdf",
  //   category: "Directory",
  //   dateAdded: "Jun 2026",
  //   fileSize: "PDF",
  // },
];

// Quick-reference regulation facts (the "at a glance" chart on the landing card).
// Sourced from the Notice, Code of Conduct and Timeline circulars above.
export type RegFact = { value: string; label: string };

export const REGULATION_FACTS: RegFact[] = [
  { value: "365", label: "Days internship" },
  { value: "15", label: "Max leave days" },
  { value: "100%", label: "Posting attendance" },
  { value: "2 mo.", label: "BLS / ACLS deadline" },
  { value: "8–4", label: "Daily duty hours" },
  { value: "₹1,000", label: "No white-coat fine" },
];
