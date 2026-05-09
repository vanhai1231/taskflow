"use client";

import { toggleTaskStatus } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Lock, Unlock } from "lucide-react";

export function TaskStatusToggle({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleTaskStatus(taskId);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== "OPEN" && currentStatus !== "CLOSED") {
    return null;
  }

  return (
    <Button
      variant={currentStatus === "OPEN" ? "outline" : "secondary"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className="gap-1.5"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : currentStatus === "OPEN" ? (
        <>
          <Lock className="h-3.5 w-3.5" />
          Close
        </>
      ) : (
        <>
          <Unlock className="h-3.5 w-3.5" />
          Reopen
        </>
      )}
    </Button>
  );
}
