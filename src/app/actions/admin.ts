"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role, TaskStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session.user;
}

export async function createTask(formData: FormData) {
  const admin = await requireAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const datasetUrl = formData.get("datasetUrl") as string;
  const baselineScore = parseFloat(formData.get("baselineScore") as string);
  const rewardAmount = parseFloat(formData.get("rewardAmount") as string);
  const expectedPayout = formData.get("expectedPayout") as string;
  const deadline = formData.get("deadline") as string;

  if (!title || !description || !datasetUrl) {
    throw new Error("Title, description, and dataset URL are required");
  }

  await prisma.task.create({
    data: {
      title,
      description,
      datasetUrl,
      baselineScore: baselineScore || 0,
      rewardAmount: rewardAmount || 0,
      expectedPayout: expectedPayout ? new Date(expectedPayout) : null,
      deadline: deadline ? new Date(deadline) : null,
      createdBy: admin.id,
    },
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/worker/tasks");
}

// Auto-close expired tasks (called on page load)
export async function closeExpiredTasks() {
  await prisma.task.updateMany({
    where: {
      status: "OPEN",
      deadline: { not: null, lte: new Date() },
    },
    data: { status: "CLOSED" },
  });
}

export async function toggleTaskStatus(taskId: string) {
  await requireAdmin();

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  const newStatus: TaskStatus =
    task.status === "OPEN" ? "CLOSED" : "OPEN";

  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/worker/tasks");
}

export async function updateUserRole(userId: string, newRole: Role) {
  await requireAdmin();

  if (!["WORKER", "REVIEWER", "ADMIN"].includes(newRole)) {
    throw new Error("Invalid role");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
}

export async function markPayoutPaid(payoutId: string) {
  await requireAdmin();

  await prisma.payout.update({
    where: { id: payoutId },
    data: {
      isPaid: true,
      paidAt: new Date(),
    },
  });

  revalidatePath("/admin/payouts");
  revalidatePath("/worker/payouts");
}

export async function createPayout(formData: FormData) {
  await requireAdmin();

  const workerId = formData.get("workerId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;

  if (!workerId || !amount || amount <= 0) {
    throw new Error("Worker and valid amount are required");
  }

  await prisma.payout.create({
    data: {
      workerId,
      amount,
      expectedDate: new Date(),
    },
  });

  revalidatePath("/admin/payouts");
  revalidatePath("/worker/payouts");
}

export async function approveUser(userId: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { isApproved: true },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await requireAdmin();

  // Delete related data first
  await prisma.submission.deleteMany({ where: { workerId: userId } });
  await prisma.payout.deleteMany({ where: { workerId: userId } });
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/users");
}
