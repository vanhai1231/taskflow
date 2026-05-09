"use client";

import { useState } from "react";
import { submitResult } from "@/app/actions/worker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, FileCode, FileSpreadsheet, X, CheckCircle2, AlertCircle } from "lucide-react";

interface FileState {
  file: File | null;
  url: string;
  uploading: boolean;
  error: string;
}

export function SubmitResultForm({
  submissionId,
  currentUrl,
}: {
  submissionId: string;
  currentUrl: string;
}) {
  const [solution, setSolution] = useState<FileState>({
    file: null, url: "", uploading: false, error: "",
  });
  const [submission, setSubmission] = useState<FileState>({
    file: null, url: "", uploading: false, error: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validateFile = (file: File, expectedName: string): string | null => {
    if (file.size === 0) return `${file.name} is empty (0 bytes)`;
    if (file.name !== expectedName) return `Expected "${expectedName}", got "${file.name}"`;
    return null;
  };

  const uploadFile = async (
    file: File,
    setter: React.Dispatch<React.SetStateAction<FileState>>
  ) => {
    setter((prev) => ({ ...prev, uploading: true, error: "" }));
    try {
      const res = await fetch("/api/storage/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
      });
      if (res.ok) {
        const { uploadUrl, fileUrl } = await res.json();
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "application/octet-stream" },
        });
        setter((prev) => ({ ...prev, file, url: fileUrl, uploading: false }));
      } else {
        // Fallback URL
        const fallbackUrl = `/uploads/${submissionId}/${file.name}`;
        setter((prev) => ({ ...prev, file, url: fallbackUrl, uploading: false }));
      }
    } catch {
      const fallbackUrl = `/uploads/${submissionId}/${file.name}`;
      setter((prev) => ({ ...prev, file, url: fallbackUrl, uploading: false }));
    }
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    expectedName: string,
    setter: React.Dispatch<React.SetStateAction<FileState>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file, expectedName);
    if (error) {
      setter((prev) => ({ ...prev, error, file: null, url: "" }));
      return;
    }

    await uploadFile(file, setter);
  };

  const handleRemove = (
    setter: React.Dispatch<React.SetStateAction<FileState>>,
    inputId: string
  ) => {
    setter({ file: null, url: "", uploading: false, error: "" });
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async () => {
    setGlobalError("");

    if (!solution.url || !submission.url) {
      setGlobalError("Both solution.py and submission.csv are required.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.set("submissionId", submissionId);
    formData.set("resultUrl", JSON.stringify({
      solutionUrl: solution.url,
      submissionCsvUrl: submission.url,
    }));

    try {
      await submitResult(formData);
      setSuccess(true);
    } catch (error) {
      console.error("Submit failed:", error);
      setGlobalError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="font-medium">Submitted successfully.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Your work is now pending review.
        </p>
      </div>
    );
  }

  const isReady = solution.url && submission.url && !solution.uploading && !submission.uploading;

  return (
    <div className="rounded-lg border p-6 space-y-5">
      <div>
        <h3 className="font-semibold">Submit your work</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload both files to complete your submission.
        </p>
      </div>

      {globalError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {globalError}
        </div>
      )}

      {/* solution.py */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          solution.py
        </Label>
        {solution.file && solution.url ? (
          <div className="flex items-center justify-between rounded-lg border bg-accent/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="truncate">{solution.file.name}</span>
              <span className="text-muted-foreground shrink-0">
                ({(solution.file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(setSolution, "file-solution")}
              className="text-muted-foreground hover:text-foreground ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => document.getElementById("file-solution")?.click()}
            disabled={solution.uploading}
            className="w-full rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground hover:bg-accent/30 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            {solution.uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="h-5 w-5" />
                <span>Click to upload <span className="font-medium text-foreground">solution.py</span></span>
              </div>
            )}
          </button>
        )}
        {solution.error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {solution.error}
          </p>
        )}
        <input
          id="file-solution"
          type="file"
          accept=".py"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "solution.py", setSolution)}
        />
      </div>

      {/* submission.csv */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          submission.csv
        </Label>
        {submission.file && submission.url ? (
          <div className="flex items-center justify-between rounded-lg border bg-accent/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="truncate">{submission.file.name}</span>
              <span className="text-muted-foreground shrink-0">
                ({(submission.file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(setSubmission, "file-submission")}
              className="text-muted-foreground hover:text-foreground ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => document.getElementById("file-submission")?.click()}
            disabled={submission.uploading}
            className="w-full rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground hover:bg-accent/30 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            {submission.uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="h-5 w-5" />
                <span>Click to upload <span className="font-medium text-foreground">submission.csv</span></span>
              </div>
            )}
          </button>
        )}
        {submission.error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {submission.error}
          </p>
        )}
        <input
          id="file-submission"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "submission.csv", setSubmission)}
        />
      </div>

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={!isReady || submitting}
        className="w-full rounded-full"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Submit"
        )}
      </Button>
    </div>
  );
}
