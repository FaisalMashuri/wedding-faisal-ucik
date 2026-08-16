"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Registrasi sekali di satu tempat, tapi SENGAJA bukan di module scope.
 *
 * Modul client dievaluasi sebelum React hydrate. Menjalankan registerPlugin di
 * sana membuat ScrollTrigger menyentuh inline style <body>, yang memaksa
 * browser menulis ulang style itu (shorthand mekar jadi longhand, `#4a7883`
 * jadi `rgb(74, 120, 131)`). Atribut hasilnya lalu berbeda dari HTML server dan
 * React melaporkan ketidakcocokan hydration.
 *
 * Dipanggil dari dalam callback useGSAP, yang jalan di layout effect — setelah
 * hydration selesai, jadi tidak ada yang bisa berselisih lagi.
 */
let registered = false;
export function ensureGsap() {
  if (registered) return;
  registered = true;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/**
 * Yang discroll di undangan ini BUKAN window, tapi div ber-overflow di
 * page.tsx (shell-nya dikunci `h-dvh overflow-hidden` di layout.tsx).
 * ScrollTrigger menerima selector string untuk `scroller`, jadi cukup satu id
 * — tidak perlu context/ref dioper ke lima komponen bersaudara.
 */
export const SCROLLER = "#invite-scroll";

/**
 * Scroller WAJIB diserahkan ke ScrollTrigger sebagai elemen, bukan string.
 * useGSAP membungkus callback-nya dalam gsap.context(fn, scope), dan di dalam
 * context ber-scope semua selector string diresolusi relatif terhadap scope
 * itu — sedangkan #invite-scroll adalah LELUHUR section, bukan keturunannya.
 * Kalau dikirim sebagai string, ScrollTrigger tidak menemukannya dan melempar
 * "Cannot read properties of undefined (reading '_gsap')".
 */
export function getScroller(): HTMLElement | null {
  const el = document.querySelector<HTMLElement>(SCROLLER);
  if (!el && process.env.NODE_ENV !== "production") {
    console.warn(
      `[gsap] ${SCROLLER} tidak ditemukan — ScrollTrigger akan jatuh ke window ` +
        `dan reveal terpicu di waktu yang salah.`
    );
  }
  return el;
}

/* ---- Bahasa gerak bersama: halus & elegan ----
   EASE sengaja padanan cubic-bezier(.22,.61,.36,1) yang dipakai onboarding,
   supaya seluruh situs terasa satu suara. */
export const EASE = "power2.out";
export const EASE_SETTLE = "power3.out";
/**
 * EASE yang sama dalam bentuk cubic-bezier, untuk yang bukan GSAP (Motion).
 * Ditaruh di sini supaya kurva gerak situs ini punya satu sumber kebenaran.
 * Tuple, bukan `as const`: readonly array tidak memenuhi tipe Easing Motion.
 */
export const EASE_CSS: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
export const RISE = 20; // px — jarak naik saat muncul
export const DUR = 0.6; // detik
export const STAGGER = 0.09; // jeda antar elemen bersaudara

/**
 * Titik picu reveal: elemen mulai muncul saat ujung ATASNYA SENDIRI menyentuh
 * 88% tinggi layar — yaitu tepat ketika ia benar-benar menyembul dari bawah.
 *
 * Nilai ini dibaca terhadap ELEMEN, bukan section. Memicu dari section membuat
 * seluruh isinya menyala begitu ujung atas section terlihat, padahal sebagian
 * masih jauh di bawah lipatan — animasinya jadi habis sebelum tamu sampai.
 */
export const REVEAL_START_PCT = 88;
export const REVEAL_START = `top ${REVEAL_START_PCT}%`;

/**
 * Patokan cadangan untuk elemen yang TIDAK PERNAH bisa mencapai garis di atas:
 * yang duduk di dasar section terakhir (mis. disclaimer Outro) berhenti jauh
 * di bawah 88% karena halaman sudah mentok. Tanpa ini mereka tidak pernah
 * muncul sama sekali. Dipilih otomatis di useReveal, bukan disetel manual.
 */
export const REVEAL_START_FALLBACK = "top bottom";

/**
 * Preset ScrollTrigger untuk reveal sekali-jalan di dalam container kustom.
 * `once: true` — tidak mengulang saat tamu scroll balik ke atas.
 */
export function revealST(trigger: Element, start: string = REVEAL_START) {
  return { trigger, scroller: getScroller() ?? undefined, start, once: true };
}

export { gsap, ScrollTrigger, useGSAP };
