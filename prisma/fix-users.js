const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: {
      email: { in: ["admin@example.com", "reviewer@example.com", "worker@example.com"] },
    },
    data: {
      isApproved: true,
      isEmailVerified: true,
    },
  });
  console.log("✅ Fixed", result.count, "demo accounts (approved + verified)");
}

main().catch(console.error).finally(() => prisma.$disconnect());
