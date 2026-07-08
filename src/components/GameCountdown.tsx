"use client";

import { useEffect, useMemo, useState } from "react";

function getTimeParts(targetIso: string, now: number) {
  const diff = new Date(targetIso).getTime() - now;
  if (Number.isNaN(diff)) return { label: "Time TBD", live: false };
  if (diff <= 0 && diff > -1000 * 60 * 90) return { label: "Live / in window", live: true };
  if (diff <= 0) return { label: "Tip passed", live: false };

  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;

  if (days > 0) return { label: `${days}d ${hours}h`, live: false };
  if (hours > 0) return { label: `${hours}h ${mins}m`, live: false };
  return { label: `${mins}m`, live: false };
}

export function GameCountdown({ targetIso, compact = false }: { targetIso: string; compact?: boolean }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const parts = useMemo(() => getTimeParts(targetIso, now), [targetIso, now]);

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-black uppercase tracking-wide ${parts.live ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-amber-300 bg-amber-50 text-amber-800"} ${compact ? "text-[10px]" : "text-xs"}`}>
      <span className={`h-2 w-2 rounded-full ${parts.live ? "bg-emerald-500" : "bg-amber-500"}`} />
      {parts.live ? parts.label : `Next tip ${parts.label}`}
    </span>
  );
}
