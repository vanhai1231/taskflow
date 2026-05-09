const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // Delete all submissions first
  await prisma.submission.deleteMany({});
  // Delete all payouts
  await prisma.payout.deleteMany({});
  // Delete all tasks
  await prisma.task.deleteMany({});
  // Delete all users
  await prisma.user.deleteMany({});

  console.log("🗑 Cleaned all data");

  // Create admin account
  const password = await bcrypt.hash("123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "vanhai11203@gmail.com",
      name: "Admin",
      password,
      role: "ADMIN",
      reputation: 100,
      isApproved: true,
      isEmailVerified: true,
    },
  });

  console.log("✅ Admin created:", admin.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
