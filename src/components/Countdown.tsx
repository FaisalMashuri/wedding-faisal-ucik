"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";

function calc(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor(diff / 3_600_000) % 24,
    m: Math.floor(diff / 60_000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex w-9 flex-col items-center">
      <div className="flex h-6 items-center font-[family-name:var(--font-counter)] text-[21px] leading-none text-secondary">
        {pad(value)}
      </div>
      <span className="mt-1 font-sans text-[8px] text-primary">
        {label}
      </span>
    </div>
  );
}

/** Pemisah ":" sejajar tengah angka. */
function Sep() {
  return (
    <div className="flex h-6 items-center font-[family-name:var(--font-counter)] text-[15px] text-primary">
      :
    </div>
  );
}

export function Countdown() {
  // Mulai 00 (server = client) untuk hindari mismatch hidrasi, lalu update setelah mount.
  const [t, setT] = useState({ d: 0, h: 0, m: 0 });

  useEffect(() => {
    const target = new Date(wedding.dateISO).getTime();
    const tick = () => setT(calc(target));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <p className="font-[family-name:var(--font-counter)] text-[17px] text-white">
        Counting The Days
      </p>
      <div className=" flex w-auto items-start justify-center gap-2 rounded-2xl bg-white/95 px-5 py-3 shadow-sm">
        <Unit value={t.d} label="Days" />
        <Sep />
        <Unit value={t.h} label="Hours" /> 
        <Sep />
        <Unit value={t.m} label="Minutes" />
      </div>
    </div>
  );
}
