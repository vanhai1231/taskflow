"use client";

import { claimTask } from "@/app/actions/worker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
  taskId: string;
  taskStatus: string;
  userSubmission: {
    id: string;
    status: string;
    resultUrl: string;
  } | null;
}

export function ClaimTaskButton({ taskId, taskStatus, userSubmission }: Props) {
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(!!userSubmission);

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

  // Already claimed — show submit/resubmit
  if (claimed || userSubmission) {
    const needsSubmit =
      userSubmission &&
      (!userSubmission.resultUrl || userSubmission.status === "REVISION_REQUESTED");

    return (
      <div className="space-y-2">
        {needsSubmit ? (
          <Link href={`/worker/submit/${taskId}`} className="block">
            <Button className="w-full rounded-full">
              {userSubmission.resultUrl ? "Resubmit Result" : "Submit Result"}
            </Button>
          </Link>
        ) : (
          <Button className="w-full rounded-full" disabled variant="outline">
            {userSubmission?.status === "APPROVED"
              ? "Approved ✓"
              : userSubmission?.status === "PENDING"
              ? "Pending Review"
              : "Claimed"}
          </Button>
        )}
      </div>
    );
  }

  // Task not open
  if (taskStatus !== "OPEN") {
    return (
      <Button className="w-full rounded-full" disabled variant="outline">
        Task {taskStatus.toLowerCase()}
      </Button>
    );
  }

  // Can claim
  return (
    <Button
      className="w-full rounded-full"
      onClick={handleClaim}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Working"}
    </Button>
  );
}
