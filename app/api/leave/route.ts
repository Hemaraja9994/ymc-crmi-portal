import { NextRequest, NextResponse } from "next/server";
import { AuditAction, LeaveCategory, LeaveStatus, LeaveType } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { mapLeaveRecord } from "@/lib/server/leave-mapper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEAVE_TYPES = ["Casual", "Medical", "Emergency", "Bereavement", "Academic"] as const;
const LEAVE_CATEGORIES = ["Retroactive", "Advance"] as const;
const LEAVE_DECISIONS = ["Approved", "Rejected"] as const;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function databaseUnavailable() {
  return !process.env.DATABASE_URL ? jsonError("DATABASE_URL is not configured.", 503) : null;
}

function parseDateOnly(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isLeaveType(value: unknown): value is LeaveType {
  return typeof value === "string" && LEAVE_TYPES.includes(value as any);
}

function isLeaveCategory(value: unknown): value is LeaveCategory {
  return typeof value === "string" && LEAVE_CATEGORIES.includes(value as any);
}

function isDecision(value: unknown): value is Extract<LeaveStatus, "Approved" | "Rejected"> {
  return typeof value === "string" && LEAVE_DECISIONS.includes(value as any);
}

export async function GET(request: NextRequest) {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;

  const { searchParams } = new URL(request.url);
  const regNo = searchParams.get("regNo")?.trim();
  const status = searchParams.get("status")?.trim();

  const leaves = await prisma.leaveRequest.findMany({
    where: {
      ...(regNo ? { regNo } : {}),
      ...(status && ["Pending", "Approved", "Rejected"].includes(status) ? { status: status as LeaveStatus } : {}),
    },
    orderBy: [{ submittedAt: "desc" }],
  });

  return NextResponse.json({ leaves: leaves.map(mapLeaveRecord) });
}

export async function POST(request: NextRequest) {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body.");

  const regNo = String(body.regNo || "").trim().toUpperCase();
  const from = parseDateOnly(body.from);
  const to = parseDateOnly(body.to);
  const reason = String(body.reason || "").trim();
  const type = isLeaveType(body.type) ? body.type : null;
  const category = isLeaveCategory(body.category) ? body.category : "Advance";
  const doc = typeof body.doc === "string" && body.doc.trim() ? body.doc.trim() : null;

  if (!regNo) return jsonError("Student registration number is required.");
  if (!type) return jsonError("Valid leave type is required.");
  if (!from || !to) return jsonError("Valid from/to dates are required in YYYY-MM-DD format.");
  if (to < from) return jsonError("Leave end date cannot be before the start date.");
  if (!reason) return jsonError("Reason is required.");
  if (category === "Retroactive" && !doc) return jsonError("Document reference is required for retroactive leave.");

  const student = await prisma.student.findUnique({ where: { regNo } });
  if (!student) return jsonError("Student was not found in the database.", 404);

  const leave = await prisma.leaveRequest.create({
    data: {
      studentId: student.id,
      regNo,
      type,
      category,
      from,
      to,
      reason,
      doc,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: AuditAction.LeaveSubmitted,
      actor: regNo,
      entityType: "LeaveRequest",
      entityId: leave.id,
      after: mapLeaveRecord(leave),
      reason,
    },
  });

  return NextResponse.json({ leave: mapLeaveRecord(leave) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body.");

  const id = String(body.id || "").trim();
  const status = isDecision(body.status) ? body.status : null;
  const actor = String(body.actor || request.headers.get("x-coordinator-id") || "coordinator").trim();
  const decisionNote = typeof body.decisionNote === "string" ? body.decisionNote.trim() : "";

  if (!id) return jsonError("Leave request id is required.");
  if (!status) return jsonError("Status must be Approved or Rejected.");

  const before = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!before) return jsonError("Leave request was not found.", 404);

  const leave = await prisma.leaveRequest.update({
    where: { id },
    data: {
      status,
      decidedAt: new Date(),
      decidedBy: actor,
      decisionNote: decisionNote || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: AuditAction.LeaveDecisionChanged,
      actor,
      entityType: "LeaveRequest",
      entityId: leave.id,
      before: mapLeaveRecord(before),
      after: mapLeaveRecord(leave),
      reason: decisionNote || `Leave ${status.toLowerCase()}`,
    },
  });

  return NextResponse.json({ leave: mapLeaveRecord(leave) });
}
