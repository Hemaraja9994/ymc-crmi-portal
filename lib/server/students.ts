import { prisma } from "./prisma";
import { findStudentUnified, isJul2026RegNo } from "../find-assignment";

export async function findOrCreateStudentByRegNo(regNo: string) {
  const normalized = regNo.trim().toUpperCase();
  if (!normalized) return null;

  const existing = await prisma.student.findUnique({ where: { regNo: normalized } });
  if (existing) return existing;

  // Resolve across BOTH batches (main 2021 CBME + July 2026), not just the main list.
  const local = findStudentUnified(normalized);
  if (!local) return null;

  const jul2026 = isJul2026RegNo(local.regNo);
  const batchYear = jul2026 ? 2021 : 2021;
  const batchSlug = jul2026 ? "2021-cbme-jul2026" : "2021-cbme";

  return prisma.student.upsert({
    where: { regNo: local.regNo },
    update: {
      slNo: local.slNo,
      name: local.name,
      campusId: local.campusId,
      phone: local.phone,
      email: local.email,
      batchYear,
      batchSlug,
    },
    create: {
      slNo: local.slNo,
      name: local.name,
      regNo: local.regNo,
      campusId: local.campusId,
      phone: local.phone,
      email: local.email,
      batchYear,
      batchSlug,
    },
  });
}
