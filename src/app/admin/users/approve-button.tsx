"use client";

import { approveUser } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export function ApproveButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveUser(userId);
      setApproved(true);
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setLoading(false);
    }
  };

  if (approved) {
    return (
      <Button variant="outline" size="sm" disabled className="rounded-full gap-1.5">
        <Check className="h-3.5 w-3.5" />
        Approved
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleApprove}
      disabled={loading}
      className="rounded-full"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Approve"}
    </Button>
  );
}
