export type Admin = {
  name: string;
  role: string;
  email?: string;
  isPrincipal?: boolean;
};

export const ADMINS: Admin[] = [
  { name: "Dr. Prakash Saldanha", role: "Principal, YMC", isPrincipal: true },
  { name: "Dr. Jeevan", role: "Internship Coordinator" },
  { name: "Dr. Imaad", role: "Internship Coordinator" },
  { name: "Dr. S", role: "Internship Coordinator" },
  { name: "Dr. Rashmi Jain", role: "Internship Coordinator" },
  { name: "Dr. Rohith", role: "Internship Coordinator — General Medicine" },
];

// In production replace with real auth (NextAuth + institutional SSO).
export const ADMIN_PASSCODES = ADMINS.map((a) => a.name.toLowerCase().replace(/[^a-z]/g, ""));
