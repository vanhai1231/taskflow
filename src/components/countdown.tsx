"use client";

import { useState, useEffect } from "react";

function getTimeLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, total: diff };
}

export function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = getTimeLeft(deadline);
      setTimeLeft(tl);
      if (!tl) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!timeLeft) {
    return (
      <span className="text-xs text-destructive font-medium">Ended</span>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const isUrgent = timeLeft.total < 1000 * 60 * 60 * 24; // less than 24h

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  if (days === 0) parts.push(`${seconds}s`);

  return (
    <span className={`font-mono text-xs tabular-nums ${isUrgent ? "text-amber-500" : "text-muted-foreground"}`}>
      {parts.join(" ")}
    </span>
  );
}

export function CountdownBadge({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = getTimeLeft(deadline);
      setTimeLeft(tl);
      if (!tl) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!timeLeft) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">Challenge ended</p>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const isUrgent = timeLeft.total < 1000 * 60 * 60 * 24;

  return (
    <div className={`rounded-lg border p-4 ${isUrgent ? "border-amber-500/30 bg-amber-500/5" : ""}`}>
      <p className="text-xs text-muted-foreground mb-2">Time remaining</p>
      <div className="flex gap-3">
        {days > 0 && (
          <div className="text-center">
            <p className="text-xl font-semibold font-mono">{days}</p>
            <p className="text-[10px] text-muted-foreground uppercase">days</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-xl font-semibold font-mono">{String(hours).padStart(2, "0")}</p>
          <p className="text-[10px] text-muted-foreground uppercase">hrs</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold font-mono">{String(minutes).padStart(2, "0")}</p>
          <p className="text-[10px] text-muted-foreground uppercase">min</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold font-mono">{String(seconds).padStart(2, "0")}</p>
          <p className="text-[10px] text-muted-foreground uppercase">sec</p>
        </div>
      </div>
    </div>
  );
}
