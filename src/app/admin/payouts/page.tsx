import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {

export const dynamic = "force-dynamic";
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayoutAction } from "./payout-action";

export default async function AdminPayoutsPage() {
  const payouts = await prisma.payout.findMany({
    orderBy: { createdAt: "desc" },
    include: { worker: { select: { name: true, email: true } } },
  });

  const totalPending = payouts.filter((p) => !p.isPaid).reduce((s, p) => s + p.amount, 0);
  const totalPaid = payouts.filter((p) => p.isPaid).reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payouts</h1>
        <p className="text-sm text-muted-foreground mt-1">{payouts.length} records</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-semibold mt-1">${totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-semibold mt-1">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>
                  <p className="font-medium">{payout.worker.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{payout.worker.email}</p>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  ${payout.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {payout.expectedDate ? new Date(payout.expectedDate).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={payout.isPaid ? "success" : "warning"}>
                    {payout.isPaid ? "Paid" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {payout.paidAt ? new Date(payout.paidAt).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {!payout.isPaid && <PayoutAction payoutId={payout.id} />}
                </TableCell>
              </TableRow>
            ))}
            {payouts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
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
