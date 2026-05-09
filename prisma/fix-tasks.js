const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.task.updateMany({
    where: { status: "IN_PROGRESS" },
    data: { status: "OPEN" },
  });
  console.log("✅ Reset", result.count, "tasks back to OPEN");

  const tasks = await prisma.task.findMany({
    select: { title: true, status: true },
  });
  tasks.forEach((t) => console.log(" ", t.status, "-", t.title));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
