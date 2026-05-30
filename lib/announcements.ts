export type Announcement = {
  id: string;
  title: string;
  body: string;
  category: "Rule" | "Attendance" | "Schedule" | "Notice" | "Alert";
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
    title: "Stay-duty (7 PM – 8 AM) — Medicine / Surgery / OBG / Paediatrics",
    body: "Stay-duty applies only in the major departments. Refer to the YMC stay-duty notice for room allocation per sub-batch.",
    category: "Notice",
    date: "2026-05-28",
  },
  {
    id: "a3",
    title: "Bus facility — hospital to hostel at 7 & 8 PM",
    body: "As per the YMC notice, transport runs hospital → hostel at 7:00 and 8:00 PM. No additional transport will be provided.",
    category: "Notice",
    date: "2026-05-26",
  },
  {
    id: "a4",
    title: "100% Attendance — strictly enforced per clinical posting",
    body: "Any intern falling below 100% attendance in a posting must repeat that posting before the Completion Certificate is issued.",
    category: "Attendance",
    highlight: true,
    date: "2026-05-20",
  },
  {
    id: "a5",
    title: "Clinical Skill Assessment — 11 & 12 June 2027",
    body: "Mark your calendars. Required before the internship completion certificate is issued.",
    category: "Schedule",
    date: "2026-05-15",
  },
  {
    id: "a6",
    title: "BLS & ACLS (AHA certified) — mandatory within 2 months",
    body: "All interns must complete AHA-certified BLS & ACLS within two months of starting. Non-completion means ineligibility for internship completion.",
    category: "Alert",
    highlight: true,
    date: "2026-05-30",
  },
  {
    id: "a7",
    title: "Biometric attendance — punch without fail",
    body: "Mark attendance on the biometric machine without fail; failure leads to stipend deduction. Attendance is also recorded twice daily at 8 AM and 4 PM.",
    category: "Rule",
    date: "2026-05-30",
  },
];

export const CATEGORY_STYLES: Record<Announcement["category"], string> = {
  Rule:       "bg-amber-100 text-amber-800 ring-amber-200",
  Attendance: "bg-orange-100 text-orange-800 ring-orange-200",
  Schedule:   "bg-indigo-100 text-indigo-800 ring-indigo-200",
  Notice:     "bg-slate-100 text-slate-700 ring-slate-200",
  Alert:      "bg-rose-100 text-rose-800 ring-rose-200",
};
