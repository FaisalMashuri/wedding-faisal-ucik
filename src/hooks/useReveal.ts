"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  ensureGsap,
  getScroller,
  REVEAL_START,
  REVEAL_START_PCT,
  REVEAL_START_FALLBACK,
  EASE,
  RISE,
  DUR,
  STAGGER,
} from "@/lib/gsap";

/** Class penanda elemen yang ikut reveal. Ditulis di JSX section. */
export const REVEAL = "js-reveal";

type Options = {
  /** Jeda sebelum rangkaian mulai (Hero perlu ini, menunggu cover onboarding naik). */
  delay?: number;
  /** Titik picu, mis. "top 70%" kalau elemen perlu muncul lebih awal. */
  start?: string;
  /**
   * Selama `false`, hook TIDAK menyentuh apa pun — elemen dibiarkan di posisi
   * normalnya, tidak disembunyikan dan tidak dipasangi trigger. Dipakai Hero:
   * section-nya sudah mount di balik layar onboarding, jadi tanpa gerbang ini
   * reveal-nya habis dimainkan sementara tamu belum melihat apa-apa.
   */
  enabled?: boolean;
  dependencies?: unknown[];
};

/**
 * Reveal untuk elemen ber-class `.js-reveal` di dalam scope.
 *
 * Pemicunya PER ELEMEN, bukan per section. Sebelumnya satu ScrollTrigger
 * dipasang di section, jadi begitu ujung atas section menyentuh layar seluruh
 * isinya ikut menyala — termasuk yang masih jauh di bawah lipatan. Saat tamu
 * benar-benar menggulir ke sana, animasinya sudah lewat dan tidak terlihat.
 *
 * `ScrollTrigger.batch` menjaga rasa stagger-nya: elemen yang masuk layar
 * dalam jendela waktu yang sama dikelompokkan dan dimunculkan berurutan,
 * sementara yang belum kelihatan tetap menunggu gilirannya.
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
  const { delay = 0, start = REVEAL_START, enabled = true, dependencies } = opts;
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !enabled) return;
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

        const sc = getScroller();

        // Elemen di dasar section TERAKHIR tidak akan pernah naik sampai garis
        // picu — halaman berhenti sebelum itu, jadi mereka tidak muncul sama
        // sekali. Cek jangkauannya di sini dan beri patokan cadangan; dihitung,
        // bukan ditandai manual, supaya elemen baru ikut terlindungi.
        const unreachable = new Set<HTMLElement>();
        if (sc) {
          const vh = sc.clientHeight;
          const maxScroll = sc.scrollHeight - vh;
          const scTop = sc.getBoundingClientRect().top;
          const lineY = (vh * REVEAL_START_PCT) / 100;
          for (const el of items) {
            const topInContent =
              el.getBoundingClientRect().top - scTop + sc.scrollTop;
            if (topInContent - maxScroll > lineY) unreachable.add(el);
          }
        }

        const batchOf = (list: HTMLElement[], startAt: string) => {
          if (!list.length) return;
          ScrollTrigger.batch(list, {
            scroller: sc ?? undefined,
            start: startAt,
            once: true,
            // Jendela pengelompokan: digulir cepat, beberapa elemen masuk
            // bersamaan dan dapat stagger; digulir pelan, masing-masing
            // muncul sendiri tepat saat gilirannya tiba.
            interval: 0.12,
            batchMax: 6,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: DUR,
                ease: EASE,
                stagger: STAGGER,
                delay,
                overwrite: true,
              }),
          });
        };

        batchOf(
          items.filter((el) => !unreachable.has(el)),
          start
        );
        batchOf([...unreachable], REVEAL_START_FALLBACK);
      });

      return () => mm.revert();
    },
    // `enabled` ikut jadi dependency: saat ia berubah false -> true, useGSAP
    // menjalankan ulang callback ini, dan di situlah reveal-nya baru dipasang.
    { scope, dependencies: [enabled, ...(dependencies ?? [])] }
  );

  return scope;
}
