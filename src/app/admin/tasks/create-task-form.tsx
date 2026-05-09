"use client";

import { useState } from "react";
import { createTask } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Upload } from "lucide-react";

export function CreateTaskForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [datasetUrl, setDatasetUrl] = useState("");

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
      } else {
        setDatasetUrl(`/uploads/${file.name}`);
      }
    } catch {
      setDatasetUrl(`/uploads/${e.target.files?.[0]?.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    formData.set("datasetUrl", datasetUrl || (formData.get("datasetUrl") as string));
    try {
      await createTask(formData);
      setOpen(false);
      setDatasetUrl("");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full px-4">
          <Plus className="h-4 w-4 mr-1" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>Create a task for workers to complete</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Task title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe the task..." rows={4} required />
          </div>
          <div className="space-y-2">
            <Label>Dataset</Label>
            <div className="flex gap-2">
              <Input name="datasetUrl" placeholder="URL or upload" value={datasetUrl} onChange={(e) => setDatasetUrl(e.target.value)} />
              <Button type="button" variant="outline" size="icon" className="shrink-0" disabled={uploading} onClick={() => document.getElementById("dataset-file")?.click()}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
              <input id="dataset-file" type="file" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baselineScore">Baseline Score</Label>
              <Input id="baselineScore" name="baselineScore" type="number" step="0.01" placeholder="0.85" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rewardAmount">Reward ($)</Label>
              <Input id="rewardAmount" name="rewardAmount" type="number" step="0.01" placeholder="500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="datetime-local" />
              <p className="text-[11px] text-muted-foreground">Leave empty for no deadline</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedPayout">Expected Payout</Label>
              <Input id="expectedPayout" name="expectedPayout" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
