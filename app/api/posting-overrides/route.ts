import { NextRequest, NextResponse } from "next/server";
import { AuditAction } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { deptByCode, findAssignmentByCampusId } from "@/lib/rotation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return jsonError("DATABASE_URL is not configured.", 503);
  }

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body.");

  const regNo = String(body.regNo || "").trim().toUpperCase();
  const weekIdx = Number(body.weekIdx);
  const newDeptCode = String(body.newDeptCode || "").trim().toUpperCase();
  const actor = String(body.actor || request.headers.get("x-coordinator-id") || "coordinator").trim();
  const reason = String(body.reason || "").trim();

  if (!regNo) return jsonError("Student registration number is required.");
  if (!Number.isInteger(weekIdx) || weekIdx < 0 || weekIdx > 51) return jsonError("weekIdx must be an integer from 0 to 51.");
  if (!newDeptCode || !deptByCode(newDeptCode)) return jsonError("A valid target department code is required.");
  if (!reason) return jsonError("Reason is required for posting overrides.");

  const student = await prisma.student.findUnique({ where: { regNo } });
  if (!student) return jsonError("Student was not found in the database.", 404);

  const assignment = findAssignmentByCampusId(regNo);
  const previous = assignment?.rotation.find((cell) => cell.weekIdx === weekIdx);
  const targetDept = deptByCode(newDeptCode)!;

  const override = await prisma.postingOverride.create({
    data: {
      regNo,
      weekIdx,
      previousDeptCode: previous?.deptCode,
      previousDeptName: previous?.deptName,
      newDeptCode,
      newDeptName: targetDept.name,
      actor,
      reason,
    },
  });

  const before = previous
    ? {
        regNo,
        weekIdx,
        deptCode: previous.deptCode,
        deptName: previous.deptName,
      }
    : undefined;

  await prisma.auditLog.create({
    data: {
      action: AuditAction.PostingOverrideCreated,
      actor,
      entityType: "PostingOverride",
      entityId: override.id,
      before,
      after: {
        regNo,
        weekIdx,
        deptCode: newDeptCode,
        deptName: targetDept.name,
      },
      reason,
    },
  });

  return NextResponse.json({ override }, { status: 201 });
}
