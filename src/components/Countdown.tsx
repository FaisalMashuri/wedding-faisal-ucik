"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { wedding } from "@/config/wedding";
import { fluid } from "@/lib/fluid";
import { REVEAL } from "@/hooks/useReveal";
import { EASE_CSS } from "@/lib/gsap";

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
      {/* Kotak angka: lebar & tinggi sudah tetap, jadi angka lama dan baru
          bisa hidup berdampingan (absolute inset-0) tanpa menggeser layout.
          JANGAN tambahkan overflow-hidden "biar rapi" — font 21px di dalam
          kotak 24px akan terpotong. */}
      {/* `w-full` wajib: kedua span di dalamnya `absolute`, jadi tanpa itu
          kotak ini menciut ke lebar 0 dan `inset-0` tidak punya acuan.
          Lebarnya mengikuti Unit yang memang sudah dikunci fluid(36). */}
      <div
        className="relative flex w-full items-center justify-center font-[family-name:var(--font-counter)] leading-none text-secondary"
        style={{ height: fluid(24), fontSize: fluid(21) }}
      >
        {/* mode bawaan (sync), BUKAN popLayout: popLayout fitur layout yang
            butuh domMax, sedangkan kita sengaja hanya memuat domAnimation. */}
        <AnimatePresence initial={false}>
          <m.span
            key={pad(value)}
            className="absolute inset-0 flex items-center justify-center"
            // Geser dalam PERSEN, bukan px, supaya ikut menyusut bersama fluid()
            initial={{ opacity: 0, y: "30%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-30%" }}
            transition={{ duration: 0.35, ease: EASE_CSS }}
          >
            {pad(value)}
          </m.span>
        </AnimatePresence>
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
    // REVEAL: ikut rangkaian reveal EventSection (hook-nya ada di parent).
    <div className={`${REVEAL} flex flex-col items-center`}>
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
