"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/config/wedding";

/*
  Loading screen sebelum onboarding — desain "Monogram Ring".
  - Lingkaran emas tipis berisi eyebrow "The Wedding Of", nama script "Faisal & Ucik"
    (dengan kilau emas menyapu), pemisah, dan tanggal.
  - Latar gradient teal — samakan dengan <body> di layout.
  - Durasi tetap ~3 dtk lalu fade-out, kemudian unmount.
*/

// Latar teal brand (identik dengan body di layout.tsx)
const TEAL_GRADIENT =
  "radial-gradient(130% 90% at 50% -10%, #4a7883 0%, #2c515b 42%, #16292f 100%)";

// Tanggal "05 . 09 . 2026" diturunkan dari config (jangan hardcode).
const [datePart] = wedding.dateISO.split("T"); // "2026-09-05"
const [yyyy, mm, dd] = datePart.split("-");
const dateShort = `${dd} . ${mm} . ${yyyy}`;

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Pre-warm gambar onboarding selama splash agar transisi mulus (non-blocking).
    new window.Image().src = "/images/bg-onboard-2.png";

    // Mulai fade-out setelah animasi masuk selesai, lalu unmount.
    const fadeTimer = setTimeout(() => setLeaving(true), 2600);
    const hideTimer = setTimeout(() => setVisible(false), 3300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 z-[60] flex items-center justify-center transition-opacity duration-700 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ background: TEAL_GRADIENT }}
    >
      <div className="anim-ring relative flex h-[190px] w-[190px] flex-col items-center justify-center rounded-full border border-primary/70 px-6 text-center">
        <p
          className="anim-fade-up font-[family-name:var(--font-subrayada)] text-[8px] uppercase tracking-[0.2em] text-primary/85"
          style={{ animationDelay: "0.4s" }}
        >
          The Wedding Of
        </p>

        <h1
          className="anim-fade-up mt-1 flex flex-col items-center leading-none"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="shimmer-gold font-script text-[30px] leading-tight">
            {wedding.groom}
          </span>
          <span className="my-0.5 font-serif text-[15px] text-primary/90">
            &amp;
          </span>
          <span className="shimmer-gold font-script text-[30px] leading-tight">
            {wedding.bride}
          </span>
        </h1>

        <span
          className="anim-fade-up my-2 h-px w-8 bg-primary/60"
          style={{ animationDelay: "0.8s" }}
        />

        <p
          className="anim-fade-up text-[9px] tracking-[0.25em] text-primary/85"
          style={{ animationDelay: "0.9s" }}
        >
          {dateShort}
        </p>
      </div>
    </div>
  );
}
