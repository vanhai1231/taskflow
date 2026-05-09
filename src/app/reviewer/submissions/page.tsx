import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ReviewForm } from "./review-form";

export default async function ReviewerSubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    where: {
      status: { in: ["PENDING", "REVISION_REQUESTED"] },
      resultUrl: { not: "" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      task: { select: { title: true, baselineScore: true } },
      worker: { select: { name: true, email: true, reputation: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {submissions.length} submissions pending
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No submissions to review.</p>
          <p className="text-sm mt-1">All caught up.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-lg border p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{sub.task.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {sub.worker.name || sub.worker.email} · Rep {sub.worker.reputation}
                  </p>
                </div>
                <Badge variant={sub.status === "PENDING" ? "info" : "warning"}>
                  {sub.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex gap-6 text-sm">
                <span>
                  <span className="text-muted-foreground">Baseline </span>
                  <span className="font-mono">{sub.task.baselineScore.toFixed(2)}</span>
                </span>
                {sub.resultUrl && (
                  <a
                    href={sub.resultUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-foreground underline underline-offset-4"
                  >
                    Download result
                  </a>
                )}
              </div>

              {sub.status === "REVISION_REQUESTED" && sub.reviewerComment && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <span className="font-medium">Previous: </span>
                  <span className="text-muted-foreground">{sub.reviewerComment}</span>
                </div>
              )}

              <ReviewForm submissionId={sub.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
