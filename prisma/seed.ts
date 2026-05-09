import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const adminPassword = await hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "System Admin",
      password: adminPassword,
      role: "ADMIN",
      reputation: 100,
      isApproved: true,
      isEmailVerified: true,
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create a sample reviewer
  const reviewerPassword = await hash("password123", 12);

  const reviewer = await prisma.user.upsert({
    where: { email: "reviewer@example.com" },
    update: {},
    create: {
      email: "reviewer@example.com",
      name: "Demo Reviewer",
      password: reviewerPassword,
      role: "REVIEWER",
      reputation: 50,
      isApproved: true,
      isEmailVerified: true,
    },
  });

  console.log("✅ Reviewer user created:", reviewer.email);

  // Create a sample worker
  const workerPassword = await hash("password123", 12);

  const worker = await prisma.user.upsert({
    where: { email: "worker@example.com" },
    update: {},
    create: {
      email: "worker@example.com",
      name: "Demo Worker",
      password: workerPassword,
      role: "WORKER",
      reputation: 0,
      isApproved: true,
      isEmailVerified: true,
    },
  });

  console.log("✅ Worker user created:", worker.email);

  // Create sample tasks
  const task1 = await prisma.task.upsert({
    where: { id: "sample-task-1" },
    update: {},
    create: {
      id: "sample-task-1",
      title: "Image Classification Dataset Labeling",
      description:
        "Label 10,000 images from the CIFAR-100 dataset with fine-grained categories. Each image must be labeled with both the coarse and fine label. Quality threshold: 95% accuracy against ground truth.",
      datasetUrl: "https://example.com/datasets/cifar-100-subset.zip",
      baselineScore: 0.85,
      rewardAmount: 500,
      expectedPayout: new Date("2026-06-01"),
      status: "OPEN",
      createdBy: admin.id,
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: "sample-task-2" },
    update: {},
    create: {
      id: "sample-task-2",
      title: "Sentiment Analysis Model Fine-tuning",
      description:
        "Fine-tune a BERT-base model on the provided Vietnamese sentiment dataset. The model must achieve at least 88% F1 score on the validation set. Submit the trained model weights and evaluation report.",
      datasetUrl: "https://example.com/datasets/vn-sentiment-v2.zip",
      baselineScore: 0.82,
      rewardAmount: 1200,
      expectedPayout: new Date("2026-06-15"),
      status: "OPEN",
      createdBy: admin.id,
    },
  });

  console.log("✅ Sample tasks created:", task1.title, "|", task2.title);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
