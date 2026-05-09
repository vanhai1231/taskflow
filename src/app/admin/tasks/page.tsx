export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateTaskForm } from "./create-task-form";
import { TaskStatusToggle } from "./task-status-toggle";

export default async function AdminTasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { name: true } },
      _count: { select: { submissions: true } },
    },
  });

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tasks.length} tasks total
          </p>
        </div>
        <CreateTaskForm />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Baseline</TableHead>
              <TableHead className="text-right">Reward</TableHead>
              <TableHead className="text-center">Submissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                    {task.description}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status) as any}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {task.baselineScore.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  ${task.rewardAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  {task._count.submissions}
                </TableCell>
                <TableCell className="text-right">
                  <TaskStatusToggle taskId={task.id} currentStatus={task.status} />
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No tasks yet. Create your first task.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
