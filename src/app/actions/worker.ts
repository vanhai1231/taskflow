"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function claimTask(taskId: string) {
  const user = await requireAuth();

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");
  if (task.status !== "OPEN") throw new Error("Task is not available");

  // Check if worker already has a submission for this task
  const existingSub = await prisma.submission.findFirst({
    where: { taskId, workerId: user.id },
  });
  if (existingSub) throw new Error("You have already claimed this task");

  // Task stays OPEN — multiple workers can claim the same task
  // Create a placeholder submission for this worker
  await prisma.submission.create({
    data: {
      taskId,
      workerId: user.id,
      resultUrl: "", // Will be filled when worker submits
      status: "PENDING",
    },
  });

  revalidatePath("/worker/tasks");
  revalidatePath(`/worker/tasks/${taskId}`);
  revalidatePath("/worker/my-tasks");
}

export async function submitResult(formData: FormData) {
  const user = await requireAuth();

  const submissionId = formData.get("submissionId") as string;
  const resultUrl = formData.get("resultUrl") as string;

  if (!submissionId || !resultUrl) {
    throw new Error("Submission ID and result URL are required");
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) throw new Error("Submission not found");
  if (submission.workerId !== user.id) throw new Error("Unauthorized");

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      resultUrl,
      status: "PENDING",
    },
  });

  revalidatePath("/worker/my-tasks");
  revalidatePath(`/worker/submit/${submission.taskId}`);
  revalidatePath("/reviewer/submissions");
}
