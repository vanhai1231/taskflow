import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminDashboard() {
  const [userCount, taskCount, pendingSubmissions, pendingPayouts] =
    await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.submission.count({ where: { status: "PENDING" } }),
      prisma.payout.count({ where: { isPaid: false } }),
    ]);

  const stats = [
    { title: "Users", value: userCount, href: "/admin/users" },
    { title: "Tasks", value: taskCount, href: "/admin/tasks" },
    { title: "Pending Reviews", value: pendingSubmissions, href: "/reviewer/submissions" },
    { title: "Unpaid Payouts", value: pendingPayouts, href: "/admin/payouts" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-semibold mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
