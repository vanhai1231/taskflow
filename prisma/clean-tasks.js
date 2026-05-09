const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Delete submissions first (foreign key)
  await prisma.submission.deleteMany({
    where: { taskId: { in: ["sample-task-1", "sample-task-2"] } },
  });
  
  // Delete sample tasks
  const result = await prisma.task.deleteMany({
    where: { id: { in: ["sample-task-1", "sample-task-2"] } },
  });
  
  console.log(`✅ Deleted ${result.count} sample tasks`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
