"use client";

import { Role } from "@prisma/client";
import { updateUserRole } from "@/app/actions/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function RoleChanger({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (newRole: string) => {
    if (newRole === currentRole) return;
    setLoading(true);
    try {
      await updateUserRole(userId, newRole as Role);
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      <Select defaultValue={currentRole} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className="w-[130px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="WORKER">Worker</SelectItem>
          <SelectItem value="REVIEWER">Reviewer</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
