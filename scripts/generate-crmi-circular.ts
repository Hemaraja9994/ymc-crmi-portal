// Generate a Word document of the CRMI posting allotment for circulation
// to HODs/HOUs from the Principal's office.
//
// Usage: npx tsx scripts/generate-crmi-circular.ts
// Output: /tmp/crmi-circular.docx

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
         Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
         PageOrientation } from "docx";
import { writeFileSync } from "fs";
import { addDays, format } from "date-fns";
import { BLOCKS, START_DATE, buildAssignments, getWeekDates } from "../lib/rotation";

// ─── Institutional constants ────────────────────────────────────────────────
const INSTITUTION = {
  name: "Yenepoya Medical College",
  tagline: "(A Constituent College of Yenepoya, deemed to be University)",
  address: "Deralakatte, Mangalore - 575 018, Karnataka, India",
  phone: "+91-824-2204668",
  email: "principalymc@yenepoya.edu.in",
  emailGeneral: "hospital@yenepoya.org",
  office: "Office of the Principal",
};

const REF_NO = "YMC/CRMI/2025-26/01";
const TODAY = format(new Date(), "dd MMMM yyyy");

const PRINCIPAL = "Dr. Prakash Saldanha";
const COORDINATORS = [
  { name: "Dr. Jeevan",       focus: "Posting allocation · Block I & II tracking · Schedule changes" },
  { name: "Dr. Imaad",        focus: "Attendance · Casual leave approvals · Logbook compliance" },
  { name: "Dr. Rashmi Jain",  focus: "Intern wellbeing · Personal/medical leave · Hostel concerns" },
];

// ─── Style helpers ──────────────────────────────────────────────────────────
const INDIGO = "1E1B4B";
const ORANGE = "EA580C";
const SLATE_700 = "334155";
const SLATE_500 = "64748B";
const SLATE_100 = "F1F5F9";
const SLATE_200 = "E2E8F0";

function H1(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: INDIGO, size: 28 })],
  });
}

function H2(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, color: INDIGO, size: 24 })],
  });
}

function H3(text: string) {
  return new Paragraph({
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, bold: true, color: SLATE_700, size: 22 })],
  });
}

function P(text: string, opts: { bold?: boolean; italic?: boolean; size?: number; align?: AlignmentType } = {}) {
  return new Paragraph({
    alignment: opts.align,
    spacing: { after: 100, line: 300 },
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italic, size: opts.size ?? 22 })],
  });
}

function bullet(text: string) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60, line: 280 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 100 }, children: [new TextRun("")] });
}

// Build a styled table cell
function cell(text: string, opts: { bold?: boolean; align?: AlignmentType; width?: number; bg?: string; size?: number } = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.bg ? { type: ShadingType.CLEAR, color: "auto", fill: opts.bg } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: opts.align,
        children: [new TextRun({ text, bold: opts.bold, size: opts.size ?? 20 })],
      }),
    ],
  });
}

// ─── 1. Letterhead ──────────────────────────────────────────────────────────
function buildLetterhead(): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: INSTITUTION.name, bold: true, color: INDIGO, size: 36 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: INSTITUTION.tagline, italics: true, color: SLATE_500, size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: INSTITUTION.address, color: SLATE_700, size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: `${INSTITUTION.phone}  ·  ${INSTITUTION.email}`, color: SLATE_700, size: 20 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: INDIGO } },
      children: [new TextRun({ text: INSTITUTION.office, bold: true, color: ORANGE, size: 22 })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Ref. No: ", bold: true, size: 22 }),
        new TextRun({ text: REF_NO, size: 22 }),
        new TextRun({ text: "                                                                                                              " }),
        new TextRun({ text: "Date: ", bold: true, size: 22 }),
        new TextRun({ text: TODAY, size: 22 }),
      ],
    }),
    spacer(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({ text: "COMPULSORY ROTATORY MEDICAL INTERNSHIP (CRMI) PROGRAMME", bold: true, color: INDIGO, size: 26 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "MBBS 2021 CBME Batch  ·  Effective 01 June 2026 to 31 May 2027", color: SLATE_700, size: 22 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({ text: "POSTING ALLOTMENT & SCHEDULE — FOR HOD / HOU CIRCULATION", bold: true, italics: true, color: ORANGE, size: 22 }),
      ],
    }),
  ];
}

// ─── 2. Salutation + Reference Notification ────────────────────────────────
function buildSalutation(): Paragraph[] {
  return [
    P("To,", { bold: true }),
    P("The Heads of Departments & Heads of Units"),
    P("Yenepoya Medical College & Hospital"),
    P("Deralakatte, Mangalore."),
    spacer(),
    P("Sir / Madam,", { bold: true }),
    spacer(),
    P("Sub: Posting allotment and rotation schedule for the Compulsory Rotatory Medical Internship Programme (CRMI) — MBBS 2021 CBME Batch — w.e.f. 01.06.2026.", { bold: true }),
    P("Ref: NMC notification UGMEB/NMC/RULES & REGULATIONS/2021 dated 18.11.2021.", { italic: true }),
    spacer(),
    P("With reference to the cited NMC notification, the Office of the Principal hereby forwards the posting allotment and rotation schedule of the MBBS 2021 CBME batch interns for the academic year 01.06.2026 – 31.05.2027."),
    P("The batch comprises 113 interns distributed across four rotation blocks. The departments and weeks-per-posting are summarised below; sub-batch allotments and the full week-wise calendar are appended."),
    P("Kindly receive the interns posted in your respective departments, ensure logbook compliance, monitor attendance against the 80% mandatory threshold per posting, and certify completion at the end of each rotation."),
    spacer(),
  ];
}

// ─── 3. Instructions to Interns ────────────────────────────────────────────
function buildInstructions(): (Paragraph | Table)[] {
  return [
    H2("Instructions to Interns"),
    bullet("Attendance: A minimum of 80% attendance per posting is mandatory as per NMC regulations. Shortfall will require repeat of that posting before issue of the Completion Certificate."),
    bullet("Logbook: Weekly logbook entries must be made and countersigned by the consultant/HOD before the close of every Saturday. Non-submission will be marked as absence."),
    bullet("Casual Leave: Permitted only as per the departmental entitlement listed in the schedule table. Advance leave must be applied for through the CRMI Portal at least 7 days in advance. Retroactive/emergency leave requires a medical or supporting document."),
    bullet("Stay-Duty: Casualty, OBG and Paediatrics postings carry mandatory in-house stay-duty. Allotted room numbers are circulated separately by the Coordination Cell."),
    bullet("Reporting: Interns must report to the respective HOD's office on the FIRST DAY of each posting by 08:30 hrs with their internship logbook and the official intimation letter."),
    bullet("Conduct: Interns shall observe the code of conduct of YMC and the Indian Medical Council. Any deviation will be referred to the Internship Evaluation Committee."),
    bullet("Communication: All circulars, notices and changes will be published on the YMC CRMI Portal (ymc-crmi-portal.vercel.app). Interns are required to check the portal daily."),
    bullet("Completion Certificate: A department-wise Posting Completion Report (digitally signed by HOD, CRMI Coordinator and Principal) will be auto-released on the Portal the day following the effective end date of each posting."),
    spacer(),
  ];
}

// ─── 4. Block-wise Department Schedule Table ───────────────────────────────
function buildBlockScheduleTable(): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [H2("Block-wise Department Allocation")];

  for (const block of BLOCKS) {
    out.push(H3(`Block ${["I", "II", "III", "IV"][block.id - 1]} — ${block.depts.length} Departments · 13 weeks total per cycle`));

    const rows: TableRow[] = [];
    // Header row
    rows.push(new TableRow({
      tableHeader: true,
      children: [
        cell("Sl. No.", { bold: true, bg: INDIGO, size: 18 }),
        cell("Department", { bold: true, bg: INDIGO, size: 18 }),
        cell("Code", { bold: true, bg: INDIGO, size: 18 }),
        cell("Weeks", { bold: true, bg: INDIGO, align: AlignmentType.CENTER, size: 18 }),
        cell("CL Entitlement", { bold: true, bg: INDIGO, align: AlignmentType.CENTER, size: 18 }),
      ],
    }));
    // Make header cells white text — workaround: rebuild with explicit white
    rows[0] = new TableRow({
      tableHeader: true,
      children: ["Sl. No.", "Department", "Code", "Weeks", "CL Entitlement"].map((h, i) =>
        new TableCell({
          shading: { type: ShadingType.CLEAR, color: "auto", fill: INDIGO },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            alignment: i >= 3 ? AlignmentType.CENTER : undefined,
            children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 20 })],
          })],
        })
      ),
    });

    block.depts.forEach((d, i) => {
      const bg = i % 2 === 0 ? "FFFFFF" : SLATE_100;
      rows.push(new TableRow({
        children: [
          cell(String(i + 1), { bg, align: AlignmentType.CENTER }),
          cell(d.name, { bg }),
          cell(d.short, { bg, bold: true }),
          cell(`${d.weeks} week${d.weeks > 1 ? "s" : ""}`, { bg, align: AlignmentType.CENTER }),
          cell(d.casualLeaveDays === "Nil" ? "Nil" : `${d.casualLeaveDays} day(s)`, { bg, align: AlignmentType.CENTER }),
        ],
      }));
    });

    out.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
    out.push(spacer());
  }
  return out;
}

// ─── 5. Sample 52-Week Calendar (for sub-batch A1 as the canonical reference) ──
function buildCalendarTable(): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    H2("Representative 52-Week Calendar"),
    P("The table below shows the canonical posting sequence for an intern starting in the first sub-batch of each block. Other sub-batches follow the same departments rotated cyclically within their block.", { italic: true }),
  ];

  // Pick representative assignments — one student per block (first in sub-batch A1, B1, C1, D1)
  const assignments = buildAssignments();
  const repBlock1 = assignments.find((a) => a.subBatch === "A1");
  if (!repBlock1) return out;

  const rows: TableRow[] = [];
  // Header
  rows.push(new TableRow({
    tableHeader: true,
    children: ["Week #", "Period (From – To)", "Block", "Department", "Code"].map((h, i) =>
      new TableCell({
        shading: { type: ShadingType.CLEAR, color: "auto", fill: INDIGO },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          alignment: i === 0 || i === 2 ? AlignmentType.CENTER : undefined,
          children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 20 })],
        })],
      })
    ),
  }));

  // Each row = one week. Group consecutive same-dept weeks would be nicer but
  // a flat 52-row table is the most unambiguous for HODs.
  // Better: collapse consecutive same-dept weeks into one row showing the range.
  let cursor = 0;
  while (cursor < repBlock1.rotation.length) {
    const start = repBlock1.rotation[cursor];
    let end = start;
    let j = cursor + 1;
    while (j < repBlock1.rotation.length && repBlock1.rotation[j].deptCode === start.deptCode) {
      end = repBlock1.rotation[j];
      j++;
    }
    const startWeek = getWeekDates(start.weekIdx);
    const endWeek = getWeekDates(end.weekIdx);
    const period = `${format(startWeek.start, "dd MMM yyyy")} – ${format(endWeek.end, "dd MMM yyyy")}`;
    const weekRange = start.weekIdx === end.weekIdx
      ? `W${start.weekIdx + 1}`
      : `W${start.weekIdx + 1}–W${end.weekIdx + 1}`;

    // Determine which block this dept belongs to
    const blockOfDept = BLOCKS.find((b) => b.depts.some((d) => d.code === start.deptCode));
    const blockRoman = blockOfDept ? ["I", "II", "III", "IV"][blockOfDept.id - 1] : "—";

    const idx = rows.length;
    const bg = idx % 2 === 0 ? SLATE_100 : "FFFFFF";
    rows.push(new TableRow({
      children: [
        cell(weekRange, { bg, align: AlignmentType.CENTER, bold: true }),
        cell(period, { bg }),
        cell(`Block ${blockRoman}`, { bg, align: AlignmentType.CENTER }),
        cell(start.deptName, { bg }),
        cell(start.deptShort, { bg, bold: true }),
      ],
    }));
    cursor = j;
  }

  out.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  out.push(spacer());
  return out;
}

// ─── 6. Intern Distribution Tables (one per block) ─────────────────────────
function buildInternDistribution(): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    H2("Batch-wise Intern Distribution"),
    P("Interns are distributed across four blocks and further into sub-batches A1–A13 (Block I), B1–B13 / B14 (Block II), C1–C13 (Block III), D1–D13 (Block IV). 21M055 (Insha Sanover) joined mid-batch and is assigned to sub-batch B14 following the same schedule as B1.", { italic: true }),
    spacer(),
  ];

  const assignments = buildAssignments();
  const blockNames = ["", "Block I", "Block II", "Block III", "Block IV"];

  for (const blockId of [1, 2, 3, 4] as const) {
    const blockAssignments = assignments
      .filter((a) => a.blockId === blockId)
      .sort((a, b) => a.student.regNo.localeCompare(b.student.regNo));

    out.push(H3(`${blockNames[blockId]} — ${blockAssignments.length} Interns`));

    const rows: TableRow[] = [];
    // Header
    rows.push(new TableRow({
      tableHeader: true,
      children: ["Sl. No.", "Name of Intern", "Reg. No.", "Sub-batch"].map((h, i) =>
        new TableCell({
          shading: { type: ShadingType.CLEAR, color: "auto", fill: INDIGO },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            alignment: i === 0 || i === 3 ? AlignmentType.CENTER : (i === 2 ? AlignmentType.CENTER : undefined),
            children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 20 })],
          })],
        })
      ),
    }));

    blockAssignments.forEach((a, i) => {
      const bg = i % 2 === 0 ? "FFFFFF" : SLATE_100;
      rows.push(new TableRow({
        children: [
          cell(String(i + 1), { bg, align: AlignmentType.CENTER }),
          cell(a.student.name, { bg }),
          cell(a.student.regNo, { bg, align: AlignmentType.CENTER, bold: true }),
          cell(a.subBatch, { bg, align: AlignmentType.CENTER, bold: true }),
        ],
      }));
    });

    out.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
    out.push(spacer());
  }

  return out;
}

// ─── 6.5. 52-Week Posting Matrix (landscape — departments × weeks) ─────────
// Returns the children for a LANDSCAPE section. Caller assembles it as a
// separate section in the Document.
function buildPostingMatrix(): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [
    H2("52-Week Posting Matrix"),
    P("Columns: departments. Rows: weeks (with period). Each cell lists the sub-batches posted to that department in that week. Use this matrix to track intern movement across the academic year at a glance.", { italic: true }),
    spacer(),
  ];

  const assignments = buildAssignments();
  // Unique sub-batches and their rotation arrays
  const subBatchRotation = new Map<string, Map<number, string>>(); // subBatch → (weekIdx → deptCode)
  for (const a of assignments) {
    if (!subBatchRotation.has(a.subBatch)) {
      const m = new Map<number, string>();
      for (const r of a.rotation) m.set(r.weekIdx, r.deptCode);
      subBatchRotation.set(a.subBatch, m);
    }
  }
  // Sort sub-batches: A1..A13, B1..B14, C1..C13, D1..D13
  const subBatchSort = (s: string) => {
    const letter = s.charCodeAt(0);
    const num = parseInt(s.slice(1), 10);
    return letter * 100 + num;
  };

  // All departments in canonical block order
  const allDepts = BLOCKS.flatMap((b) => b.depts);

  // For each week, for each dept, collect the sub-batches posted there
  const matrix: Array<Map<string, string[]>> = []; // matrix[weekIdx] = Map<deptCode, subBatch[]>
  for (let w = 0; w < 52; w++) {
    const cellMap = new Map<string, string[]>();
    for (const dept of allDepts) cellMap.set(dept.code, []);
    for (const [subBatch, rotMap] of subBatchRotation) {
      const dept = rotMap.get(w);
      if (dept) cellMap.get(dept)?.push(subBatch);
    }
    // sort sub-batches alphabetically within each cell
    for (const list of cellMap.values()) list.sort((a, b) => subBatchSort(a) - subBatchSort(b));
    matrix.push(cellMap);
  }

  // Build the table — header rows (block band + dept short codes)
  const colWidth = Math.floor(100 / (allDepts.length + 2)); // +2 for Week# and Period

  // Row 1: block-band header (groups depts by their block)
  const blockBandCells: TableCell[] = [];
  blockBandCells.push(headerCell("", "FFFFFF", { color: INDIGO, span: 1 }));
  blockBandCells.push(headerCell("", "FFFFFF", { color: INDIGO, span: 1 }));
  for (const block of BLOCKS) {
    const span = block.depts.length;
    blockBandCells.push(
      new TableCell({
        columnSpan: span,
        shading: { type: ShadingType.CLEAR, color: "auto", fill: INDIGO },
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Block ${["I", "II", "III", "IV"][block.id - 1]}`, bold: true, color: "FFFFFF", size: 14 })],
        })],
      })
    );
  }

  // Row 2: column headers (Week#, Period, dept short codes)
  const deptHeaderCells: TableCell[] = [
    headerCell("Week", ORANGE, { width: 5 }),
    headerCell("Period", ORANGE, { width: 14 }),
    ...allDepts.map((d) => headerCell(d.short, SLATE_700, { width: colWidth })),
  ];

  const rows: TableRow[] = [
    new TableRow({ tableHeader: true, children: blockBandCells }),
    new TableRow({ tableHeader: true, children: deptHeaderCells }),
  ];

  // Data rows — one per week
  for (let w = 0; w < 52; w++) {
    const week = getWeekDates(w);
    const period = `${format(week.start, "dd.MM")} – ${format(week.end, "dd.MM.yy")}`;
    const bg = w % 2 === 0 ? "FFFFFF" : SLATE_100;

    const cells: TableCell[] = [
      // Week #
      new TableCell({
        shading: { type: ShadingType.CLEAR, color: "auto", fill: bg },
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `W${w + 1}`, bold: true, size: 14, color: INDIGO })],
        })],
      }),
      // Period
      new TableCell({
        shading: { type: ShadingType.CLEAR, color: "auto", fill: bg },
        margins: { top: 40, bottom: 40, left: 40, right: 40 },
        children: [new Paragraph({
          children: [new TextRun({ text: period, size: 12, color: SLATE_700 })],
        })],
      }),
      // Dept cells
      ...allDepts.map((dept) => {
        const subBatches = matrix[w].get(dept.code) || [];
        const text = subBatches.length === 0 ? "—" : subBatches.join(", ");
        return new TableCell({
          shading: { type: ShadingType.CLEAR, color: "auto", fill: bg },
          margins: { top: 40, bottom: 40, left: 40, right: 40 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text,
              size: 12,
              color: subBatches.length === 0 ? "CBD5E1" : SLATE_700,
            })],
          })],
        });
      }),
    ];

    rows.push(new TableRow({ children: cells }));
  }

  out.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  out.push(spacer());
  out.push(P("Legend: A1–A13 sub-batches of Block I; B1–B14 of Block II (B14 = Insha Sanover); C1–C13 of Block III; D1–D13 of Block IV. Each block runs in parallel; the four-quarter rotation means every intern visits all 17 departments by year-end.", { italic: true, size: 18 }));

  return out;
}

// Helper: header cell with custom background colour
function headerCell(text: string, bg: string, opts: { width?: number; color?: string; span?: number } = {}): TableCell {
  return new TableCell({
    columnSpan: opts.span,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: { type: ShadingType.CLEAR, color: "auto", fill: bg },
    margins: { top: 50, bottom: 50, left: 40, right: 40 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, color: opts.color ?? "FFFFFF", size: 14 })],
    })],
  });
}

// ─── 7. Sign-off Block ─────────────────────────────────────────────────────
function buildSignoff(): Paragraph[] {
  return [
    spacer(),
    P("Thanking you and assuring our fullest co-operation."),
    spacer(),
    P("Yours faithfully,", { italic: true }),
    new Paragraph({ spacing: { before: 600 }, children: [new TextRun("")] }),
    new Paragraph({
      children: [new TextRun({ text: PRINCIPAL, bold: true, size: 24 })],
    }),
    P("Principal", { bold: true }),
    P("Yenepoya Medical College, Mangalore"),
    spacer(),
    spacer(),
    H3("CRMI Coordination Cell"),
    ...COORDINATORS.flatMap((c) => [
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: `${c.name}  `, bold: true, size: 22 }),
          new TextRun({ text: `— ${c.focus}`, size: 20, color: SLATE_500 }),
        ],
      }),
    ]),
    spacer(),
    P(`Copy to: 1. The Vice-Chancellor, Yenepoya (Deemed to be University)`, { size: 20 }),
    P(`             2. The Dean, Faculty of Medicine`, { size: 20 }),
    P(`             3. The Medical Superintendent, YMCH`, { size: 20 }),
    P(`             4. All Heads of Departments / Heads of Units`, { size: 20 }),
    P(`             5. The CRMI Coordination Cell`, { size: 20 }),
    P(`             6. Office copy / file`, { size: 20 }),
  ];
}

// ─── Main: assemble and write ──────────────────────────────────────────────
async function main() {
  const doc = new Document({
    creator: "Yenepoya Medical College — CRMI Coordination Cell",
    title: "CRMI Posting Allotment 2026-2027",
    description: "Compulsory Rotatory Medical Internship Programme — MBBS 2021 CBME Batch — Posting allotment and rotation schedule for HOD / HOU circulation.",
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
      },
    },
    sections: [
      // Section 1 — main content (portrait)
      {
        properties: {
          page: {
            margin: { top: 1100, right: 1000, bottom: 1100, left: 1000 },
            size: { orientation: PageOrientation.PORTRAIT },
          },
        },
        children: [
          ...buildLetterhead(),
          ...buildSalutation(),
          ...buildInstructions(),
          ...buildBlockScheduleTable(),
          ...buildCalendarTable(),
          ...buildInternDistribution(),
        ],
      },
      // Section 2 — 52-week posting matrix (LANDSCAPE for 17 dept columns)
      {
        properties: {
          page: {
            margin: { top: 700, right: 700, bottom: 700, left: 700 },
            size: { orientation: PageOrientation.LANDSCAPE },
          },
        },
        children: [
          ...buildPostingMatrix(),
        ],
      },
      // Section 3 — sign-off (portrait again)
      {
        properties: {
          page: {
            margin: { top: 1100, right: 1000, bottom: 1100, left: 1000 },
            size: { orientation: PageOrientation.PORTRAIT },
          },
        },
        children: [
          ...buildSignoff(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = "/tmp/crmi-circular.docx";
  writeFileSync(outPath, buffer);
  console.log(`✅ Generated: ${outPath} (${Math.round(buffer.length / 1024)} KB)`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
