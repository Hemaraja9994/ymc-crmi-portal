import { LeaveRequest } from "@prisma/client";

function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function mapLeaveRecord(leave: LeaveRequest) {
  return {
    id: leave.id,
    regNo: leave.regNo,
    type: leave.type,
    category: leave.category,
    from: dateOnly(leave.from),
    to: dateOnly(leave.to),
    reason: leave.reason,
    status: leave.status,
    submittedAt: leave.submittedAt.toISOString(),
    doc: leave.doc ?? undefined,
    decidedAt: leave.decidedAt?.toISOString(),
    decidedBy: leave.decidedBy ?? undefined,
    decisionNote: leave.decisionNote ?? undefined,
  };
}
