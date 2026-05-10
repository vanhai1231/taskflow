import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight, Users, Target, Clock, DollarSign, Trophy } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { closeExpiredTasks } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function WorkerTaskBoard() {
  const session = await getServerSession(authOptions);

  await closeExpiredTasks();

  const tasks = await prisma.task.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { submissions: true } },
      submissions: {
        where: { status: "APPROVED" },
        select: { score: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Task Board</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tasks.length} open task{tasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Discord banner */}
      <a
        href="https://discord.gg/hHJGM8qFx"
        target="_blank"
        rel="noopener"
        className="group flex items-center gap-4 rounded-2xl bg-[#5865F2] px-5 py-4 transition-all hover:bg-[#4752C4] hover:shadow-lg hover:shadow-[#5865F2]/20"
      >
        <svg className="h-7 w-7 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Join our Discord</p>
          <p className="text-xs text-white/70">Chat, get help, and stay updated</p>
        </div>
        <span className="text-sm text-white/80 font-medium group-hover:text-white shrink-0">
          Join →
        </span>
      </a>

      {tasks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No open tasks available right now.</p>
          <p className="text-sm mt-1">Check back later.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {tasks.map((task) => {
            const topScore =
              task.submissions.length > 0
                ? Math.max(...task.submissions.map((s) => s.score || 0))
                : null;

            return (
              <Link
                key={task.id}
                href={`/worker/tasks/${task.id}`}
                className="group relative block rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:border-foreground/20 hover:shadow-xl hover:shadow-white/[0.03] hover:-translate-y-0.5"
              >
                {/* Card content */}
                <div className="p-6 space-y-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="success" className="text-[11px] px-2.5 py-0.5">
                          Open
                        </Badge>
                        {task.deadline && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <Countdown deadline={task.deadline.toISOString()} />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-base leading-snug">
                        {task.title}
                      </h3>
                    </div>
                    <div className="shrink-0 rounded-full border p-2 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 group-hover:bg-foreground/5 transition-all">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {task.description.replace(/[#*`~>\-]/g, "").substring(0, 150)}...
                  </p>

                  {/* Stats row */}
                  <div className={`grid gap-3 pt-3 border-t ${task.rewardAmount > 0 ? "grid-cols-3" : "grid-cols-2"}`}>
                    <div>
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Target className="h-3.5 w-3.5" />
                        <span className="text-[10px] uppercase tracking-wider font-medium">Baseline</span>
                      </div>
                      <p className="font-mono text-sm font-semibold">
                        {task.baselineScore.toFixed(2)}
                      </p>
                    </div>
                    {task.rewardAmount > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          <span className="text-[10px] uppercase tracking-wider font-medium">Reward</span>
                        </div>
                        <p className="text-sm font-semibold">
                          ${task.rewardAmount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-[10px] uppercase tracking-wider font-medium">Solvers</span>
                      </div>
                      <p className="text-sm font-semibold">
                        {task._count.submissions}
                        {topScore !== null && (
                          <span className="text-muted-foreground font-normal text-xs ml-1">
                            <Trophy className="h-3 w-3 inline -mt-0.5 mr-0.5" />
                            {topScore.toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
