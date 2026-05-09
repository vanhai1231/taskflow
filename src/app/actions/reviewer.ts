"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireReviewer() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "ADMIN" && session.user.role !== "REVIEWER") {
    throw new Error("Unauthorized: Reviewer access required");
  }
  return session.user;
}

export async function reviewSubmission(formData: FormData) {
  await requireReviewer();

  const submissionId = formData.get("submissionId") as string;
  const action = formData.get("action") as string; // "approve" or "reject"
  const score = parseFloat(formData.get("score") as string);
  const comment = formData.get("comment") as string;

  if (!submissionId || !action) {
    throw new Error("Submission ID and action are required");
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { task: true },
  });

  if (!submission) throw new Error("Submission not found");

  if (action === "approve") {
    // Update submission
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "APPROVED",
        score: isNaN(score) ? null : score,
        reviewerComment: comment || null,
      },
    });

    // Update task status to COMPLETED
    await prisma.task.update({
      where: { id: submission.taskId },
      data: { status: "COMPLETED" },
    });

    // Increase worker reputation
    await prisma.user.update({
      where: { id: submission.workerId },
      data: { reputation: { increment: 10 } },
    });

    // Create payout record
    await prisma.payout.create({
      data: {
        workerId: submission.workerId,
        amount: submission.task.rewardAmount,
        expectedDate: submission.task.expectedPayout,
      },
    });
  } else {
    // Reject / request revision
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "REVISION_REQUESTED",
        score: isNaN(score) ? null : score,
        reviewerComment: comment || "Revision required. Please check and resubmit.",
      },
    });
  }

  revalidatePath("/reviewer/submissions");
  revalidatePath("/worker/my-tasks");
  revalidatePath("/admin/payouts");
}
