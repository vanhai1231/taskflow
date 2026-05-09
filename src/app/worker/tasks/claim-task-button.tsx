"use client";

import { claimTask } from "@/app/actions/worker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function ClaimTaskButton({
  taskId,
  alreadyClaimed,
}: {
  taskId: string;
  alreadyClaimed: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(alreadyClaimed);

  const handleClaim = async () => {
    setLoading(true);
    try {
      await claimTask(taskId);
      setClaimed(true);
    } catch (error) {
      console.error("Failed to claim task:", error);
    } finally {
      setLoading(false);
    }
  };

  if (claimed) {
    return (
      <Button variant="outline" className="w-full rounded-full" disabled>
        Claimed
      </Button>
    );
  }

  return (
    <Button
      className="w-full rounded-full"
      onClick={handleClaim}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim Task"}
    </Button>
  );
}
