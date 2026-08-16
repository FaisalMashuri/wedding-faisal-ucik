"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("./motion-features").then((m) => m.default);

/**
 * Motion dipakai terbatas: hanya untuk yang digerakkan React state dan butuh
 * exit animation (flip angka countdown, pergantian label tombol kirim).
 * Semua yang digerakkan scroll ditangani GSAP ScrollTrigger.
 *
 * `strict` menyalakan galat keras kalau ada `motion.div` biasa nyelip —
 * komponen `motion` penuh memuat SEMUA fitur, jadi satu saja sudah
 * membatalkan seluruh manfaat LazyMotion. Pakai `m.*` dari "motion/react-m".
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
