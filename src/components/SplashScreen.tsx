"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { wedding } from "@/config/wedding";

/*
  Loading screen sebelum onboarding — desain "Wreath Monogram".
  - Latar gradient teal, eyebrow "The Wedding Of" bergaris bawah, lingkaran emas
    berisi ilustrasi wreath + monogram U&F, lalu tanggal acara.
  - Durasi mengikuti loading asset kritikal (bukan timer tetap): splash baru
    fade-out setelah aset onboarding & wreath selesai dimuat, dengan batas
    minimum (biar tidak cuma kedip) dan batas maksimum (jaga-jaga koneksi lambat).
*/

// Latar teal brand (identik dengan body di layout.tsx)
const TEAL_GRADIENT =
  "radial-gradient(130% 90% at 50% -10%, #4a7883 0%, #2c515b 42%, #16292f 100%)";

// Tanggal "05 . 09 . 2026" diturunkan dari config (jangan hardcode).
const [datePart] = wedding.dateISO.split("T"); // "2026-09-05"
const [yyyy, mm, dd] = datePart.split("-");
const dateShort = `${dd} . ${mm} . ${yyyy}`;

const MIN_DISPLAY_MS = 1500;
const MAX_WAIT_MS = 6000;

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // jangan sampai splash nyangkut kalau 1 aset gagal
    img.src = src;
  });
}

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const minDisplay = new Promise<void>((resolve) =>
      setTimeout(resolve, MIN_DISPLAY_MS)
    );
    const assetsReady = Promise.all([
      preload("/images/Opening_2.webp"), // background layar onboarding berikutnya
      preload("/images/uf-wreath.webp"), // ilustrasi di splash ini sendiri
    ]);
    const safetyTimeout = new Promise<void>((resolve) =>
      setTimeout(resolve, MAX_WAIT_MS)
    );

    let cancelled = false;
    Promise.all([minDisplay, Promise.race([assetsReady, safetyTimeout])]).then(
      () => {
        if (cancelled) return;
        setLeaving(true);
        setTimeout(() => {
          if (!cancelled) setVisible(false);
        }, 700);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 z-[60] flex flex-col items-center justify-center gap-6 transition-opacity duration-700 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ background: TEAL_GRADIENT }}
    >
      <p
        className="anim-fade-up font-[family-name:var(--font-subrayada)] text-[15px] uppercase tracking-[0.25em] text-primary underline decoration-primary/70 underline-offset-8"
        style={{ animationDelay: "0.3s" }}
      >
        The Wedding Of
      </p>

      <div
        className="anim-ring relative rounded-full bg-primary-light"
        style={{
          width: "clamp(210px, 58vw, 280px)",
          height: "clamp(210px, 58vw, 280px)",
          animationDelay: "0.5s",
        }}
      >
        <Image
          src="/images/uf-wreath.webp"
          alt="U & F"
          fill
          unoptimized
          sizes="280px"
          className="object-contain p-5"
        />
      </div>

      <p
        className="anim-fade-up text-[15px] tracking-[0.3em] text-primary"
        style={{ animationDelay: "0.9s" }}
      >
        {dateShort}
      </p>
    </div>
  );
}
