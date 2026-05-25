# YMC CRMI Management Portal - MBBS 2021 CBME Batch

Compulsory Rotatory Medical Internship management portal for Yenepoya Medical College, Mangalore. Effective 01 June 2026.

## Stack

- Next.js 14 App Router, TypeScript, Tailwind CSS
- Prisma ORM with PostgreSQL, compatible with Neon or Vercel Postgres
- Resend for scheduled weekly posting emails
- lucide-react icons and date-fns calendar utilities
- Deploy target: Vercel

## Quick Start

```bash
npm install
npm run dev
npm run build
```

After `DATABASE_URL` is configured:

```bash
npm run prisma:migrate
npm run prisma:seed
```

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  student/page.tsx
  student/[id]/page.tsx
  admin/page.tsx
  api/leave/route.ts
  api/student-search/route.ts
  api/posting-overrides/route.ts
  api/cron/weekly-schedules/route.ts
components/
  StudentDashboard.tsx
  AdminOverview.tsx
  LeaveInbox.tsx
lib/
  students.ts
  rotation.ts
  leaves.ts
  server/prisma.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
```

## Production Data Setup

Add these environment variables in Vercel:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
RESEND_API_KEY="re_xxxxxxxxx"
SCHEDULE_EMAIL_FROM="YMC CRMI Portal <no-reply@your-domain.edu>"
CRON_SECRET="replace-with-a-long-random-secret"
```

Run the database migration and seed once from a trusted shell:

```bash
npm run prisma:migrate
npm run prisma:seed
```

## Implemented Backend Functions

- Student records are modeled in Postgres via Prisma and seeded from the current 2021 CBME roster.
- Leave requests persist in Postgres through `/api/leave`.
- `/api/leave` supports `GET`, `POST` submit, and `PATCH` approve/reject.
- Leave decisions write audit records.
- Coordinator posting overrides can be recorded through `/api/posting-overrides`; every override writes an audit record.
- Weekly schedule emails are sent by `/api/cron/weekly-schedules` using Resend.
- `vercel.json` schedules the weekly email job every Monday at 02:00 UTC.

## Posting Engine

The rotation engine in `lib/rotation.ts` still computes the deterministic 52-week posting matrix used across the UI. Postgres now stores students, leave workflow state, weekly email logs, posting override records, and audit entries.

## Next Steps

- Add authenticated coordinator identity checks to API route guards.
- Store uploaded leave documents in object storage instead of filename references.
- Add a coordinator UI for posting overrides and audit log review.
