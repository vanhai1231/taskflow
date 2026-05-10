"use client";

import { useState } from "react";
import { updateTask } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Loader2, Upload } from "lucide-react";

interface TaskData {
  id: string;
  title: string;
  description: string;
  datasetUrl: string | null;
  baselineScore: number;
  rewardAmount: number;
  deadline: string | null;
  expectedPayout: string | null;
}

export function EditTaskForm({ task }: { task: TaskData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [datasetUrl, setDatasetUrl] = useState(task.datasetUrl || "");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch("/api/storage/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (res.ok) {
        const { uploadUrl, fileUrl } = await res.json();
        await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        setDatasetUrl(fileUrl);
      }
    } catch {
      // fallback
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    formData.set("datasetUrl", datasetUrl);
    try {
      await updateTask(task.id, formData);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format deadline for datetime-local input
  const deadlineValue = task.deadline
    ? new Date(task.deadline).toISOString().slice(0, 16)
    : "";

  const expectedPayoutValue = task.expectedPayout
    ? new Date(task.expectedPayout).toISOString().slice(0, 10)
    : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update task details</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`title-${task.id}`}>Title</Label>
            <Input id={`title-${task.id}`} name="title" defaultValue={task.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`desc-${task.id}`}>Description</Label>
            <Textarea id={`desc-${task.id}`} name="description" defaultValue={task.description} rows={8} required />
          </div>
          <div className="space-y-2">
            <Label>Dataset</Label>
            <div className="flex gap-2">
              <Input name="datasetUrl" placeholder="URL or upload" value={datasetUrl} onChange={(e) => setDatasetUrl(e.target.value)} />
              <Button type="button" variant="outline" size="icon" className="shrink-0" disabled={uploading} onClick={() => document.getElementById(`edit-dataset-${task.id}`)?.click()}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
              <input id={`edit-dataset-${task.id}`} type="file" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`baseline-${task.id}`}>Baseline Score</Label>
              <Input id={`baseline-${task.id}`} name="baselineScore" type="number" step="0.01" defaultValue={task.baselineScore} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`reward-${task.id}`}>Reward ($)</Label>
              <Input id={`reward-${task.id}`} name="rewardAmount" type="number" step="0.01" defaultValue={task.rewardAmount} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`deadline-${task.id}`}>Deadline</Label>
              <Input id={`deadline-${task.id}`} name="deadline" type="datetime-local" defaultValue={deadlineValue} />
              <p className="text-[11px] text-muted-foreground">Leave empty for no deadline</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`payout-${task.id}`}>Expected Payout</Label>
              <Input id={`payout-${task.id}`} name="expectedPayout" type="date" defaultValue={expectedPayoutValue} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
