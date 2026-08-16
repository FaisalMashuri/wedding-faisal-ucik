import { domAnimation } from "motion/react";

/**
 * Modul terpisah supaya import() dinamis di MotionProvider menghasilkan chunk
 * sendiri. ~15kb-nya terunduh selagi loader amplop berjalan (MIN_LOADER_MS
 * 2600ms), jauh dari jalur hidrasi.
 *
 * `domAnimation` — bukan `domMax` — sudah cukup: kita hanya pakai variants,
 * AnimatePresence, dan gesture. Konsekuensinya prop `layout` dan
 * AnimatePresence mode="popLayout" TIDAK tersedia, dan itu memang disengaja
 * (lihat catatan di RsvpSection soal IntersectionObserver).
 */
export default domAnimation;
