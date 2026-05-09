import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {

export const dynamic = "force-dynamic";
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { RoleChanger } from "./role-changer";
import { ApproveButton } from "./approve-button";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } } },
  });

  const pending = users.filter((u) => !u.isApproved);
  const approved = users.filter((u) => u.isApproved);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {users.length} registered · {pending.length} pending approval
        </p>
      </div>

      {/* Pending approval section */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Pending Approval ({pending.length})
          </h2>
          <div className="rounded-lg border divide-y">
            {pending.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="font-medium">{user.name || "—"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {user.isEmailVerified ? (
                      <Badge variant="success" className="text-[10px]">Email Verified</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Email Unverified</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Registered {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ApproveButton userId={user.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All users table */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          All Users
        </h2>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Rep</TableHead>
                <TableHead className="text-right">Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {user.isApproved ? (
                        <Badge variant="success" className="text-[10px]">Active</Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px]">Pending</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{user.reputation}</TableCell>
                  <TableCell className="text-right">
                    <RoleChanger userId={user.id} currentRole={user.role} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
