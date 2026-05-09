import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default async function WorkerPayoutsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const payouts = await prisma.payout.findMany({
    where: { workerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalPending = payouts.filter((p) => !p.isPaid).reduce((s, p) => s + p.amount, 0);
  const totalPaid = payouts.filter((p) => p.isPaid).reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Payouts</h1>
        <p className="text-sm text-muted-foreground mt-1">{payouts.length} records</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-semibold mt-1">${totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Received</p>
          <p className="text-2xl font-semibold mt-1">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold mt-1">${(totalPending + totalPaid).toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Paid At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell className="text-right font-mono text-sm font-medium">
                  ${payout.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={payout.isPaid ? "success" : "warning"}>
                    {payout.isPaid ? "Paid" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {payout.expectedDate ? new Date(payout.expectedDate).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : "—"}
                </TableCell>
              </TableRow>
            ))}
            {payouts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  No payouts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
