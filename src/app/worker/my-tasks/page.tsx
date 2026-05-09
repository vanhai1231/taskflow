export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {

  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function MyTasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const submissions = await prisma.submission.findMany({
    where: { workerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { task: { select: { title: true } } },
  });

  const statusVariant = (s: string) => {
    switch (s) {
      case "PENDING": return "info";
      case "APPROVED": return "success";
      case "REJECTED": return "destructive";
      case "REVISION_REQUESTED": return "warning";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {submissions.length} submissions
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Reviewer Comment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium max-w-[250px] truncate">
                  {sub.task.title}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(sub.status) as any}>
                    {sub.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {sub.score !== null ? sub.score?.toFixed(2) : "—"}
                </TableCell>
                <TableCell className="max-w-[200px] text-sm text-muted-foreground truncate">
                  {sub.reviewerComment || "—"}
                </TableCell>
                <TableCell className="text-right">
                  {(sub.status === "PENDING" && !sub.resultUrl) ||
                  sub.status === "REVISION_REQUESTED" ? (
                    <Link href={`/worker/submit/${sub.taskId}`}>
                      <Button variant="outline" size="sm" className="rounded-full">
                        {sub.resultUrl ? "Resubmit" : "Submit"}
                      </Button>
                    </Link>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No tasks claimed yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
