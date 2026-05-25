import { NextRequest, NextResponse } from "next/server";
import { EmailStatus } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { getResendClient, scheduleEmailFrom } from "@/lib/server/email";
import { currentWeekIndex, findAssignmentByCampusId, getWeekDates, TOTAL_WEEKS } from "@/lib/rotation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
}

function scheduleEmailHtml({
  name,
  regNo,
  weekIdx,
  label,
  deptName,
  deptShort,
}: {
  name: string;
  regNo: string;
  weekIdx: number;
  label: string;
  deptName: string;
  deptShort: string;
}) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#0f172a">
      <h2 style="margin:0 0 8px">YMC CRMI Weekly Posting Schedule</h2>
      <p style="margin:0 0 16px;color:#475569">Dear ${name}, here is your posting schedule for Week ${weekIdx + 1}.</p>
      <div style="border:1px solid #cbd5e1;border-radius:14px;padding:16px;background:#f8fafc">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748b">Intern</div>
        <strong>${name} (${regNo})</strong>
        <div style="height:12px"></div>
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748b">Week</div>
        <strong>${label}</strong>
        <div style="height:12px"></div>
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748b">Department</div>
        <strong>${deptShort} - ${deptName}</strong>
      </div>
      <p style="margin-top:16px;color:#64748b;font-size:12px">This is an automated CRMI coordination email.</p>
    </div>
  `;
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return unauthorized();
  }

  const resend = getResendClient();
  if (!resend) {
    return NextResponse.json({
      ok: true,
      configured: false,
      message: "RESEND_API_KEY is not configured; no emails were sent.",
    });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const weekIdx = Math.min(TOTAL_WEEKS - 1, currentWeekIndex(new Date()));
  const week = getWeekDates(weekIdx);
  const students = await prisma.student.findMany({
    where: {
      email: { not: null },
    },
    orderBy: [{ slNo: "asc" }],
  });

  const results: Array<{ regNo: string; status: EmailStatus; messageId?: string; error?: string }> = [];

  for (const student of students) {
    const existing = await prisma.weeklyEmailLog.findUnique({
      where: {
        regNo_weekIdx: {
          regNo: student.regNo,
          weekIdx,
        },
      },
    });

    if (existing?.status === "Sent") {
      results.push({ regNo: student.regNo, status: "Skipped" });
      continue;
    }

    const assignment = findAssignmentByCampusId(student.regNo);
    const cell = assignment?.rotation.find((posting) => posting.weekIdx === weekIdx);
    if (!assignment || !cell || !student.email) {
      results.push({ regNo: student.regNo, status: "Skipped", error: "No schedule or email available." });
      continue;
    }

    try {
      const { data, error } = await resend.emails.send({
        from: scheduleEmailFrom,
        to: [student.email],
        subject: `YMC CRMI Week ${weekIdx + 1}: ${cell.deptShort} posting`,
        html: scheduleEmailHtml({
          name: student.name,
          regNo: student.regNo,
          weekIdx,
          label: week.label,
          deptName: cell.deptName,
          deptShort: cell.deptShort,
        }),
      });

      if (error) throw new Error(error.message);

      await prisma.weeklyEmailLog.upsert({
        where: { regNo_weekIdx: { regNo: student.regNo, weekIdx } },
        update: {
          status: "Sent",
          messageId: data?.id,
          error: null,
          sentAt: new Date(),
        },
        create: {
          studentId: student.id,
          regNo: student.regNo,
          weekIdx,
          status: "Sent",
          messageId: data?.id,
        },
      });

      results.push({ regNo: student.regNo, status: "Sent", messageId: data?.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email error";
      await prisma.weeklyEmailLog.upsert({
        where: { regNo_weekIdx: { regNo: student.regNo, weekIdx } },
        update: {
          status: "Failed",
          error: message,
          sentAt: new Date(),
        },
        create: {
          studentId: student.id,
          regNo: student.regNo,
          weekIdx,
          status: "Failed",
          error: message,
        },
      });
      results.push({ regNo: student.regNo, status: "Failed", error: message });
    }
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    weekIdx,
    weekLabel: week.label,
    total: results.length,
    sent: results.filter((result) => result.status === "Sent").length,
    skipped: results.filter((result) => result.status === "Skipped").length,
    failed: results.filter((result) => result.status === "Failed").length,
    results,
  });
}
