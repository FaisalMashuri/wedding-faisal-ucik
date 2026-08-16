"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ensureGsap,
  revealST,
  EASE,
  RISE,
  DUR,
  STAGGER,
} from "@/lib/gsap";

/** Class penanda elemen yang ikut reveal. Ditulis di JSX section. */
export const REVEAL = "js-reveal";

type Options = {
  /** Jeda sebelum rangkaian mulai (Hero perlu ini, menunggu cover loader larut). */
  delay?: number;
  /** Titik picu ScrollTrigger, mis. "top 70%" untuk elemen yang lebih pendek. */
  start?: string;
  dependencies?: unknown[];
};

/**
 * Reveal berurutan untuk elemen ber-class `.js-reveal` di dalam scope.
 *
 * Sengaja TIDAK memakai komponen pembungkus: elemen ditarget langsung lewat
 * querySelectorAll, jadi tidak ada node DOM baru. Itu penting karena banyak
 * elemen di undangan ini `absolute` dengan koordinat persen — pembungkus
 * ber-transform akan jadi containing block-nya dan merusak posisinya.
 *
 * Semua tween (termasuk gsap.set yang menyembunyikan elemen) ada di dalam
 * gsap.matchMedia: kalau tamu menyalakan "kurangi gerak", blok ini tidak
 * pernah jalan sama sekali, jadi elemen langsung tampil di posisi normalnya.
 */
export function useReveal<T extends HTMLElement>(opts: Options = {}) {
  const { delay = 0, start, dependencies } = opts;
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      ensureGsap();

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Elemen diresolusi manual (bukan selector string) supaya tidak
        // bergantung pada aturan scoping gsap.context di dalam matchMedia.
        const items = Array.from(
          root.querySelectorAll<HTMLElement>(`.${REVEAL}`)
        );
        if (!items.length) return;

        // useGSAP jalan di layout effect — set ini mendarat sebelum paint,
        // jadi tidak ada kedipan elemen tampil dulu lalu disembunyikan.
        gsap.set(items, { opacity: 0, y: RISE });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: DUR,
          ease: EASE,
          stagger: STAGGER,
          delay,
          scrollTrigger: revealST(root, start),
        });
      });

      return () => mm.revert();
    },
    { scope, dependencies }
  );

  return scope;
}
