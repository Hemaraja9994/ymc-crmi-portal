export type Admin = {
  name: string;
  role: string;
  email?: string;
  phone?: string;         // primary tel: link for the Call button
  isPrincipal?: boolean;
  isWelfareOfficer?: boolean;
  focus?: string[];      // areas they typically handle
  officeHours?: string;  // visible to students for walk-ins
  responseSla?: string;  // typical reply time
  address?: string;      // shown on card (principal / key desks only)
};

export const ADMINS: Admin[] = [
  {
    name: "Dr. Prakash Robert M. Saldanha",
    role: "Principal / Dean",
    email: "principalymc@yenepoya.edu.in",
    phone: "tel:+918242204668",
    isPrincipal: true,
    focus: ["Policy decisions", "Final approvals", "Escalations"],
    officeHours: "Mon–Fri · 10:00–12:00",
    responseSla: "Within 24h",
    address: "Yenepoya Medical College, University Road, Deralakatte, Mangalore – 575018, Karnataka",
  },
  {
    name: "Mrs. Obeida Shoukath",
    role: "Student Welfare Officer (YMC) & Counsellor",
    email: "counsellor@yenepoya.edu.in",
    phone: "tel:+919945144399",
    isWelfareOfficer: true,
    focus: ["Wellbeing", "Student grievances", "Non-academic support", "Hostel coordination", "International student cell"],
    officeHours: "Mon–Sat · 09:00–17:00",
    responseSla: "Same day",
  },
  {
    name: "Dr. Jeevan Crasta",
    role: "Internship Coordinator",
    email: "hospital@yenepoya.org",
    phone: "tel:+918242204668",
    focus: ["Posting allocation", "Block I & II issues", "Schedule changes"],
    officeHours: "Mon–Sat · 09:00–17:00",
    responseSla: "Within 4h",
  },
  {
    name: "Dr. Imaad Mohammed Ismail",
    role: "Internship Coordinator",
    email: "hospital@yenepoya.org",
    phone: "tel:+918242204668",
    focus: ["Logbook compliance", "Casual leave approvals", "Attendance"],
    officeHours: "Mon–Sat · 09:00–17:00",
    responseSla: "Within 4h",
  },
  {
    name: "Dr. S. Abdul Nazir",
    role: "Internship Coordinator",
    email: "hospital@yenepoya.org",
    phone: "tel:+918242204668",
    focus: ["Block III & IV postings", "Community Medicine field work"],
    officeHours: "Mon–Sat · 09:00–17:00",
    responseSla: "Within 4h",
  },
  {
    name: "Dr. Rashmi Jain",
    role: "Internship Coordinator",
    email: "hospital@yenepoya.org",
    phone: "tel:+918242204668",
    focus: ["Wellbeing", "Personal / medical leave", "Hostel concerns"],
    officeHours: "Mon–Fri · 11:00–16:00",
    responseSla: "Same day",
  },
  {
    name: "Dr. Rohith George",
    role: "Coordinator — General Medicine",
    email: "hospital@yenepoya.org",
    phone: "tel:+918242204668",
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
} as const;
