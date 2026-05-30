import { ScrollText, FileText, CalendarDays, Eye, Download } from "lucide-react";
import { REGULATIONS } from "@/lib/regulations";

// ─────────────────────────────────────────────────────────────────────────────
// Regulations & Circulars — official PDF documents for interns to view/download.
// Public (no login required); rendered on the landing page. Data comes from
// lib/regulations.ts; files are served from public/regulations/.
// ─────────────────────────────────────────────────────────────────────────────
export default function RegulationsCard() {
  return (
    <section className="card overflow-hidden">
      {/* Card header — matches the portal's section-header pattern */}
      <div className="border-b border-slate-200 bg-slate-50/60 p-4 flex items-center gap-2">
        <ScrollText size={16} className="text-xcel-600" />
        <div>
          <h2 className="font-bold text-slate-900">Regulations &amp; Circulars</h2>
          <p className="text-xs text-slate-500">
            Official notices and conduct rules for MBBS interns — view online or download.
          </p>
        </div>
      </div>

      {/* Responsive card grid — one document per card */}
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {REGULATIONS.map((doc) => (
          <article
            key={doc.file}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-xcel-300 hover:shadow-md"
          >
            {/* Icon + title + description */}
            <div className="flex items-start gap-3">
              {/* PDF document icon tile */}
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                <FileText size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="badge bg-xcel-100 text-xcel-800 ring-1 ring-xcel-200">{doc.category}</span>
                <h3 className="mt-1.5 font-semibold text-sm text-slate-900 leading-snug" title={doc.title}>
                  {doc.title}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{doc.description}</p>
              </div>
            </div>

            {/* Metadata row — date added · file size (placeholders) */}
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
              {doc.dateAdded && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={11} /> {doc.dateAdded}
                </span>
              )}
              {doc.dateAdded && doc.fileSize && <span className="text-slate-300">•</span>}
              {doc.fileSize && (
                <span className="inline-flex items-center gap-1 uppercase tracking-wide">{doc.fileSize}</span>
              )}
            </div>

            {/* Actions — View (new tab) + Download */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <a
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline justify-center text-xs"
                aria-label={`View ${doc.title}`}
              >
                <Eye size={13} /> View
              </a>
              <a
                href={doc.file}
                download
                className="btn-primary justify-center text-xs"
                aria-label={`Download ${doc.title}`}
              >
                <Download size={13} /> Download
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
