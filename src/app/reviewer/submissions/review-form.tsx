"use client";

import { useState } from "react";
import { reviewSubmission } from "@/app/actions/reviewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function ReviewForm({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(true);
    const form = document.getElementById(`review-form-${submissionId}`) as HTMLFormElement;
    const formData = new FormData(form);
    formData.set("submissionId", submissionId);
    formData.set("action", action);
    try {
      await reviewSubmission(formData);
      setDone(action === "approve" ? "approved" : "rejected");
    } catch (error) {
      console.error("Review failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-md bg-muted p-4 text-center text-sm">
        {done === "approved" ? "Approved ✓" : "Revision requested ↻"}
      </div>
    );
  }

  return (
    <form id={`review-form-${submissionId}`} className="border-t pt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`score-${submissionId}`}>Score</Label>
          <Input
            id={`score-${submissionId}`}
            name="score"
            type="number"
            step="0.01"
            min="0"
            max="1"
            placeholder="0.00 – 1.00"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`comment-${submissionId}`}>Comment</Label>
        <Textarea
          id={`comment-${submissionId}`}
          name="comment"
          placeholder="Review feedback..."
          rows={3}
        />
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => handleAction("approve")}
          disabled={loading}
          className="rounded-full"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleAction("reject")}
          disabled={loading}
          className="rounded-full"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request Revision"}
        </Button>
      </div>
    </form>
  );
}
