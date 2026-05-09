"use client";

import { deleteUser } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading} className="text-destructive hover:text-destructive">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  );
}
