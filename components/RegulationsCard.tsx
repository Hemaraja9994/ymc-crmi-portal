import { ScrollText, FileText, CalendarDays, Eye, Download, BarChart3 } from "lucide-react";
import { REGULATIONS, REGULATION_FACTS } from "@/lib/regulations";

// ─────────────────────────────────────────────────────────────────────────────
// Regulations & Circulars — official PDF documents for interns to view/download.
// Public (no login required); rendered on the landing page. Data comes from
// lib/regulations.ts; files are served from public/regulations/.
// ─────────────────────────────────────────────────────────────────────────────
export default function RegulationsCard() {
  return (
    <section className="card overflow-hidden">
      {/* Brand-panel banner header (matches Block III / IV headings) */}
      <div className="brand-panel relative px-5 py-4 text-white overflow-hidden">
        <div className="geo-overlay absolute inset-0 opacity-50" />
        <div className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <ScrollText size={18} />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Regulations &amp; Circulars</h2>
            <p className="text-xs text-xcel-100/80">
              Official notices and conduct rules for MBBS interns — view online or download.
            </p>
          </div>
        </div>
      </div>

      {/* "At a glance" regulations chart — quick visual summary of key rules */}
      <div className="border-b border-slate-100 bg-gradient-to-br from-xcel-50/70 via-white to-white p-4">
        <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-xcel-700">
          <BarChart3 size={13} /> Regulations at a glance
        </div>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {REGULATION_FACTS.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-xcel-100 bg-white px-2 py-3 text-center shadow-sm"
            >
              <div className="text-xl font-extrabold leading-none text-xcel-700">{f.value}</div>
              <div className="mt-1 text-[10px] font-medium leading-tight text-slate-500">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive card grid — one document per card */}
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {REGULATIONS.map((doc) => (
          <article
            key={doc.file}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-xcel-300 hover:shadow-md"
          >
            {/* Icon + title + description */}
            <div className="flex items-start gap-3">
              {/* PDF document icon tile — enlarged for prominence */}
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                <FileText size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="badge bg-xcel-100 text-xcel-800 ring-1 ring-xcel-200">{doc.category}</span>
                <h3 className="mt-1.5 font-semibold text-sm text-slate-900 leading-snug" title={doc.title}>
                  {doc.title}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{doc.description}</p>
              </div>
            </div>

            {/* Metadata row — date added · file size */}
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
