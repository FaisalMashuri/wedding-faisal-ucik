"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";
import { fluid } from "@/lib/fluid";

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
    <div className="flex flex-col items-center" style={{ width: fluid(36) }}>
      <div
        className="flex items-center font-[family-name:var(--font-counter)] leading-none text-secondary"
        style={{ height: fluid(24), fontSize: fluid(21) }}
      >
        {pad(value)}
      </div>
      <span
        className="font-sans font-bold text-primary"
        style={{ marginTop: fluid(4), fontSize: fluid(8) }}
      >
        {label}
      </span>
    </div>
  );
}

/** Pemisah ":" sejajar tengah angka. */
function Sep() {
  return (
    <div
      className="flex items-center font-[family-name:var(--font-counter)] text-primary"
      style={{ height: fluid(24), fontSize: fluid(15) }}
    >
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
      {/* Ukuran diset agar lebar teks pas sama lebar kotak putih di bawahnya
          (Alike 22px ≈ 188px = pad 40 + 3 unit 108 + 4 gap 32 + 2 sep) */}
      <p
        className="font-[family-name:var(--font-counter)] text-white"
        style={{ fontSize: fluid(22) }}
      >
        Counting The Days
      </p>
      <div
        className="flex w-auto items-start justify-center rounded-2xl bg-white/95 shadow-sm"
        style={{
          marginTop: fluid(10),
          gap: fluid(8),
          paddingLeft: fluid(20),
          paddingRight: fluid(20),
          paddingTop: fluid(12),
          paddingBottom: fluid(12),
        }}
      >
        <Unit value={t.d} label="Days" />
        <Sep />
        <Unit value={t.h} label="Hours" />
        <Sep />
        <Unit value={t.m} label="Minutes" />
      </div>
    </div>
  );
}
