// Official regulations & circulars surfaced on the Student Dashboard.
//
// ─────────────────────────────────────────────────────────────────────────────
// WHERE THE PDF FILES LIVE
// ─────────────────────────────────────────────────────────────────────────────
// In Next.js, ONLY files inside the `public/` directory are served as static
// assets. A file in the project ROOT (e.g. "Notice (1).pdf") is NOT reachable
// by a browser and will 404 on Vercel.
//
// So the two PDFs must be placed in:  public/regulations/
// They are then served at the site root path:  /regulations/<filename>.pdf
//
// Filenames here intentionally avoid spaces and parentheses so the URLs stay
// clean and reliable (no %20 / %28 encoding surprises across browsers).
//
//   Your root file                    →  rename & move to
//   ───────────────────────────────────────────────────────────────
//   Notice (1).pdf                    →  public/regulations/notice.pdf
//   intern (code of conduct).pdf      →  public/regulations/code-of-conduct.pdf
//
// To add more documents later, drop the PDF into public/regulations/ and append
// an entry below.

export type Regulation = {
  title: string;        // display title shown on the card
  description: string;  // one-line context
  file: string;         // public path, e.g. "/regulations/notice.pdf"
  category: string;     // chip label (Circular / Regulation / Notice …)
  dateAdded?: string;   // metadata — display string (placeholder is fine)
  fileSize?: string;    // metadata — display string (placeholder is fine)
};

export const REGULATIONS: Regulation[] = [
  {
    title: "Internship Notice — Circular",
    description: "Official notice from the Office of the Principal for MBBS 2021 CBME interns.",
    file: "/regulations/notice.pdf",
    category: "Circular",
    dateAdded: "Added Jun 2026",
    fileSize: "PDF",
  },
  {
    title: "Intern — Code of Conduct",
    description: "Internship training rules and code of conduct applicable to all interns.",
    file: "/regulations/code-of-conduct.pdf",
    category: "Regulation",
    dateAdded: "Added Jun 2026",
    fileSize: "PDF",
  },
];
