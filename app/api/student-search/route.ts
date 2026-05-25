import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { findStudent } from "@/lib/students";
import { currentWeekIndex, findAssignmentByCampusId, getWeekDates, isPreLaunch, TOTAL_WEEKS } from "@/lib/rotation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function rowsForStudent(regNo: string) {
  const assignment = findAssignmentByCampusId(regNo);
  if (!assignment) return null;
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, idx) => ({
    idx,
    ...getWeekDates(idx),
    cell: assignment.rotation.find((rotation) => rotation.weekIdx === idx)!,
  }));
  return {
    assignment,
    weeks,
    currentWeek: isPreLaunch(new Date()) ? -1 : currentWeekIndex(new Date()),
    preLaunch: isPreLaunch(new Date()),
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = String(body.query || "").trim();
  if (!query) {
    return NextResponse.json({ error: "Campus ID / Roll Number is required." }, { status: 400 });
  }

  let student:
    | {
        regNo: string;
        campusId: string;
        name: string;
      }
    | null
    | undefined;

  if (process.env.DATABASE_URL) {
    const q = query.toLowerCase();
    student = await prisma.student.findFirst({
      where: {
        OR: [
          { regNo: { equals: query, mode: "insensitive" } },
          { campusId: { equals: query, mode: "insensitive" } },
          { name: { equals: query, mode: "insensitive" } },
          { phone: query },
          { email: { equals: q, mode: "insensitive" } },
        ],
      },
      select: {
        regNo: true,
        campusId: true,
        name: true,
      },
    });
  } else {
    student = findStudent(query);
  }

  if (!student) {
    return NextResponse.json(
      { error: "No student found. Try your Roll No, registered phone or institutional email." },
      { status: 404 }
    );
  }

  const result = rowsForStudent(student.regNo);
  if (!result) {
    return NextResponse.json({ error: "Schedule not yet generated for this student." }, { status: 404 });
  }

  return NextResponse.json({
    student: {
      regNo: student.regNo,
      name: student.name,
    },
    assignment: {
      blockId: result.assignment.blockId,
      subBatch: result.assignment.subBatch,
    },
    weeks: result.weeks,
    currentWeek: result.currentWeek,
    preLaunch: result.preLaunch,
  });
}
