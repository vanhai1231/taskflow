import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClaimTaskButton } from "./claim-button";
import { TaskTabs } from "./task-tabs";
import { CountdownBadge } from "@/components/countdown";
import { closeExpiredTasks } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { taskId } = await params;

  // Auto-close expired tasks
  await closeExpiredTasks();

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      admin: { select: { name: true } },
      submissions: {
        include: { worker: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!task) notFound();

  const userSubmission = session?.user
    ? task.submissions.find((s) => s.workerId === session.user.id)
    : null;

  const approvedSubmissions = task.submissions.filter((s) => s.status === "APPROVED");
  const topScore =
    approvedSubmissions.length > 0
      ? Math.max(...approvedSubmissions.map((s) => s.score || 0))
      : null;

  const statusVariant = (status: string) => {
    switch (status) {
      case "OPEN": return "success";
      case "IN_PROGRESS": return "info";
      case "COMPLETED": return "default";
      case "CLOSED": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/worker/tasks" className="hover:text-foreground transition-colors">
          Task Board
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[300px]">{task.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: Main content */}
        <div className="space-y-6 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>

          {/* Metadata bar */}
          <div className="rounded-lg border p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Status</p>
                <Badge variant={statusVariant(task.status) as any}>{task.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Baseline Score</p>
                <p className="font-mono font-medium">{task.baselineScore.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Created By</p>
                <p className="font-medium">{task.admin.name || "Admin"}</p>
              </div>
            </div>
          </div>

          {/* Dataset link */}
          {task.datasetUrl && (
            <div className="rounded-lg border p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Dataset:{" "}
                <span className="text-foreground font-medium">
                  {task.datasetUrl.split("/").pop() || "Dataset"}
                </span>
              </p>
              <a href={task.datasetUrl} target="_blank" rel="noopener">
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </a>
            </div>
          )}

          {/* Tabs */}
          <TaskTabs
            description={task.description}
            submissions={task.submissions.map((s) => ({
              id: s.id,
              workerName: s.worker.name || s.worker.email,
              status: s.status,
              score: s.score,
              createdAt: s.createdAt.toISOString(),
              isCurrentUser: s.workerId === session?.user?.id,
            }))}
            userSubmission={
              userSubmission
                ? {
                    id: userSubmission.id,
                    status: userSubmission.status,
                    score: userSubmission.score,
                    reviewerComment: userSubmission.reviewerComment,
                    resultUrl: userSubmission.resultUrl,
                    createdAt: userSubmission.createdAt.toISOString(),
                  }
                : null
            }
            taskId={taskId}
          />
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="rounded-lg border divide-y">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Submissions</span>
              <span className="text-sm font-medium">{task.submissions.length}</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Top Score</span>
              <span className="text-sm font-mono font-medium">
                {topScore !== null ? topScore.toFixed(2) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">
                {new Date(task.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Countdown */}
          {task.deadline && (
            <CountdownBadge deadline={task.deadline.toISOString()} />
          )}

          {/* CTA */}
          {session?.user && (
            <ClaimTaskButton
              taskId={task.id}
              taskStatus={task.status}
              userSubmission={
                userSubmission
                  ? {
                      id: userSubmission.id,
                      status: userSubmission.status,
                      resultUrl: userSubmission.resultUrl,
                    }
                  : null
              }
            />
          )}

          {/* Expected payout */}
          {task.expectedPayout && (
            <div className="rounded-lg border p-4 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Expected Payout</p>
                <p className="text-sm font-medium">
                  {new Date(task.expectedPayout).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
