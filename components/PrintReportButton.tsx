"use client";

import { Printer } from "lucide-react";

export default function PrintReportButton({ label = "Print / Save PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn-primary no-print">
      <Printer size={16} /> {label}
    </button>
  );
}
