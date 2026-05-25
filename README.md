# YMC CRMI Management Portal — MBBS 2021 CBME Batch

Compulsory Rotatory Medical Internship management portal for **Yenepoya Medical College, Mangalore**. Effective **01 June 2026**.

## Stack
- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **lucide-react** icons, **date-fns** for calendar math
- Deploy target: **Vercel** (zero-config)

## Quick start
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

## Project structure
```
app/
  layout.tsx                # global shell + nav
  page.tsx                  # landing
  student/page.tsx          # Campus-ID + OTP login (passwordless demo)
  student/[id]/page.tsx     # Personalised dashboard
  admin/page.tsx            # Coordinator HR-style dashboard
  guidelines/               # CBME compliance
  posting-guidelines/       # Shift / rotation protocols
  leave-attendance/         # Casual leave + attendance %
  support/                  # Coordinator contacts
components/
  StudentDashboard.tsx      # Year / Month / Week views + Leave UI
  AdminDashboard.tsx        # KPIs + dept distribution + roster
lib/
  students.ts               # 113 interns extracted from official YMC list
  rotation.ts               # Block I–IV engine + 52-week calendar
  admins.ts                 # Authorised coordinators
```

## Posting engine (`lib/rotation.ts`)

Implements the **NMC 2021 CBME** structure used at YMC:

| Block | Departments | Weeks |
|-------|-------------|------:|
| I  | Gen Med 6 · ENT 2 · Ophth 2 · Psych 2 · Geriat 1 | 13 |
| II | Gen Surg 6 · Anaes 2 · Ortho 2 · Emerg 2 · Radio 1 | 13 |
| III | Com.Med 12 · Resp 1 | 13 |
| IV | OBG 7 · Paeds 3 · DVL 1 · Forensic 1 · Lab 1 | 13 |

- 113 interns split into 4 blocks (A/B/C/D) → 13 sub-batches per block (A1–A13, …).
- Each sub-batch enters its starting block, then rotates through all four blocks across the 52-week year — staggered so departments are never empty and never overloaded.
- Calendar anchored at **01.06.2026**; current-week is computed live from the server clock.

## Roles
- **Student** — Campus-ID / Roll-No login (demo OTP). Reaches `/student/<regNo>`.
- **Admin / Coordinator** — see `lib/admins.ts`:
  - Dr. Prakash Saldanha (Principal)
  - Dr. Jeevan · Dr. Imaad · Dr. S · Dr. Rashmi Jain · Dr. Rohith (Gen Med)

## Features delivered
- Year / Month / Week timeline views (responsive — table on desktop, cards on mobile)
- Leave request form with **drag-and-drop** PDF/JPG upload + status badges (Pending / Approved / Rejected)
- **Share to WhatsApp** action that auto-formats the schedule message
- Email-schedule trigger button (wire to SendGrid / Resend on deploy)
- Admin KPIs, live department distribution per week, filterable intern roster
- Mandatory information tabs: Guidelines · Posting Guidelines · Leave & Attendance · Support

## Deploy to Vercel
1. Push the repo to GitHub.
2. Import the repo in Vercel — **no configuration needed**.
3. (Optional) add env vars for production auth + notifications:
   - `RESEND_API_KEY` (email)
   - `TWILIO_*` (WhatsApp Business)
   - `NEXTAUTH_*` (if migrating from demo OTP to NextAuth + SAML / Microsoft365)

## Next steps for production hardening
- Replace demo OTP with real institutional SSO (NextAuth + Microsoft 365 / Google Workspace).
- Move student / leave data into Postgres (Neon, Vercel Postgres) via Prisma.
- Add `/api/leave` route handlers (POST submit, PATCH approve/reject) + Postgres persistence.
- Background job to send weekly schedule emails (Vercel Cron + Resend).
- Audit log for any coordinator override on the posting schedule.
