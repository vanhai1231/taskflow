"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SubmissionSummary {
  id: string;
  workerName: string;
  status: string;
  score: number | null;
  createdAt: string;
  isCurrentUser: boolean;
}

interface UserSubmission {
  id: string;
  status: string;
  score: number | null;
  reviewerComment: string | null;
  resultUrl: string;
  createdAt: string;
}

export function TaskTabs({
  description,
  submissions,
  userSubmission,
  taskId,
}: {
  description: string;
  submissions: SubmissionSummary[];
  userSubmission: UserSubmission | null;
  taskId: string;
}) {
  const statusVariant = (s: string) => {
    switch (s) {
      case "PENDING": return "info";
      case "APPROVED": return "success";
      case "REJECTED": return "destructive";
      case "REVISION_REQUESTED": return "warning";
      default: return "secondary";
    }
  };

  // Sort leaderboard by score (highest first), only approved
  const leaderboard = submissions
    .filter((s) => s.status === "APPROVED" && s.score !== null)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="leaderboard"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
        >
          Leaderboard ({leaderboard.length})
        </TabsTrigger>
        <TabsTrigger
          value="my-submission"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm"
        >
          Your Submissions
        </TabsTrigger>
      </TabsList>

      {/* Description tab */}
      <TabsContent value="description" className="pt-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2 className="text-lg font-semibold mb-3">Overview</h2>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {description}
          </div>
        </div>
      </TabsContent>

      {/* Leaderboard tab */}
      <TabsContent value="leaderboard" className="pt-6">
        {leaderboard.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No approved submissions yet.
          </p>
        ) : (
          <div className="rounded-lg border divide-y">
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_100px] px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
              <span>#</span>
              <span>Solver</span>
              <span className="text-right">Score</span>
            </div>
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`grid grid-cols-[40px_1fr_100px] px-4 py-3 text-sm items-center ${
                  entry.isCurrentUser ? "bg-accent/50" : ""
                }`}
              >
                <span className="font-mono text-muted-foreground">
                  {index + 1}
                </span>
                <span className="font-medium">
                  {entry.workerName}
                  {entry.isCurrentUser && (
                    <span className="text-xs text-muted-foreground ml-2">(you)</span>
                  )}
                </span>
                <span className="text-right font-mono font-medium">
                  {entry.score?.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Your Submissions tab */}
      <TabsContent value="my-submission" className="pt-6">
        {!userSubmission ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            You haven&apos;t claimed this task yet.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant(userSubmission.status) as any}>
                    {userSubmission.status.replace("_", " ")}
                  </Badge>
                  {userSubmission.score !== null && (
                    <span className="text-sm">
                      Score: <span className="font-mono font-medium">{userSubmission.score?.toFixed(4)}</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(userSubmission.createdAt).toLocaleDateString()}
                </span>
              </div>

              {userSubmission.resultUrl && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Result: </span>
                  <a
                    href={userSubmission.resultUrl}
                    target="_blank"
                    rel="noopener"
                    className="underline underline-offset-4"
                  >
                    {userSubmission.resultUrl.split("/").pop() || "View file"}
                  </a>
                </div>
              )}

              {userSubmission.reviewerComment && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Reviewer feedback</p>
                  <p className="text-sm">{userSubmission.reviewerComment}</p>
                </div>
              )}

              {(userSubmission.status === "REVISION_REQUESTED" ||
                (userSubmission.status === "PENDING" && !userSubmission.resultUrl)) && (
                <Link href={`/worker/submit/${taskId}`}>
                  <Button variant="outline" size="sm" className="rounded-full mt-2">
                    {userSubmission.resultUrl ? "Resubmit" : "Submit Result"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
