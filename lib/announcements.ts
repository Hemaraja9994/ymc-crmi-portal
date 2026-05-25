export type Announcement = {
  id: string;
  title: string;
  body: string;
  category: "Rule" | "Schedule" | "Notice" | "Alert";
  highlight?: boolean;
  date: string;
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "NMC Logbook submission — mandatory weekly upload",
    body: "Effective immediately, all interns must upload signed weekly logbook entries before Saturday 18:00. Non-submission will count as absence.",
    category: "Rule",
    highlight: true,
    date: "2026-06-01",
  },
  {
    id: "a2",
    title: "Stay-duty rooms allocated — Casualty / OBG / Paeds",
    body: "Refer to YMC notice (Stay-duty rooms for Medical Interns) for room numbers. Allocation is per sub-batch.",
    category: "Notice",
    date: "2026-05-28",
  },
  {
    id: "a3",
    title: "Campus transport — extended 21:00 to 06:00",
    body: "Night-duty interns may avail the extended campus transport facility as per the YMC notice dated May 2026.",
    category: "Notice",
    date: "2026-05-26",
  },
  {
    id: "a4",
    title: "Attendance threshold — 80% per posting strictly enforced",
    body: "Any intern falling below 80% in a posting will be required to repeat that posting before issuance of the Completion Certificate.",
    category: "Rule",
    highlight: true,
    date: "2026-05-20",
  },
  {
    id: "a5",
    title: "Final clinical-skills assessment — March/April 2027",
    body: "Mark your calendars. The exam panel will be notified two weeks in advance.",
    category: "Schedule",
    date: "2026-05-15",
  },
];

export const CATEGORY_STYLES: Record<Announcement["category"], string> = {
  Rule: "bg-amber-100 text-amber-800 ring-amber-200",
  Schedule: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  Notice: "bg-slate-100 text-slate-700 ring-slate-200",
  Alert: "bg-rose-100 text-rose-800 ring-rose-200",
};
