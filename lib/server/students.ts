import { prisma } from "./prisma";
import { findStudent } from "../students";

export async function findOrCreateStudentByRegNo(regNo: string) {
  const normalized = regNo.trim().toUpperCase();
  if (!normalized) return null;

  const existing = await prisma.student.findUnique({ where: { regNo: normalized } });
  if (existing) return existing;

  const local = findStudent(normalized);
  if (!local) return null;

  return prisma.student.upsert({
    where: { regNo: local.regNo },
    update: {
      slNo: local.slNo,
      name: local.name,
      campusId: local.campusId,
      phone: local.phone,
      email: local.email,
      batchYear: 2021,
      batchSlug: "2021-cbme",
    },
    create: {
      slNo: local.slNo,
      name: local.name,
      regNo: local.regNo,
      campusId: local.campusId,
      phone: local.phone,
      email: local.email,
      batchYear: 2021,
      batchSlug: "2021-cbme",
    },
  });
}
