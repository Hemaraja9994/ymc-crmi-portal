import { PrismaClient } from "@prisma/client";
import { STUDENTS } from "../lib/students";

const prisma = new PrismaClient();

async function main() {
  for (const student of STUDENTS) {
    await prisma.student.upsert({
      where: { regNo: student.regNo },
      update: {
        slNo: student.slNo,
        name: student.name,
        campusId: student.campusId,
        phone: student.phone,
        email: student.email,
        batchYear: 2021,
        batchSlug: "2021-cbme",
      },
      create: {
        slNo: student.slNo,
        name: student.name,
        regNo: student.regNo,
        campusId: student.campusId,
        phone: student.phone,
        email: student.email,
        batchYear: 2021,
        batchSlug: "2021-cbme",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
