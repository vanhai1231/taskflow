const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.deleteMany({
    where: { email: "vanhaih390@gmail.com" },
  });
  console.log(`✅ Deleted ${result.count} account(s) for vanhaih390@gmail.com`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
