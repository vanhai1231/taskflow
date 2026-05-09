import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { SubmitResultForm } from "./submit-form";

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { taskId } = await params;

  const submission = await prisma.submission.findFirst({
    where: { taskId, workerId: session.user.id },
    include: { task: true },
  });

  if (!submission) notFound();

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{submission.task.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">Submit your result</p>
      </div>

      {/* Task info */}
      <div className="rounded-lg border p-6 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {submission.task.description}
        </p>
        <div className="text-sm">
          <span className="text-muted-foreground">Baseline </span>
          <span className="font-mono">{submission.task.baselineScore.toFixed(2)}</span>
        </div>
        {submission.task.datasetUrl && (
          <a href={submission.task.datasetUrl} target="_blank" rel="noopener" className="text-sm underline underline-offset-4">
            Download dataset
          </a>
        )}
      </div>

      {/* Revision feedback */}
      {submission.status === "REVISION_REQUESTED" && submission.reviewerComment && (
        <div className="rounded-lg border p-6">
          <p className="text-sm font-medium mb-1">Revision requested</p>
          <p className="text-sm text-muted-foreground">{submission.reviewerComment}</p>
          {submission.score !== null && (
            <p className="text-sm mt-2">
              Previous score: <span className="font-mono">{submission.score?.toFixed(2)}</span>
            </p>
          )}
        </div>
      )}

      <SubmitResultForm submissionId={submission.id} currentUrl={submission.resultUrl} />
    </div>
  );
}
