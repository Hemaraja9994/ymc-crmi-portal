// Attendance math driven by the leaves store.
// Institutional requirement: 100% per posting + 100% overall.
import { LeaveRecord } from "./leaves";
import { START_DATE, TOTAL_WEEKS, isPreLaunch } from "./rotation";

export const ATTENDANCE_THRESHOLD = 100;

export type AttendanceInfo = {
  daysElapsed: number;
  daysOnLeave: number;
  daysAttended: number;
  attendancePct: number;
  deficient: boolean;
  preLaunch: boolean;
};

export function attendanceFor(
  regNo: string,
  leaves: LeaveRecord[],
  today = new Date()
): AttendanceInfo {
  if (isPreLaunch(today)) {
    return {
      daysElapsed: 0,
      daysOnLeave: 0,
      daysAttended: 0,
      attendancePct: 100,
      deficient: false,
      preLaunch: true,
    };
  }
  const startMs = START_DATE.getTime();
  const endOfYearMs = startMs + TOTAL_WEEKS * 7 * 86_400_000;
  const nowMs = Math.min(today.getTime(), endOfYearMs);
  const daysElapsed = Math.max(1, Math.floor((nowMs - startMs) / 86_400_000));

  let daysOnLeave = 0;
  for (const l of leaves) {
    if (l.regNo !== regNo || l.status !== "Approved") continue;
    const f = Math.max(new Date(l.from).getTime(), startMs);
    const tInclusive = new Date(l.to).getTime() + 86_400_000;
    const t = Math.min(tInclusive, nowMs);
    if (t > f) daysOnLeave += Math.floor((t - f) / 86_400_000);
  }
  const daysAttended = Math.max(0, daysElapsed - daysOnLeave);
  const attendancePct = Math.round((daysAttended / daysElapsed) * 1000) / 10;
  return {
    daysElapsed,
    daysOnLeave,
    daysAttended,
    attendancePct,
    deficient: attendancePct < ATTENDANCE_THRESHOLD,
    preLaunch: false,
  };
}

// Predict whether a planned leave (not yet approved) would push the intern
// under the threshold by the end of the internship.
export function projectedDeficitForPlannedLeave(
  regNo: string,
  leaves: LeaveRecord[],
  newFrom: string,
  newTo: string
): AttendanceInfo {
  const synthetic: LeaveRecord = {
    id: "_projection",
    regNo,
    type: "CL",
    from: newFrom,
    to: newTo,
    reason: "projection",
    status: "Approved",
    submittedAt: new Date().toISOString().slice(0, 10),
  };
  return attendanceFor(regNo, [...leaves, synthetic], new Date(
    START_DATE.getTime() + TOTAL_WEEKS * 7 * 86_400_000 - 1
  ));
}
