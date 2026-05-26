export type Admin = {
  name: string;
  role: string;
  email?: string;
  isPrincipal?: boolean;
  focus?: string[];      // areas they typically handle
  officeHours?: string;  // visible to students for walk-ins
  responseSla?: string;  // typical reply time
};

export const ADMINS: Admin[] = [
  {
    name: "Dr. Prakash Saldanha",
    role: "Principal, YMC",
    isPrincipal: true,
    focus: ["Policy decisions", "Final approvals", "Escalations"],
    officeHours: "Mon–Fri · 10:00–12:00",
    responseSla: "Within 24h",
  },
  {
    name: "Dr. Jeevan",
    role: "Internship Coordinator",
    focus: ["Posting allocation", "Block I & II issues", "Schedule changes"],
    officeHours: "Mon–Sat · 09:00–17:00",
    responseSla: "Within 4h",
  },
  {
    name: "Dr. Imaad",
    role: "Internship Coordinator",
    focus: ["Logbook compliance", "Casual leave approvals", "Attendance"],
    officeHours: "Mon–Sat · 09:00–17:00",
    responseSla: "Within 4h",
  },
  {
    name: "Dr. S",
    role: "Internship Coordinator",
    focus: ["Block III & IV postings", "Community Medicine field work"],
    officeHours: "Mon–Sat · 09:00–17:00",
    responseSla: "Within 4h",
  },
  {
    name: "Dr. Rashmi Jain",
    role: "Internship Coordinator",
    focus: ["Wellbeing", "Personal / medical leave", "Hostel concerns"],
    officeHours: "Mon–Fri · 11:00–16:00",
    responseSla: "Same day",
  },
  {
    name: "Dr. Rohith",
    role: "Coordinator — General Medicine",
    focus: ["Gen Med posting queries", "Unit allocation", "Case load"],
    officeHours: "Mon–Sat · 09:00–17:00",
    responseSla: "Within 4h",
  },
];

// In production replace with real auth (NextAuth + institutional SSO).
export const ADMIN_PASSCODES = ADMINS.map((a) => a.name.toLowerCase().replace(/[^a-z]/g, ""));

// ── Institutional communication endpoints ───────────────────────────────────
// Routed via the portal's integrated mail router (mailto + tracking on send).
export const COMMUNICATION_HUB = {
  principal: {
    label: "Principal Administrative Queries",
    email: "principalymc@yenepoya.edu.in",
    purpose: "Policy escalations, final sign-offs, certificate disputes.",
  },
  general: {
    label: "General Intern Postings & Portal Support",
    email: "hospital@yenepoya.org",
    purpose: "Day-to-day postings questions, technical portal issues, login resets.",
  },
} as const;
