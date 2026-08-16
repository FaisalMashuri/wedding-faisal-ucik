"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Registrasi sekali di satu tempat. Semua komponen yang butuh GSAP mengimpor
// dari modul ini, bukan dari "gsap" langsung — supaya tidak ada komponen yang
// jalan sebelum plugin-nya terdaftar.
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Yang discroll di undangan ini BUKAN window, tapi div ber-overflow di
 * page.tsx (shell-nya dikunci `h-dvh overflow-hidden` di layout.tsx).
 * ScrollTrigger menerima selector string untuk `scroller`, jadi cukup satu id
 * — tidak perlu context/ref dioper ke lima komponen bersaudara.
 */
export const SCROLLER = "#invite-scroll";

/* ---- Bahasa gerak bersama: halus & elegan ----
   EASE sengaja padanan cubic-bezier(.22,.61,.36,1) yang dipakai onboarding,
   supaya seluruh situs terasa satu suara. */
export const EASE = "power2.out";
export const EASE_SETTLE = "power3.out";
export const RISE = 20; // px — jarak naik saat muncul
export const DUR = 0.6; // detik
export const STAGGER = 0.09; // jeda antar elemen bersaudara

/**
 * Preset ScrollTrigger untuk reveal sekali-jalan di dalam container kustom.
 * `once: true` — tidak mengulang saat tamu scroll balik ke atas.
 */
export function revealST(trigger: Element, start = "top 82%") {
  return { trigger, scroller: SCROLLER, start, once: true } as const;
}

export { gsap, ScrollTrigger, useGSAP };
