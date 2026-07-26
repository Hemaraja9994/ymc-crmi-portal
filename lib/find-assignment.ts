// Unified student + assignment lookup across BOTH batches.
// Main batch (2021 CBME, w.e.f. 01.06.2026) and 2nd batch (July 2026, w.e.f. 27.07.2026)
// share the same Assignment shape — this module hides the "which batch" decision
// so student-facing routes stay batch-agnostic.

import type { Assignment } from "./rotation";
import { findAssignmentByCampusId } from "./rotation";
import { findStudent, type Student } from "./students";
import {
  buildAssignmentsJul2026,
  findJul2026Student,
  STUDENTS_JUL2026,
} from "./batch-jul2026";

export function findAssignmentUnified(campusId: string): Assignment | undefined {
  const main = findAssignmentByCampusId(campusId);
  if (main) return main;
  const q = campusId.trim().toLowerCase();
  const all = buildAssignmentsJul2026();
  return all.find((a) => a.student.campusId.toLowerCase() === q);
}

export function findStudentUnified(query: string): Student | undefined {
  const main = findStudent(query);
  if (main) return main;
  const j = findJul2026Student(query);
  if (!j) return undefined;
  // Adapt Jul2026Student → Student.
  return {
    slNo: j.slNo,
    name: j.name,
    regNo: j.regNo,
    campusId: j.campusId,
  };
}

export function isJul2026RegNo(regNo: string): boolean {
  const q = regNo.trim().toLowerCase();
  return STUDENTS_JUL2026.some((s) => s.regNo.toLowerCase() === q);
}
